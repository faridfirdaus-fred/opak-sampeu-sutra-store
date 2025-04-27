import { PrismaClient } from "@prisma/client";
import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Pastikan API key disimpan di .env
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
      // Simpan pesan pengguna ke database
      const userMessage = await prisma.message.create({
        data: {
          content: message,
          role: "user",
        },
      });

      // Kirim pesan ke OpenAI API
      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      });

      const botReply = response.data.choices[0]?.message?.content || "No reply";

      // Simpan respons bot ke database
      await prisma.message.create({
        data: {
          content: botReply,
          role: "bot",
        },
      });

      // Kirim respons ke frontend
      return res.status(200).json({ reply: botReply });
    } catch (error) {
      console.error("Error handling chatbot request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
