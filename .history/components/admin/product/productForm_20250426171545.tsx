"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/validations/ProductSchema";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "sonner"; // Tambahkan impor toast
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
import { XCircle, Tag,  Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: {
    name: string;
    price: string;
    stock: string;
    category: string;
    container: string;
    imageUrl: string;
  }) => void;
  product?: {
    name?: string;
    price?: string;
    stock?: number;
    category?: string;
    container?: string;
    imageUrl?: string;
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      stock: 0,
      category: "",
      container: "",
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
          price: product.price || "",
          stock: product.stock || "",
          category: product.category || "",
          container: product.container || "",
          imageUrl: product.imageUrl || "",
        });
        setImagePreview(product.imageUrl || null);
      } else {
        reset();
        setImagePreview(null);
      }
    }
  }, [isOpen, product, reset]);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
      ); // Cloudinary preset
      formData.append("folder", "products"); // Folder di Cloudinary

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      const imageUrl = response.data.secure_url;
      setValue("imageUrl", imageUrl, { shouldValidate: true });
      setImagePreview(imageUrl);
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
    accept: "image/*",
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

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-1.5">
                    <Image className="h-4 w-4 text-muted-foreground" />
                    Gambar Produk <span className="text-destructive">*</span>
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
                      className="mt-4 w-full h-40 object-cover rounded-md"
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
