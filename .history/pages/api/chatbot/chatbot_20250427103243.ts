import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

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
      // Ambil semua produk dari database
      const products = await prisma.product.findMany();

      // Format daftar produk untuk dikirim ke GPT
      const productList = products
        .map((p) => `${p.name}: Rp${p.price.toLocaleString()}`)
        .join("\n");

      // Kirim pesan ke OpenAI GPT
      const prompt = `
        Berikut adalah daftar produk dan harga:
        ${productList}

        Pertanyaan pengguna: "${message}"

        Jawab dengan informasi yang relevan tentang produk, harga, atau beri tahu jika produk tidak ditemukan.
      `;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 150,
        temperature: 0.7,
      });

      const reply = response.data.choices[0].text?.trim();
      return res.status(200).json({ reply });
    } catch (error) {
      console.error("Error handling chatbot request:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
