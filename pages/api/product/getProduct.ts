import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "GET") {
    try {
      // Test database connection first
      await prisma.$connect();

      const products = await prisma.product.findMany();

      // Always return an array (even if empty)
      res.status(200).json(products || []);
    } catch (error) {
      console.error("Database error:", error);

      // Send a more descriptive error response
      res.status(500).json({
        error: "Database connection error",
        message: "Could not fetch products. Please try again later.",
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
