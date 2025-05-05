import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Together from "together-ai";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Validate Together API Key
if (!process.env.TOGETHER_API_KEY) {
  throw new Error(
    "TOGETHER_API_KEY is not defined in the environment variables."
  );
}

// Initialize Together client
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export default async function chatbotHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Fetch products from database
    const products = await prisma.product.findMany();

    const productList = products
      .map((p) => `${p.name}: Rp${p.price.toLocaleString()}`)
      .join("\n");

    // Create prompt for Together AI
    const prompt = `
      Berikut adalah daftar produk dan harga:
      ${productList}

      Pertanyaan pengguna: "${message}"

      Jawab dengan informasi yang relevan tentang produk, harga, atau beri tahu jika produk tidak ditemukan.
    `;

    const response = await together.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2", // Model Together yang bagus untuk chat
      messages: [
        {
          role: "system",
          content: "Kamu adalah asisten AI untuk toko Opak Sampeu.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content?.trim() || null;

    return res.status(200).json({ reply });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error handling chatbot request:", error.message);
    } else {
      console.error("Error handling chatbot request:", error);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
