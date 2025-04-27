"use client";

interface ProductTableProps {
  products: { name: string; price: number; description: string; id: string }[];
  isLoading: boolean;
  error: string | null;
  sortConfig: {
    key: "name" | "price" | "description" | "id";
    direction: "ascending" | "descending";
  };
  requestSort: (key: "name" | "price" | "description" | "id") => void;
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  totalProducts: number;
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
}: ProductTableProps) {
  return (
    <div>
      {/* Implement table rendering logic here */}
      <p>Product Table Component</p>
    </div>
  );
}
