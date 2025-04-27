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
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product is already highlighted
    const existingHighlight = await prisma.highlightedProduct.findFirst({
      where: { productId },
    });

    if (existingHighlight) {
      return res.status(400).json({
        message: "Product is already highlighted",
        highlight: existingHighlight,
      });
    }

    // Create highlighted product
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
      .json({ message: "Failed to create highlighted product" });
  }
}
