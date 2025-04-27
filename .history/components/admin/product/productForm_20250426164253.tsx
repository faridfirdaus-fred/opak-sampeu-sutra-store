"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/validations/ProductSchema"; // Pastikan Anda memiliki schema validasi
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { XCircle, Tag, DollarSign, Layers, Box, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  product?: any;
}

export default function ProductForm({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      stock: "",
      category: "",
      container: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name: product.name || "",
          price: product.price || "",
          stock: product.stock || "",
          category: product.category || "",
          container: product.container || "",
          imageUrl: product.imageUrl || "",
        });
      } else {
        reset();
      }
    }
  }, [isOpen, product, reset]);

  const onSubmit = (formData: any) => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="bg-background px-6 py-5 border-b">
            <DialogHeader className="mb-0">
              <DialogTitle className="text-xl font-semibold">
                {product ? "Edit Produk" : "Tambah Produk"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {product
                  ? "Perbarui informasi produk di bawah ini."
                  : "Isi detail produk baru di bawah ini."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Nama Produk <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Masukkan nama produk"
                    className={cn(
                      "transition-colors",
                      errors.name &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Price Field */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Harga <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    {...register("price")}
                    placeholder="Masukkan harga produk"
                    className={cn(
                      "transition-colors",
                      errors.price &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.price && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Stock Field */}
                <div className="space-y-2">
                  <Label htmlFor="stock" className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    Stok <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register("stock")}
                    placeholder="Masukkan jumlah stok"
                    className={cn(
                      "transition-colors",
                      errors.stock &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.stock && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                {/* Category Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="flex items-center gap-1.5"
                  >
                    <Box className="h-4 w-4 text-muted-foreground" />
                    Kategori <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="category"
                    {...register("category")}
                    placeholder="Masukkan kategori produk"
                    className={cn(
                      "transition-colors",
                      errors.category &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.category && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Image URL Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="imageUrl"
                    className="flex items-center gap-1.5"
                  >
                    <Image className="h-4 w-4 text-muted-foreground" />
                    URL Gambar <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="imageUrl"
                    {...register("imageUrl")}
                    placeholder="Masukkan URL gambar produk"
                    className={cn(
                      "transition-colors",
                      errors.imageUrl &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.imageUrl && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.imageUrl.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 bg-muted/50 border-t mx-6 flex flex-col sm:flex-row gap-2 md:gap-2 sm:gap-0 sm:justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {product ? "Perbarui Produk" : "Tambah Produk"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
