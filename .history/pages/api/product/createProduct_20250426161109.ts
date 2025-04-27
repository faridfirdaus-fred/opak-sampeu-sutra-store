import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma"; // Ensure the correct relative path to the Prisma client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    const { name, description, price, stock, category, container, imageUrl } =
      req.body;

    if (!name || !price || !stock || !category || !container) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          category,
          container,
          imageUrl,
        },
      });

      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create product" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
