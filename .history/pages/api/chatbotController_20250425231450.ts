import { PrismaClient } from "@prisma/client";
import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

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
      // Cek apakah pertanyaan terkait produk
      const productMatch = message.match(/harga (.+)/i);
      if (productMatch) {
        const productName = productMatch[1].trim();
        const product = await prisma.product.findFirst({
          where: { name: { contains: productName, mode: "insensitive" } },
        });

        if (product) {
          const reply = `Harga ${
            product.name
          } adalah Rp${product.price.toLocaleString()}.`;
          return res.status(200).json({ reply });
        } else {
          const reply = `Maaf, saya tidak menemukan produk dengan nama "${productName}".`;
          return res.status(200).json({ reply });
        }
      }

      // Jika tidak terkait produk, gunakan OpenAI API
      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      });

      const botReply = response.data.choices[0]?.message?.content || "No reply";

      return res.status(200).json({ reply: botReply });
    } catch (error) {
      console.error("Error handling chatbot request:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
