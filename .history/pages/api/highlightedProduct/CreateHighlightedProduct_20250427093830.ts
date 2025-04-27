import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      productId,
      priority = 0,
      isActive = true,
      endDate = null,
    } = req.body;

    // Validasi input
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (typeof priority !== "number" || priority < 0) {
      return res
        .status(400)
        .json({ message: "Priority must be a non-negative number" });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be a boolean" });
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return res.status(400).json({ message: "Invalid endDate format" });
    }

    // Periksa apakah produk ada
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Periksa apakah produk sudah di-highlight
    const existingHighlight = await prisma.highlightedProduct.findFirst({
      where: { productId },
    });

    if (existingHighlight) {
      return res.status(400).json({
        message: "Product is already highlighted",
        highlight: existingHighlight,
      });
    }

    // Buat highlighted product
    const highlightedProduct = await prisma.highlightedProduct.create({
      data: {
        productId,
        priority,
        isActive,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return res.status(201).json(highlightedProduct);
  } catch (error) {
    console.error("Error creating highlighted product:", error);
    return res
      .status(500)
      .json({
        message: "Failed to create highlighted product",
        error: error.message,
      });
  } finally {
    // Tutup Prisma Client
    await prisma.$disconnect();
  }
}
