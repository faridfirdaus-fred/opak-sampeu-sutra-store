"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import BannerForm from "@/components/admin/banner/bannerForm";
import BannerTable from "@/components/admin/banner/bannerTable";
import DeleteConfirmation from "@/components/admin/banner/deleteConfirmation";
import { Button } from "@/components/ui/button";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
}

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banner/getBanner"); // Menggunakan endpoint getBanner
        if (!res.ok) throw new Error("Failed to fetch banner");
        const data = await res.json();
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
        toast.error("Failed to load banners. Please try again.");
      }
    };

    fetchBanners();
  }, []);

  // Handle save banner
  const handleSaveBanner = async (formData: {
    title: string;
    imageUrl: string;
  }) => {
    try {
      if (selectedBanner) {
        // Update existing banner
        const res = await fetch(`/api/banner/editBanner`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedBanner.id, ...formData }),
        });

        if (!res.ok) throw new Error("Failed to update banner");
        toast.success("Banner updated successfully");
      } else {
        // Create new banner
        const res = await fetch(`/utils/uploadT`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed to create banner");
        toast.success("Banner created successfully");
      }

      // Refresh banners list
      const res = await fetch("/api/banner/getBanner"); // Menggunakan endpoint getBanner
      const data = await res.json();
      setBanners(data);
      setIsFormOpen(false);
      setSelectedBanner(null);
    } catch (err) {
      console.error("Error saving banner:", err);
      toast.error("Failed to save banner. Please try again.");
    }
  };

  // Handle delete banner
  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;

    try {
      const res = await fetch(
        `/api/banner/deleteBanner?id=${bannerToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete banner");
      toast.success("Banner deleted successfully");

      // Refresh banners list
      const updatedBanners = banners.filter(
        (banner) => banner.id !== bannerToDelete.id
      );
      setBanners(updatedBanners);
      setIsDeleteDialogOpen(false);
      setBannerToDelete(null);
    } catch (err) {
      console.error("Error deleting banner:", err);
      toast.error("Failed to delete banner. Please try again.");
    }
  };

  return (
    <div className="w-full h-full space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Banners</h1>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white"
        >
          Tambah Banner
        </Button>
      </div>

      {/* Banner Table */}
      <BannerTable
        banners={banners}
        onEdit={(banner) => {
          setSelectedBanner(banner);
          setIsFormOpen(true);
        }}
        onDelete={(id) => {
          const banner = banners.find((b) => b.id === id);
          setBannerToDelete(banner || null);
          setIsDeleteDialogOpen(true);
        }}
      />

      {/* Banner Form */}
      {isFormOpen && (
        <BannerForm onSubmit={(formData) => handleSaveBanner(formData)} />
      )}

      {/* Delete Confirmation */}
      {isDeleteDialogOpen && bannerToDelete && (
        <DeleteConfirmation
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteBanner}
          bannerTitle={bannerToDelete.title}
        />
      )}
    </div>
  );
}
