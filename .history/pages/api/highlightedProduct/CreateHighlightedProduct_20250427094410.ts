.ts
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
    // Get product details from request
    const {
      name,
      description,
      price,
      stock,
      category,
      container,
      imageUrl,
      priority = 0,
      isActive = true,
      endDate = null,
    } = req.body;

    // First create or find the product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category,
        container,
        imageUrl,
      },
    });

    // Now create the highlighted product entry using the new product's ID
    const highlightedProduct = await prisma.highlightedProduct.create({
      data: {
        productId: product.id,
        priority,
        isActive,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        product: true, // Include the associated product data in the response
      },
    });

    return res.status(201).json(highlightedProduct);
  } catch (error) {
    console.error("Error creating highlighted product:", error);
    return res.status(500).json({
      message: "Failed to create highlighted product",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}