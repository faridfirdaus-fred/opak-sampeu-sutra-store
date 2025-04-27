"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { Button } from "@/components/ui/button";

interface BannerFormProps {
  onSubmit: (banner: { title: string; imageUrl: string }) => void;
}

export default function BannerForm({ onSubmit }: BannerFormProps) {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      toast.error("File yang diunggah harus berupa gambar.");
      return;
    }

    setIsUploading(true);

    try {
      const uploadedUrl = await uploadToCloudinary(file, "banner");
      setImageUrl(uploadedUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Gagal mengunggah gambar. Silakan coba lagi.");
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
    if (!title || !imageUrl)
      return alert("Please provide all required fields.");
    onSubmit({ title, imageUrl });
    setTitle("");
    setImageUrl("");
  return (
    <>

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Judul Banner
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Masukkan judul banner"
        />
      </div>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500"
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p className="text-indigo-500">Mengunggah gambar...</p>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="mx-auto h-32 object-cover"
          />
        ) : (
          <p className="text-gray-500">
            Seret dan lepaskan gambar di sini, atau klik untuk memilih
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        Simpan Banner
      </Button>
    </form>
  );

