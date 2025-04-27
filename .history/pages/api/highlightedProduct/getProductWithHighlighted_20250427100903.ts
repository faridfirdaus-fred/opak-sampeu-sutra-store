import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        highlighted: {
          select: {
            id: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products with highlighted status:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch products with highlighted status" });
  } finally {
    await prisma.$disconnect();
  }
}
