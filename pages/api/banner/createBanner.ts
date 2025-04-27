import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { title, imageUrl } = req.body;

    // Validasi data
    if (!title || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Judul dan URL gambar diperlukan" });
    }

    // Tambahkan banner ke database
    const banner = await prisma.banner.create({
      data: {
        title,
        imageUrl,
      },
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ message: "Gagal membuat banner", error });
  } finally {
    await prisma.$disconnect();
  }
}
