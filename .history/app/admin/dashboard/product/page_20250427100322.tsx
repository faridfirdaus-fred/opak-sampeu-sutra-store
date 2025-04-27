"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Search, ArrowDownUp, Star } from "lucide-react";

import ProductTable from "@/components/admin/product/productTable";
import ProductForm from "@/components/admin/product/productForm";
import SearchAndFilter from "@/components/admin/product/searchAndFilter";
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

// Updated Product interface with highlighted information
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  container?: string;
  imageUrl?: string;
  highlighted?: {
    id: string;
    isActive: boolean;
  } | null;
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

export default function ProductPage() {
  // State untuk data produk
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState("all");
  const [highlightFilter, setHighlightFilter] = useState("all");

  // Sort, filter, pagination state
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch all products with highlighted status
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/highlightedProduct/getHighlightedProduct?active=true", {
      setIsLoading(false);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
        toast.error("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtering and sorting logic
  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    // Apply category filter
    if (activeView !== "all") {
      filtered = filtered.filter(
        (p) => p.category === activeView.toUpperCase()
      );
    }

    // Apply highlight filter
    if (highlightFilter === "highlighted") {
      filtered = filtered.filter((p) => p.highlighted);
    } else if (highlightFilter === "not-highlighted") {
      filtered = filtered.filter((p) => !p.highlighted);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
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

  const filteredProducts = getFilteredAndSortedProducts();
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sorting
  const requestSort = (key: "name" | "price" | "stock" | "category") => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
  };

  // Pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // CRUD operations
  const handleSaveProduct = async (formData: any) => {
    try {
      if (selectedProduct) {
        // Update existing product
        const res = await fetch("/api/product/editProduct", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedProduct.id,
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10),
          }),
        });

        if (!res.ok) throw new Error("Failed to update product");
        toast.success("Product updated successfully");
      } else {
        // Create new product
        const res = await fetch("/api/product/createProduct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10),
          }),
        });

        if (!res.ok) throw new Error("Failed to create product");
        toast.success("Product created successfully");
      }

      // Refresh products list
      const res = await fetch("/api/product/getProductWithHighlighted");
      const data = await res.json();
      setProducts(data);
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error("Failed to save product. Please try again.");
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/product/deleteProduct?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted successfully");

      // Refresh products list
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  // Toggle highlight status
  const handleToggleHighlight = async (product: Product) => {
    try {
      if (product.highlighted) {
        // If product is already highlighted, remove highlight
        const res = await fetch(
          `/api/highlightedProduct/deleteHighlightedProduct?id=${product.highlighted.id}`,
          {
            method: "DELETE",
          }
        );

        if (!res.ok) throw new Error("Failed to remove highlight");

        // Update local state
        setProducts(
          products.map((p) =>
            p.id === product.id ? { ...p, highlighted: null } : p
          )
        );

        toast.success(
          `"${product.name}" tidak lagi ditampilkan sebagai produk unggulan`
        );
      } else {
        // If product is not highlighted, add highlight
        const res = await fetch(
          "/api/highlightedProduct/createHighlightedProduct",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: product.id,
              isActive: true,
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to highlight product");

        const data = await res.json();

        // Update local state
        setProducts(
          products.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  highlighted: {
                    id: data.id,
                    isActive: data.isActive,
                  },
                }
              : p
          )
        );

        toast.success(`"${product.name}" ditampilkan sebagai produk unggulan`);
      }
    } catch (err) {
      console.error("Error toggling highlight status:", err);
      toast.error("Gagal mengubah status highlight produk. Silakan coba lagi.");
    }
  };

  // Count products by category
  const categoryCount = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);

  // Count highlighted products
  const highlightedCount = products.filter((p) => p.highlighted).length;

  return (
    <div className="w-full h-full">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="flex flex-col h-full space-y-4"
      >
        {/* Page Header */}
        <motion.div variants={item} className="px-6 py-4">
          <h1 className="text-2xl font-bold tracking-tight">Produk</h1>
          <p className="text-sm text-muted-foreground">
            Kelola inventaris produk dan produk unggulan
          </p>
        </motion.div>

        {/* Tabs & Stats */}
        <motion.div variants={item} className="px-6">
          <Tabs
            value={activeView}
            onValueChange={setActiveView}
            className="w-full"
          >
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                Semua
                <span className="ml-2 bg-muted-foreground/20 text-xs rounded-full px-2 py-0.5">
                  {products.length}
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
              <TabsTrigger
                value="highlighted"
                className="data-[state=active]:bg-yellow-50"
              >
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Produk Unggulan
                  <span className="ml-1 bg-yellow-100 text-yellow-700 text-xs rounded-full px-2 py-0.5">
                    {highlightedCount}
                  </span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Filter & Actions Bar */}
        <motion.div
          variants={item}
          className="flex px-6 flex-col sm:flex-row gap-2 items-end sm:items-center justify-between"
        >
          <SearchAndFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            highlightFilter={highlightFilter}
            setHighlightFilter={setHighlightFilter}
          />

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
                setSelectedProduct(null);
                setIsModalOpen(true);
              }}
              className="gap-1"
              size="sm"
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </motion.div>

        {/* Product Table */}
        <motion.div variants={item} className="w-full px-6">
          <Card className="border shadow-sm overflow-hidden h-full">
            <CardContent className="p-4 h-full">
              <ProductTable
                products={paginatedProducts}
                isLoading={isLoading}
                error={error}
                sortConfig={sortConfig}
                requestSort={requestSort}
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                totalProducts={filteredProducts.length}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onToggleHighlight={handleToggleHighlight}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Product Form Modal */}
        <ProductForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveProduct}
          product={selectedProduct}
        />
      </motion.div>
    </div>
  );
}
