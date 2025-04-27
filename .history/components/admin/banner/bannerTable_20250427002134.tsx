"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalBanners: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
}

export default function BannerTable({
  banners,
  currentPage,
  totalPages,
  rowsPerPage,
  totalBanners,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}: BannerTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full overflow-x-auto">
            <Table className="w-full text-sm border-separate border-spacing-0">
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="border border-muted p-4 font-semibold text-muted-foreground text-center">
                    Gambar
                  </TableHead>
                  <TableHead className="border border-muted p-4 font-semibold text-muted-foreground text-center">
                    Judul Banner
                  </TableHead>
                  <TableHead className="border border-muted p-4 font-semibold text-muted-foreground text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow
                    key={banner.id}
                    className="hover:bg-muted transition-colors"
                  >
                    <TableCell className="border border-muted p-4 text-center">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="h-20 w-32 object-cover rounded-md mx-auto"
                      />
                    </TableCell>
                    <TableCell className="border border-muted p-4 font-medium text-center">
                      {banner.title}
                    </TableCell>
                    <TableCell className="border border-muted p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => onEdit(banner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => onDelete(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * rowsPerPage + 1} -{" "}
          {Math.min(currentPage * rowsPerPage, totalBanners)} of {totalBanners}{" "}
          banners
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => onRowsPerPageChange(parseInt(value))}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </Button>
            <span className="px-2 text-sm">
              {currentPage} / {totalPages}
            </span>
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
    </motion.div>
  );
}
