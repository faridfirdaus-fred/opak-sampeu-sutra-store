import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  console.log("API Cart - Request received:", method);

  try {
    // Ambil sesi pengguna
    const session = await getServerSession(req, res, authOptions);
    console.log("Session in API:", session);

    if (!session || !session.user?.id) {
      console.log("Unauthorized - No valid session or user ID");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;
    console.log("User ID:", userId);

    switch (method) {
      case "GET":
        try {
          const cartItems = await prisma.cart.findMany({
            where: { userId },
            include: { product: true },
          });
          res.status(200).json(cartItems);
        } catch (error) {
          console.error("GET /api/cart - Error:", error);
          res.status(500).json({ error: "Failed to fetch cart items" });
        }
        break;

      case "POST":
        try {
          const { productId, quantity, container = "TOPLES" } = req.body;
          console.log("POST data:", { productId, quantity, userId, container });

          // Validasi semua field yang dibutuhkan
          if (!productId || !ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid productId" });
          }

          // Import dan gunakan enum Container dari Prisma
          const { Container } = await import("@prisma/client");

          // Validasi container adalah nilai enum yang valid
          if (!Object.values(Container).includes(container)) {
            return res.status(400).json({
              error: "Invalid container value",
              validValues: Object.values(Container),
            });
          }

          // Periksa apakah produk sudah ada di keranjang
          const existingCartItem = await prisma.cart.findFirst({
            where: { userId, productId },
          });

          if (existingCartItem) {
            // Jika sudah ada, tambahkan quantity
            const updatedCartItem = await prisma.cart.update({
              where: { id: existingCartItem.id },
              data: { quantity: existingCartItem.quantity + quantity },
            });
            res.status(200).json(updatedCartItem);
          } else {
            // Jika belum ada, tambahkan sebagai item baru
            const newCartItem = await prisma.cart.create({
              data: {
                userId,
                productId,
                quantity,
                container: container as keyof typeof Container,
              },
            });
            res.status(201).json(newCartItem);
          }
        } catch (error) {
          console.error("POST /api/cart - Error:", error);
          res.status(500).json({ error: "Failed to add item to cart" });
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Cart - Unexpected error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
