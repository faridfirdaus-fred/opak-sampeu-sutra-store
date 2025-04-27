import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ message: "Highlighted product ID is required" });
    }

    const { priority, isActive, endDate } = req.body;

    // Check if highlighted product exists
    const existingHighlight = await prisma.highlightedProduct.findUnique({
      where: { id },
    });

    if (!existingHighlight) {
      return res.status(404).json({ message: "Highlighted product not found" });
    }

    // Update highlighted product
    const updatedHighlight = await prisma.highlightedProduct.update({
      where: { id },
      data: {
        ...(priority !== undefined && { priority }),
        ...(isActive !== undefined && { isActive }),
        ...(endDate !== undefined && {
          endDate: endDate ? new Date(endDate) : null,
        }),
      },
    });

    return res.status(200).json(updatedHighlight);
  } catch (error) {
    console.error("Error updating highlighted product:", error);
    return res
      .status(500)
      .json({ message: "Failed to update highlighted product" });
  }
}
