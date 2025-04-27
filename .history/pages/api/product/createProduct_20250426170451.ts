import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Zod schema untuk validasi input produk
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk harus diisi")
    .max(100, "Nama produk tidak boleh lebih dari 100 karakter"),
  description: z
    .string()
    .optional()
    .max(500, "Deskripsi tidak boleh lebih dari 500 karakter"),
  price: z
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .positive("Harga harus lebih dari 0"),
  stock: z
    .number({ invalid_type_error: "Stok harus berupa angka" })
    .int("Stok harus berupa bilangan bulat")
    .min(0, "Stok tidak boleh kurang dari 0"),
  category: z.enum(["OPAK", "BASTIK", "KACANG"], {
    errorMap: () => ({ message: "Kategori tidak valid" }),
  }),
  container: z.enum(["TOPLES", "BOX"], {
    errorMap: () => ({ message: "Jenis container tidak valid" }),
  }),
  imageUrl: z.string().url("URL gambar tidak valid").optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Validasi input menggunakan Zod
    const body = req.body as unknown;
    const data = productSchema.parse(body);

    // Buat produk baru di database
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category: data.category,
        container: data.container,
        imageUrl: data.imageUrl,
      },
    });

    // Respons sukses
    return res.status(201).json({
      message: "Produk berhasil dibuat",
      product,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Tangani error validasi Zod
      console.error("Validation Error:", err.errors);
      return res.status(400).json({
        errors: err.errors.map((e) => e.message),
      });
    }

    console.error("[ERROR CREATING PRODUCT]", err);

    // Tangani error Prisma
    if (err.code === "P2002") {
      return res.status(400).json({
        error: "Produk dengan nama yang sama sudah ada.",
      });
    }

    // Tangani error lainnya
    return res.status(500).json({
      error: "Terjadi kesalahan pada server",
    });
  }
}
