"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Search, ArrowDownUp, ImageIcon } from "lucide-react";
import BannerTable from "../../../../components/admin/banner/bannerTable";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Button } from "../../../../components/ui/button";
import BannerForm from "../../../../components/admin/banner/bannerForm";
import DeleteConfirmation from "../../../../components/admin/banner/deleteConfirmation";

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
  const [searchTerm, setSearchTerm] = useState("");

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
      setError(null);

      try {
        const res = await fetch("/api/banner/getBanner");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch banners");
        }
        const data = await res.json();
        setBanners(data);
      } catch (err: unknown) {
        console.error("Error fetching banners:", err);
        const errorMessage =
          err && typeof err === "object" && "message" in err
            ? (err as { message?: string }).message
            : "Failed to load banners. Please try again.";
        setError(errorMessage || "Failed to load banners. Please try again.");
        toast.error(errorMessage || "Failed to load banners. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners().catch((err) => {
      console.error("Unhandled error in fetchBanners:", err);
      setError("An unexpected error occurred");
      setIsLoading(false);
    });
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save banner");
      }

      toast.success(
        selectedBanner
          ? "Banner updated successfully"
          : "Banner created successfully"
      );

      // Refresh banner list
      try {
        const refreshRes = await fetch("/api/banner/getBanner");
        if (!refreshRes.ok) {
          throw new Error("Failed to refresh banner list");
        }
        const updatedBanners = await refreshRes.json();
        setBanners(updatedBanners);
      } catch (refreshError) {
        console.error("Error refreshing banner list:", refreshError);
        toast.error("Banner saved but failed to refresh list");
      }

      setIsFormOpen(false);
      setSelectedBanner(null);
    } catch (err: unknown) {
      console.error("Error saving banner:", err);
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message
          : "Failed to save banner. Please try again.";
      toast.error(errorMessage || "Failed to save banner. Please try again.");
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete banner");
      }

      toast.success("Banner deleted successfully");
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete.id));
      setIsDeleteDialogOpen(false);
      setBannerToDelete(null);
    } catch (err: unknown) {
      console.error("Error deleting banner:", err);
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message
          : "Failed to delete banner. Please try again.";
      toast.error(errorMessage || "Failed to delete banner. Please try again.");
    }
  };

  // Filter banners based on search term
  const filteredBanners = banners.filter((banner) =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full p-6">
      {/* Page Header */}
      <motion.div
        variants={item}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <ImageIcon className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold">Banner Management</h1>
        </div>

        <Button
          onClick={() => {
            setIsFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Add New Banner
        </Button>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        variants={item}
        className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search banners..."
              className="pl-9 border border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={sortConfig.key}
              onValueChange={(value) => handleSort(value as keyof Banner)}
            >
              <SelectTrigger className="w-[160px] border border-gray-200">
                <div className="flex items-center gap-2">
                  <ArrowDownUp className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Banner List */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
      >
        <motion.div variants={item} className="w-full">
          {filteredBanners.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-500">
                No banners available
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Add a new banner to get started
              </p>
              <Button
                onClick={() => setIsFormOpen(true)}
                variant="outline"
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Banner
              </Button>
            </div>
          ) : (
            <BannerTable
              banners={filteredBanners}
              isLoading={isLoading}
              error={error}
              sortConfig={sortConfig}
              requestSort={handleSort}
              currentPage={currentPage}
              totalPages={Math.ceil(filteredBanners.length / rowsPerPage)}
              rowsPerPage={rowsPerPage}
              totalBanners={filteredBanners.length}
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

        {/* Banner Form Modal */}
        {isFormOpen && (
          <BannerForm
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedBanner(null);
            }}
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
