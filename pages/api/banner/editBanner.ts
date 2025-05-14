import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { id, title, imageUrl } = req.body;

    // Validasi input
    if (!id || !title || !imageUrl) {
      return res
        .status(400)
        .json({ message: "ID, judul, dan URL gambar diperlukan" });
    }

    // Perbarui banner di database
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: {
        title,
        imageUrl,
      },
    });

    return res.status(200).json(updatedBanner);
  } catch (error: any) {
    console.error("Error updating banner:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Banner tidak ditemukan",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui banner",
      error: error.message || "Unknown error",
    });
  } finally {
    await prisma.$disconnect();
  }
}
