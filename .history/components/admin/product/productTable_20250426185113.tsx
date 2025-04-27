"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  PackageSearch,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  sortConfig: {
    key: "name" | "price" | "stock" | "category";
    direction: "ascending" | "descending";
  };
  requestSort: (key: "name" | "price" | "stock" | "category") => void;
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (value: number) => void;
  totalProducts: number;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductTable({
  products,
  isLoading,
  error,
  sortConfig,
  requestSort,
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalProducts,
  onEdit,
  onDelete,
}: ProductTableProps) {
  // Dapatkan status sidebar (collapsed atau tidak)
  const { collapsed } = useSidebar();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getSortIcon = (columnName: string) => {
    if (sortConfig.key !== columnName) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="h-4 w-4 ml-1 text-primary" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1 text-primary" />
    );
  };

  const tableAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return (
    <motion.div
      variants={tableAnimation}
      initial="hidden"
      animate="visible"
      className="w-full overflow-hidden rounded-lg border border-border shadow-sm bg-card"
    >
      <div className="overflow-x-auto">
        <div className="w-full">
          <Table className="w-full">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="w-24 py-3 font-medium text-muted-foreground">
                  Gambar
                </TableHead>
                <TableHead
                  className="py-3 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center font-medium">
                    Nama
                    {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead
                  className="py-3 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("price")}
                >
                  <div className="flex items-center font-medium">
                    Harga
                    {getSortIcon("price")}
                  </div>
                </TableHead>
                <TableHead
                  className="py-3 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => requestSort("stock")}
                >
                  <div className="flex items-center font-medium">
                    Stok
                    {getSortIcon("stock")}
                  </div>
                </TableHead>
                <TableHead className="py-3 font-medium text-muted-foreground">
                  Kategori
                </TableHead>
                <TableHead className="py-3 text-right font-medium text-muted-foreground">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col justify-center items-center h-24 gap-2">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                      <p className="text-muted-foreground text-sm">
                        Mengambil data produk...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <span className="text-xl">!</span>
                      </div>
                      <p className="text-red-500 font-medium">Error</p>
                      <p className="text-muted-foreground text-sm">{error}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <PackageSearch className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-lg mt-2">
                        Tidak ada produk
                      </h3>
                      <p className="text-muted-foreground text-sm max-w-md">
                        Belum ada produk yang ditambahkan. Klik tombol "Add
                        Product" untuk mulai menambahkan produk baru.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-b transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="py-3 pl-4">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden border">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground text-xs">
                              No image
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-sm whitespace-nowrap">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center">
                        <span
                          className={cn(
                            "text-sm",
                            product.stock <= 5
                              ? "text-red-500"
                              : "text-green-600"
                          )}
                        >
                          {product.stock} pcs
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-right pr-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => onEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        {deleteConfirmId === product.id ? (
                          <div className="flex items-center gap-1 bg-red-50 rounded-md px-2 py-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 hover:bg-white hover:text-red-500 text-xs"
                              onClick={confirmDelete}
                            >
                              Ya
                            </Button>
                            <span className="text-muted-foreground">|</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 hover:bg-white text-xs"
                              onClick={cancelDelete}
                            >
                              Tidak
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-500"
                            onClick={() => handleDeleteClick(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

{/* Pagination controls */}
{!isLoading && !error && products.length > 0 && (
  <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-muted/20 border-t gap-4">
    {/* Left: Summary */}
    <div className="text-sm text-muted-foreground flex-1">
      Menampilkan{" "}
      <span className="font-medium">
        {(currentPage - 1) * rowsPerPage + 1}
      </span>{" "}
      sampai{" "}
      <span className="font-medium">
        {Math.min(currentPage * rowsPerPage, totalProducts)}
      </span>{" "}
      dari <span className="font-medium">{totalProducts}</span> produk
    </div>

    {/* Center: Pagination */}
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="px-3 py-1 bg-white rounded border text-sm">
        <span className="font-medium">{currentPage}</span>
        <span className="text-muted-foreground"> / {totalPages}</span>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>

    {/* Right: Rows Per Page */}
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Baris per halaman:</span>
      {onRowsPerPageChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-2">
              {rowsPerPage} <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {[10, 20, 50, 100].map((pageSize) => (
              <DropdownMenuItem
                key={pageSize}
                onClick={() => onRowsPerPageChange(pageSize)}
                className={cn(
                  "cursor-pointer",
                  rowsPerPage === pageSize &&
                    "bg-primary/10 font-medium text-primary"
                )}
              >
                {pageSize} per halaman
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  </div>
)}
    </motion.div>
