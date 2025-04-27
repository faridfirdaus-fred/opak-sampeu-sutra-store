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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Pagination & sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Banner;
    direction: "ascending" | "descending";
  }>({
    key: "title",
    direction: "ascending",
  });

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/banner/getBanner");

        if (!res.ok) throw new Error("Failed to fetch banners");

        const data = await res.json();
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to load banners. Please try again.");
        toast.error("Failed to load banners. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Handle sorting
  const handleSort = (key: keyof Banner) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Handle edit banner
  const handleEditBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsFormOpen(true);
  };

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
        const res = await fetch(`/api/banner/createBanner`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed to create banner");
        toast.success("Banner created successfully");
      }

      // Refresh banners list
      const res = await fetch("/api/banner/getBanner");
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

  // Calculate pagination values
  useEffect(() => {
    setTotalPages(Math.ceil(banners.length / rowsPerPage));
  }, [banners, rowsPerPage]);

  return (
    <div className="w-full h-full space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Banners</h1>
        <Button
          onClick={() => {
            setSelectedBanner(null);
            setIsFormOpen(true);
          }}
          className="bg-indigo-600 text-white"
        >
          Tambah Banner
        </Button>
      </div>

      {/* Banner Table */}
      <BannerTable
        banners={banners}
        isLoading={isLoading}
        error={error}
        sortConfig={sortConfig}
        requestSort={handleSort}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalBanners={banners.length}
        onEdit={handleEditBanner}
        onDelete={(id) => {
          const banner = banners.find((b) => b.id === id);
          setBannerToDelete(banner || null);
          setIsDeleteDialogOpen(true);
        }}
      />

      {/* Banner Form */}
      {isFormOpen && (
        <BannerForm
          onSubmit={(formData) => handleSaveBanner(formData)}
          initialData={selectedBanner || undefined}
        />
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
