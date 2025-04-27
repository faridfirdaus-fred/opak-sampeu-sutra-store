import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma?: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
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
      // Cek apakah pertanyaan terkait produk
      const productMatch = message.match(/(harga|stok|deskripsi) (.+)/i);
      if (productMatch) {
        const queryType = productMatch[1].toLowerCase(); // harga, stok, atau deskripsi
        const productQuery = productMatch[2].trim().toLowerCase();

        // Pecah query menjadi kata-kata
        const queryWords = productQuery.split(" ");

        // Ambil semua produk dari database
        const products = await prisma.product.findMany();

        // Cari produk yang cocok berdasarkan kata kunci
        const product = products.find((p) =>
          queryWords.some((word) => p.name.toLowerCase().includes(word))
        );

        if (product) {
          let reply = "";
          if (queryType === "harga") {
            reply = `Harga ${
              product.name
            } adalah Rp${product.price.toLocaleString()}.`;
          } else if (queryType === "stok") {
            reply = `Stok ${product.name} saat ini adalah ${product.stock} unit.`;
          } else if (queryType === "deskripsi") {
            reply = `Deskripsi ${product.name}: ${product.description}.`;
          }
          return res.status(200).json({ reply });
        } else {
          const reply = `Maaf, saya tidak menemukan produk yang cocok dengan kata kunci "${productQuery}".`;
          return res.status(200).json({ reply });
        }
      }

      // Jika tidak terkait produk, berikan respons default
      const reply =
        "Maaf, saya hanya dapat menjawab pertanyaan tentang harga, stok, atau deskripsi produk.";
      return res.status(200).json({ reply });
    } catch (error) {
      console.error("Error handling chatbot request:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
