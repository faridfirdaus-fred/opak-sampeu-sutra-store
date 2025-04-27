"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent } from "@/components/ui/card";

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
  // Define animation variants
  const tableAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={tableAnimation}
      initial="hidden"
      animate="visible"
      className="w-full h-full"
    >
      <Card className="border shadow-sm overflow-hidden h-full">
        <CardContent className="p-4 h-full">
          <div className="w-full overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm">
            <Table className="w-full divide-x">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 hover:bg-slate-50/90 divide-x divide-slate-200">
                  <TableHead className="w-[40%] py-4 font-semibold text-slate-700 text-center">
                    Gambar
                  </TableHead>
                  <TableHead className="w-[20%] py-4 font-semibold text-slate-700 text-center">
                    Judul Banner
                  </TableHead>
                  <TableHead className="w-[20%] py-4 font-semibold text-slate-700 text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <motion.tr
                    key={banner.id}
                    variants={tableAnimation}
                    initial="hidden"
                    animate="visible"
                    className="border-b transition-colors divide-x divide-slate-200 hover:bg-blue-50/30"
                  >
                    <TableCell className="w-[40%] py-4 text-center">
                      <div className="w-48 h-28 relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-sm mx-auto">
                        {banner.imageUrl ? (
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                            <span className="text-slate-400 text-xs">
                              Tidak ada gambar
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-[20%] font-medium text-slate-800 text-center">
                      {banner.title}
                    </TableCell>
                    <TableCell className="w-[20%] text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(banner)}
                          className="h-9 w-9 p-0 rounded-full hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-all"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(banner.id)}
                          className="h-9 w-9 p-0 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t mt-px">
            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {banners.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-700">
                {banners.length > 0
                  ? Math.min(currentPage * rowsPerPage, totalBanners)
                  : 0}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">{totalBanners}</span>{" "}
              banners
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
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
                &gt;
              </Button>

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
                      {pageSize} per page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
