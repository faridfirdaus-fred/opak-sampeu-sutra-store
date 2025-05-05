"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { motion } from "framer-motion";


import { Image, Tag, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";

interface BannerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (banner: { title: string; imageUrl: string }) => void;
  initialData?: { title: string; imageUrl: string };
}

export default function BannerForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: BannerFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Check file size
      if (file.size > 10485760) {
        // 10MB limit
        toast.error("File terlalu besar. Maksimal 10MB.");
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "banner");

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
      setImageUrl(data.secure_url);
      setImagePreview(data.secure_url);
      toast.success("Gambar berhasil diunggah!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Gagal mengunggah gambar. Coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      toast.error("Harap isi semua field yang diperlukan.");
      return;
    }
    onSubmit({ title, imageUrl });
    setTitle("");
    setImageUrl("");
    setImagePreview(null);
    onClose();
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
                {initialData ? "Edit Banner" : "Tambah Banner"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {initialData
                  ? "Perbarui informasi banner di bawah ini."
                  : "Isi detail banner baru di bawah ini."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Judul Banner <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masukkan judul banner"
                    className={cn(
                      "transition-colors",
                      !title &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {!title && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Judul banner wajib diisi.
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-1.5">
                    <Image className="h-4 w-4 text-muted-foreground" />
                    Gambar Banner
                  </Label>
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-md p-4 text-center cursor-pointer",
                      isUploading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <input {...getInputProps()} />
                    {isUploading ? (
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
                  {!imageUrl && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Gambar banner wajib diunggah.
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
                {initialData ? "Perbarui Banner" : "Tambah Banner"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
