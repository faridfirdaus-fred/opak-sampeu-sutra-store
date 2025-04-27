import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import cloudinary from "cloudinary";

const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "ID banner diperlukan" });
    }

    // Ambil data banner terlebih dahulu untuk mendapatkan URL gambar
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return res.status(404).json({ message: "Banner tidak ditemukan" });
    }

    // Ekstrak public_id dari Cloudinary URL
    // Format URL Cloudinary: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/public_id.jpg
    const urlParts = banner.imageUrl.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split(".")[0];

    // Hapus gambar dari Cloudinary (opsional, bisa dikomentari jika tidak perlu)
    try {
      await cloudinary.v2.uploader.destroy(`banner/${publicId}`, {
        resource_type: "image",
      });
    } catch (cloudinaryError) {
      console.error("Error deleting image from Cloudinary:", cloudinaryError);
      // Lanjutkan meskipun gagal menghapus dari Cloudinary
    }

    // Hapus banner dari database
    await prisma.banner.delete({
      where: { id },
    });

    res.status(200).json({ message: "Banner berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: "Gagal menghapus banner", error });
  } finally {
    await prisma.$disconnect();
  }
}
