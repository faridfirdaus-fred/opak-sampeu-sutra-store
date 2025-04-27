import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default async function chatbotHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      // Cek apakah pertanyaan terkait harga satu produk
      const productMatch = message.match(/harga (.+)/i);
      if (productMatch) {
        const productQuery = productMatch[1].trim().toLowerCase();

        // Ambil semua produk dari database
        const products = await prisma.product.findMany();

        // Cari produk yang cocok berdasarkan kata kunci
        const product = products.find((p) =>
          p.name.toLowerCase().includes(productQuery)
        );

        if (product) {
          const reply = `Harga ${
            product.name
          } adalah Rp${product.price.toLocaleString()}.`;
          return res.status(200).json({ reply });
        } else {
          const reply = `Maaf, saya tidak menemukan produk dengan nama "${productQuery}".`;
          return res.status(200).json({ reply });
        }
      }

      // Handle permintaan daftar harga semua produk
      if (
        message.toLowerCase() === "cek harga produk" ||
        message.toLowerCase().includes("harga produk")
      ) {
        // Ambil daftar produk (maksimal 5)
        const products = await prisma.product.findMany({
          take: 5,
          orderBy: { name: "asc" },
        });

        if (products.length > 0) {
          const productList = products
            .map((p) => `- ${p.name}: Rp${p.price.toLocaleString()}`)
            .join("\n");

          const reply = `Berikut daftar harga produk kami:\n\n${productList}\n\nUntuk info lebih detail, silakan tanya "harga [nama produk]".`;
          return res.status(200).json({ reply });
        } else {
          const reply = "Maaf, saat ini tidak ada produk yang tersedia.";
          return res.status(200).json({ reply });
        }
      }
const productMatch = message.match(/harga (.+)/i);
if (productMatch) {
  const productQuery = productMatch[1].trim().toLowerCase();

  // Ambil semua produk dari database
  const products = await prisma.product.findMany();

  // Cari produk yang cocok berdasarkan kata kunci menggunakan regex
  const product = products.find((p) => {
    const regex = new RegExp(productQuery, "i"); // Case-insensitive regex
    return regex.test(p.name);
  });

  if (product) {
    const reply = `Harga ${
      product.name
    } adalah Rp${product.price.toLocaleString()}.`;
    return res.status(200).json({ reply });
  } else {
    const reply = `Maaf, saya tidak menemukan produk dengan nama "${productQuery}".`;
    return res.status(200).json({ reply });
  }
}
      // Jika tidak terkait produk, berikan respons default
      const reply =
        'Saya dapat membantu Anda dengan informasi produk Opak Sampeu Sutra. Silakan tanya tentang harga, stok, atau deskripsi produk.\n\nContoh:\n- "Harga opak sampeu pedas"\n- "Stok opak sampeu original"\n- "Deskripsi opak sampeu sutra"';
      return res.status(200).json({ reply });
    } catch (error) {
      console.error("Error handling chatbot request:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
