import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import Together from "together-ai";
import { Configuration, OpenAIApi } from "openai"; // Import OpenAI SDK

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Validate environment variables
if (!process.env.TOGETHER_API_KEY) {
  throw new Error(
    "TOGETHER_API_KEY is not defined in the environment variables."
  );
}
if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY is not defined in the environment variables."
  );
}

// Initialize Together and OpenAI clients
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

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
      // Fetch all products from the database
      const products = await prisma.product.findMany();

      // Format the product list for GPT
      const productList = products
        .map((p) => `${p.name}: Rp${p.price.toLocaleString()}`)
        .join("\n");

      // Create the prompt for GPT
      const prompt = `
        Berikut adalah daftar produk dan harga:
        ${productList}

        Pertanyaan pengguna: "${message}"

        Jawab dengan informasi yang relevan tentang produk, harga, atau beri tahu jika produk tidak ditemukan.
      `;

      // Send the prompt to OpenAI GPT
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo", // Replace with "gpt-4" if needed
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

      const reply = response.data.choices[0]?.message?.content?.trim() || null;
      return res.status(200).json({ reply });
    } catch (error: any) {
      console.error("Error handling chatbot request:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
