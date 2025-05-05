import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma"; // Adjust the import path as necessary

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "PUT") {
    const {
      id,
      name,
      description,
      price,
      stock,
      category,
      container,
      imageUrl,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price: price ? parseFloat(price) : undefined,
          stock: stock ? parseInt(stock, 10) : undefined,
          category,
          container,
          imageUrl,
        },
      });

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update product" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
