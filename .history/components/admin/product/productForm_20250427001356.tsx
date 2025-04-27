"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/validations/ProductSchema";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  XCircle,
  Tag,
  DollarSign,
  Layers,
  Box,
  Package,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  product?: {
    name: string;
    description: string;
    price: number | string;
    stock: number | string;
    category: string;
    container: string;
    imageUrl: string;
  };
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
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "OPAK",
      container: "TOPLES",
      imageUrl: "",
    },
  });

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name: product.name || "",
          description: product.description || "",
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price || 0,
          stock:
            typeof product.stock === "string"
              ? parseInt(product.stock)
              : product.stock || 0,
          category: product.category || "OPAK",
          container: product.container || "TOPLES",
          imageUrl: product.imageUrl || "",
        });
        setImagePreview(product.imageUrl || null);
      } else {
        reset({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          category: "OPAK",
          container: "TOPLES",
          imageUrl: "",
        });
        setImagePreview(null);
      }
    }
  }, [isOpen, product, reset]);

const onDrop = async (acceptedFiles: File[]) => {
  const file = acceptedFiles[0];
  if (!file) return;

  setUploading(true);
  try {
    // Check file size
    if (file.size > 10485760) {
      // 10MB limit
      toast.error("File terlalu besar. Maksimal 10MB.");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "product");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dsc57r0af/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary error:", errorData);
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await response.json();
    setValue("imageUrl", data.secure_url, { shouldValidate: true });
    setImagePreview(data.secure_url);
    toast.success("Gambar berhasil diunggah!");
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Gagal mengunggah gambar. Coba lagi.");
  } finally {
    setUploading(false);
  }
};

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

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
                    {...register("price", { valueAsNumber: true })}
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
                    {...register("stock", { valueAsNumber: true })}
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
                  <Select
                    value={watch("category")}
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPAK">OPAK</SelectItem>
                      <SelectItem value="BASTIK">BASTIK</SelectItem>
                      <SelectItem value="KACANG">KACANG</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Container Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="container"
                    className="flex items-center gap-1.5"
                  >
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Container <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watch("container")}
                    onValueChange={(value) => setValue("container", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih container" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TOPLES">TOPLES</SelectItem>
                      <SelectItem value="BOX">BOX</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.container && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.container.message}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-1.5"
                  >
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Deskripsi
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Masukkan deskripsi produk"
                    className={cn(
                      "transition-colors min-h-[100px]",
                      errors.description &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.description && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image" className="flex items-center gap-1.5">
                    <Image className="h-4 w-4 text-muted-foreground" />
                    Gambar Produk
                  </Label>
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-md p-4 text-center cursor-pointer",
                      uploading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <input {...getInputProps()} />
                    {uploading ? (
                      <p>Mengunggah gambar...</p>
                    ) : (
                      <p>
                        Seret dan lepas gambar di sini, atau klik untuk memilih
                      </p>
                    )}
                  </div>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-4 w-full max-h-40 object-contain rounded-md"
                    />
                  )}
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
                type="button"
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
