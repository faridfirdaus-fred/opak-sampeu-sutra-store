"use client";

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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react"; // Add this import
import DeleteConfirmation from "./deleteConfirmation"; // Add this import

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
  onRowsPerPageChange?: (rowsPerPage: number) => void;
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
  const { collapsed } = useSidebar();
  // Add state for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  // Function to handle delete button click
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  // Function to handle delete confirmation
  const handleDeleteConfirm = () => {
    if (productToDelete) {
      onDelete(productToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  // Function to handle delete cancellation
  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  const getSortIcon = (columnName: string) => {
    if (sortConfig.key !== columnName) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const tableAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  function cn(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <motion.div
      variants={tableAnimation}
      initial="hidden"
      animate="visible"
      className="w-full h-full"
    >
      {/* Add DeleteConfirmation component */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        count={1}
        candidateName={productToDelete?.name || ""}
      />
      <div className="w-full overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm">
        <Table className="w-full divide-x">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 hover:bg-slate-50/90 divide-x divide-slate-200">
              <TableHead className="w-24 py-4 font-semibold text-slate-700">
                Image
              </TableHead>
              <TableHead
                className="cursor-pointer py-4 font-semibold text-slate-700 transition-colors hover:text-primary"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  <span className="text-slate-400 hover:text-primary transition-colors">
                    {getSortIcon("name")}
                  </span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer py-4 font-semibold text-slate-700 transition-colors hover:text-primary"
                onClick={() => requestSort("price")}
              >
                <div className="flex items-center gap-1">
                  Price
                  <span className="text-slate-400 hover:text-primary transition-colors">
                    {getSortIcon("price")}
                  </span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer py-4 font-semibold text-slate-700 transition-colors hover:text-primary"
                onClick={() => requestSort("stock")}
              >
                <div className="flex items-center gap-1">
                  Stock
                  <span className="text-slate-400 hover:text-primary transition-colors">
                    {getSortIcon("stock")}
                  </span>
                </div>
              </TableHead>
              <TableHead className="py-4 font-semibold text-slate-700">
                Category
              </TableHead>
              <TableHead className="text-right py-4 font-semibold text-slate-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="h-9 w-9 p-0 rounded-full hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-all"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(product)}
                      className="h-9 w-9 p-0 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-14">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-3 rounded-full bg-red-50 text-red-500">
                      <Trash2 className="h-6 w-6" />
                    </div>
                    <p className="text-red-500 font-medium">{error}</p>
                    <p className="text-sm text-slate-500">
                      Please try again later
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-14">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-3 rounded-full bg-slate-50 text-slate-400">
                      <ArrowDownRight className="h-6 w-6" />
                    </div>
                    <p className="text-slate-600 font-medium">
                      No products found
                    </p>
                    <p className="text-sm text-slate-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, idx) => (
                <TableRow
                  key={product.id}
                  className={cn(
                    "border-b transition-colors",
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/30",
                    "hover:bg-blue-50/30"
                  )}
                >
                  <TableCell className="py-4">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                          <span className="text-slate-400 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-slate-700 font-medium">
                    <div className="flex items-center">
                      <span className="text-xs text-slate-500 mr-1">Rp</span>
                      {product.price.toLocaleString("id-ID")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        product.stock > 10
                          ? "bg-green-50 text-green-700"
                          : product.stock > 0
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                      )}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="h-9 w-9 p-0 rounded-full hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="h-9 w-9 p-0 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Simplified Pagination */}
      {!isLoading && !error && products.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t mt-px">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {(currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-slate-700">
              {Math.min(currentPage * rowsPerPage, totalProducts)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">{totalProducts}</span>{" "}
            products
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-3 py-1 bg-slate-50 rounded-md border text-sm font-medium">
              {currentPage} / {totalPages}
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

            {onRowsPerPageChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2 h-8">
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
                      {pageSize} per page
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
