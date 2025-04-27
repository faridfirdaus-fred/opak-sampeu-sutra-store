"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Search, ArrowDownUp } from "lucide-react";

import HighlightedProductTable from "@/components/admin/highlightedProduct/highlightedProductTable";
import HighlightedProductForm from "@/components/admin/highlightedProduct/highlightedProductForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define highlighted product type
interface HighlightedProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  container?: string;
  imageUrl?: string;
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

export default function HighlightedProductPage() {
  const [highlightedProducts, setHighlightedProducts] = useState<
    HighlightedProduct[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState("all");

  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "price" | "stock" | "category";
    direction: "ascending" | "descending";
  }>({
    key: "name",
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHighlightedProduct, setSelectedHighlightedProduct] =
    useState<HighlightedProduct | null>(null);

  useEffect(() => {
    const fetchHighlightedProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          "/api/highlightedProduct/getHighlightedProduct"
        );
        if (!res.ok) throw new Error("Failed to fetch highlighted products");
        const data = await res.json();
        setHighlightedProducts(data);
      } catch (err) {
        console.error("Error fetching highlighted products:", err);
        setError("Failed to load highlighted products.");
        toast.error("Failed to load highlighted products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlightedProducts();
  }, []);

  const getFilteredAndSortedHighlightedProducts = () => {
    let filtered = [...highlightedProducts];

    if (activeView !== "all") {
      filtered = filtered.filter(
        (p) => p.category === activeView.toUpperCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortConfig.direction === "ascending"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "ascending"
            ? aVal - bVal
            : bVal - aVal;
        }
        return 0;
      });
    }

    return filtered;
  };

  const filteredHighlightedProducts = getFilteredAndSortedHighlightedProducts();
  const totalPages = Math.ceil(
    filteredHighlightedProducts.length / rowsPerPage
  );

  const paginatedHighlightedProducts = filteredHighlightedProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const requestSort = (key: "name" | "price" | "stock" | "category") => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleSaveHighlightedProduct = async (formData: any) => {
    try {
      if (selectedHighlightedProduct) {
        const res = await fetch(
          "/api/highlightedProduct/editHighlightedProduct",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: selectedHighlightedProduct.id,
              ...formData,
              price: parseFloat(formData.price),
              stock: parseInt(formData.stock, 10),
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to update highlighted product");
        toast.success("Highlighted product updated successfully");
      } else {
        const res = await fetch(
          "/api/highlightedProduct/createHighlightedProduct",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              price: parseFloat(formData.price),
              stock: parseInt(formData.stock, 10),
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to create highlighted product");
        toast.success("Highlighted product created successfully");
      }

      const res = await fetch("/api/highlightedProduct/getHighlightedProduct");
      const data = await res.json();
      setHighlightedProducts(data);
      setIsModalOpen(false);
      setSelectedHighlightedProduct(null);
    } catch (err) {
      console.error("Error saving highlighted product:", err);
      toast.error("Failed to save highlighted product. Please try again.");
    }
  };

  const handleEditHighlightedProduct = (
    highlightedProduct: HighlightedProduct
  ) => {
    setSelectedHighlightedProduct(highlightedProduct);
    setIsModalOpen(true);
  };

  const handleDeleteHighlightedProduct = async (id: string) => {
    try {
      const res = await fetch(
        `/api/highlightedProduct/deleteHighlightedProduct?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete highlighted product");
      toast.success("Highlighted product deleted successfully");

      const updatedHighlightedProducts = highlightedProducts.filter(
        (highlightedProduct) => highlightedProduct.id !== id
      );
      setHighlightedProducts(updatedHighlightedProducts);
    } catch (err) {
      console.error("Error deleting highlighted product:", err);
      toast.error("Failed to delete highlighted product. Please try again.");
    }
  };

  const categoryCount = highlightedProducts.reduce(
    (acc, highlightedProduct) => {
      const category = highlightedProduct.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="w-full h-full">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="flex flex-col h-full space-y-4"
      >
        <motion.div variants={item} className="px-6 py-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Highlighted Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your highlighted products
          </p>
        </motion.div>

        <motion.div variants={item} className="px-6">
          <Tabs
            value={activeView}
            onValueChange={setActiveView}
            className="w-full"
          >
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All
                <span className="ml-2 bg-muted-foreground/20 text-xs rounded-full px-2 py-0.5">
                  {highlightedProducts.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="opak"
                className="data-[state=active]:bg-white"
              >
                Opak
                <span className="ml-2 bg-muted-foreground/20 text-xs rounded-full px-2 py-0.5">
                  {categoryCount["OPAK"] || 0}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="bastik"
                className="data-[state=active]:bg-white"
              >
                Bastik
                <span className="ml-2 bg-muted-foreground/20 text-xs rounded-full px-2 py-0.5">
                  {categoryCount["BASTIK"] || 0}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="kacang"
                className="data-[state=active]:bg-white"
              >
                Kacang
                <span className="ml-2 bg-muted-foreground/20 text-xs rounded-full px-2 py-0.5">
                  {categoryCount["KACANG"] || 0}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div
          variants={item}
          className="flex px-6 flex-col sm:flex-row gap-2 items-end sm:items-center justify-between"
        >
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search highlighted products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={sortConfig.key}
              onValueChange={(value) => requestSort(value as any)}
            >
              <SelectTrigger className="w-[130px] h-9 bg-muted/50 border-0">
                <div className="flex items-center gap-2">
                  <ArrowDownUp className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setSelectedHighlightedProduct(null);
                setIsModalOpen(true);
              }}
              className="gap-1"
              size="sm"
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </motion.div>

        <motion.div variants={item} className="w-full px-6">
          <Card className="border shadow-sm overflow-hidden h-full">
            <CardContent className="p-4 h-full">
              <HighlightedProductTable
                products={paginatedHighlightedProducts}
                isLoading={isLoading}
                error={error}
                sortConfig={sortConfig}
                requestSort={requestSort}
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                totalProducts={filteredHighlightedProducts.length}
                onEdit={handleEditHighlightedProduct}
                onDelete={handleDeleteHighlightedProduct}
              />
            </CardContent>
          </Card>
        </motion.div>

        <HighlightedProductForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedHighlightedProduct(null);
          }}
          onSave={handleSaveHighlightedProduct}
          product={selectedHighlightedProduct}
        />
      </motion.div>
    </div>
  );
}
