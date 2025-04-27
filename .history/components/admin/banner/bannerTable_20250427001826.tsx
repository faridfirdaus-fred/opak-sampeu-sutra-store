"use client";

import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface BannerTableProps {
  banners: Banner[];
  isLoading?: boolean;
  error?: string | null;
  sortConfig?: {
    key: keyof Banner;
    direction: "ascending" | "descending";
  };
  requestSort?: (key: keyof Banner) => void;
  currentPage?: number;
  totalPages?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (value: number) => void;
  totalBanners?: number;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
}

export default function BannerTable({
  banners,
  isLoading = false,
  error = null,
  sortConfig = { key: "title", direction: "ascending" },
  requestSort = () => {},
  currentPage = 1,
  totalPages = 1,
  rowsPerPage = 10,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  totalBanners = 0,
  onEdit,
  onDelete,
}: BannerTableProps) {
  const renderSortIcon = (columnKey: keyof Banner) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="ml-1 h-4 w-4 text-muted-foreground" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 text-muted-foreground" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Card className="border shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full overflow-x-auto">
            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="w-[220px] font-semibold text-muted-foreground">
                    Image
                  </TableHead>
                  <TableHead
                    className="cursor-pointer font-semibold text-muted-foreground"
                    onClick={() => requestSort("title")}
                  >
                    <div className="flex items-center">
                      Title {renderSortIcon("title")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow
                    key={banner.id}
                    className="hover:bg-muted transition-colors"
                  >
                    <TableCell>
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="h-24 w-48 object-cover rounded-lg"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {banner.title}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit(banner)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(banner.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
          <div className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * rowsPerPage + 1}-
            {Math.min(currentPage * rowsPerPage, totalBanners)} of{" "}
            {totalBanners} banners
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <p className="text-xs text-muted-foreground mr-2">
                Rows per page
              </p>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => onRowsPerPageChange(parseInt(value))}
              >
                <SelectTrigger className="h-8 w-20">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </Button>

              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={index + 1 === currentPage ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
