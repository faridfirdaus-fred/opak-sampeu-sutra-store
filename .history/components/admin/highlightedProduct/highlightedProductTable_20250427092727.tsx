"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteConfirmation from "@/components/admin/highlightedProduct/deleteConfirmation";

interface HighlightedProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

interface HighlightedProductTableProps {
  products: HighlightedProduct[];
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
  onEdit: (product: HighlightedProduct) => void;
  onDelete: (id: string) => void;
}

export default function HighlightedProductTable({
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
}: HighlightedProductTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<HighlightedProduct | null>(null);

  const handleDeleteClick = (product: HighlightedProduct) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      onDelete(productToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

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

  return (
    <motion.div
      variants={tableAnimation}
      initial="hidden"
      animate="visible"
      className="w-full h-full"
    >
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
              <TableCell
                onClick={() => requestSort("name")}
                className="cursor-pointer"
              >
                Nama Produk {getSortIcon("name")}
              </TableCell>
              <TableCell
                onClick={() => requestSort("price")}
                className="cursor-pointer"
              >
                Harga {getSortIcon("price")}
              </TableCell>
              <TableCell
                onClick={() => requestSort("stock")}
                className="cursor-pointer"
              >
                Stok {getSortIcon("stock")}
              </TableCell>
              <TableCell
                onClick={() => requestSort("category")}
                className="cursor-pointer"
              >
                Kategori {getSortIcon("category")}
              </TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Tidak ada produk yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-slate-50/50">
                  <TableCell>{product.name}</TableCell>
                  <TableCell>Rp {product.price.toLocaleString()}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(product)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !error && products.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t mt-px">
          <div className="text-sm text-slate-500">
            Menampilkan{" "}
            <span className="font-medium text-slate-700">
              {(currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            hingga{" "}
            <span className="font-medium text-slate-700">
              {Math.min(currentPage * rowsPerPage, totalProducts)}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-slate-700">{totalProducts}</span>{" "}
            produk
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
          </div>
        </div>
      )}
    </motion.div>
  );
}
