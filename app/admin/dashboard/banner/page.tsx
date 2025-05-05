"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Search, ArrowDownUp } from "lucide-react";

import BannerForm from "@/components/admin/banner/bannerForm";
import BannerTable from "@/components/admin/banner/bannerTable";
import DeleteConfirmation from "@/components/admin/banner/deleteConfirmation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Pagination & sorting states
  const [currentPage, setCurrentPage] = useState(1);
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
      setIsLoading(true);
      try {
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

  // Sorting
  const handleSort = (key: keyof Banner) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));

    const sortedBanners = [...banners].sort((a, b) => {
      if (a[key] < b[key]) return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

    setBanners(sortedBanners);
  };

  // Pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(banners.length / rowsPerPage)) return;
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // CRUD operations
  const handleSaveBanner = async (formData: {
    title: string;
    imageUrl: string;
  }) => {
    try {
      const endpoint = selectedBanner
        ? `/api/banner/editBanner`
        : `/api/banner/createBanner`;
      const method = selectedBanner ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          selectedBanner ? { id: selectedBanner.id, ...formData } : formData
        ),
      });

      if (!res.ok)
        throw new Error(
          selectedBanner ? "Failed to update banner" : "Failed to create banner"
        );

      toast.success(
        selectedBanner
          ? "Banner updated successfully"
          : "Banner created successfully"
      );

      const updatedBanners = await fetch("/api/banner/getBanner").then((res) =>
        res.json()
      );
      setBanners(updatedBanners);
      setIsFormOpen(false);
      setSelectedBanner(null);
    } catch (err) {
      console.error("Error saving banner:", err);
      toast.error("Failed to save banner. Please try again.");
    }
  };

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
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete.id));
      setIsDeleteDialogOpen(false);
      setBannerToDelete(null);
    } catch (err) {
      console.error("Error deleting banner:", err);
      toast.error("Failed to delete banner. Please try again.");
    }
  };

  return (
    <div className="w-full h-full">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="flex flex-col h-full space-y-4"
      >
        {/* Page Header */}
        <motion.div variants={item} className="w-full px-6">
          {banners.length === 0 && !isLoading ? (
            <div className="text-center text-gray-500">
              No banners available.
            </div>
          ) : (
            <BannerTable
              banners={banners}
              isLoading={isLoading}
              error={error}
              sortConfig={sortConfig}
              requestSort={handleSort}
              currentPage={currentPage}
              totalPages={Math.ceil(banners.length / rowsPerPage)}
              rowsPerPage={rowsPerPage}
              totalBanners={banners.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
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
          )}
        </motion.div>

        {/* Filter & Actions Bar */}
        <motion.div
          variants={item}
          className="flex px-6 flex-col sm:flex-row gap-2 items-end sm:items-center justify-between"
        >
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search banners..."
              className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={sortConfig.key}
              onValueChange={(value) => handleSort(value as keyof Banner)}
            >
              <SelectTrigger className="w-[130px] h-9 bg-muted/50 border-0">
                <div className="flex items-center gap-2">
                  <ArrowDownUp className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setIsFormOpen(true);
              }}
              className="gap-1"
              size="sm"
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </motion.div>

        {/* Banner Form Modal */}
        {isFormOpen && (
          <BannerForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={(formData) => handleSaveBanner(formData)}
            initialData={
              selectedBanner
                ? {
                    title: selectedBanner.title,
                    imageUrl: selectedBanner.imageUrl,
                  }
                : undefined
            }
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
      </motion.div>
    </div>
  );
}
