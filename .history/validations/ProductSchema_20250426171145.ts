import { z } from "zod";

// Enum untuk kategori produk
const categoryEnum = z.enum(["OPAK", "BASTIK", "KACANG"]);

// Enum untuk jenis container
const containerEnum = z.enum(["TOPLES", "BOX"]);

// Schema validasi untuk produk
export const productSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama produk harus diisi" })
    .max(100, { message: "Nama produk tidak boleh lebih dari 100 karakter" }),
  description: z
    .string()
    .optional()
    .max(500, { message: "Deskripsi tidak boleh lebih dari 500 karakter" }),
  price: z
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .positive({ message: "Harga harus lebih dari 0" }),
  stock: z
    .number({ invalid_type_error: "Stok harus berupa angka" })
    .int({ message: "Stok harus berupa bilangan bulat" })
    .min(0, { message: "Stok tidak boleh kurang dari 0" }),
  category: categoryEnum,
  container: containerEnum,
  imageUrl: z.string().url({ message: "URL gambar tidak valid" }).optional(),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
