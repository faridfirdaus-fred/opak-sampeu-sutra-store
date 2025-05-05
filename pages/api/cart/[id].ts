import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const id = req.query.id as string;

  console.log(`API Cart ${method} - Item ID:`, id);

  try {
    // Ambil sesi pengguna
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;

    // Cari item keranjang
    const cartItem = await prisma.cart.findUnique({
      where: { id },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Verifikasi pemilik item
    if (cartItem.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    switch (method) {
      case "PATCH":
        try {
          const { quantity } = req.body;

          console.log(`Updating cart item ${id} quantity to:`, quantity);

          if (!quantity || quantity < 1) {
            return res.status(400).json({ error: "Invalid quantity" });
          }

          const updatedCartItem = await prisma.cart.update({
            where: { id },
            data: { quantity },
          });

          res.status(200).json(updatedCartItem);
        } catch (error) {
          console.error(`PATCH /api/cart/${id} - Error:`, error);
          res.status(500).json({ error: "Failed to update cart item" });
        }
        break;

      case "DELETE":
        try {
          await prisma.cart.delete({
            where: { id },
          });
          res.status(200).json({ message: "Cart item deleted successfully" });
        } catch (error) {
          console.error(`DELETE /api/cart/${id} - Error:`, error);
          res.status(500).json({ error: "Failed to delete cart item" });
        }
        break;

      default:
        res.setHeader("Allow", ["PATCH", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(`API Cart ${method} - Unexpected error:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
