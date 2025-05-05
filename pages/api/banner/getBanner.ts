import {  PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Remove explicit connect - the singleton handles this

    // Fetch banners using an instance of Prisma Client
    const prisma = new PrismaClient();
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);

    // Return empty array instead of mock data
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Database error in development - returning empty banner list"
      );
      return res.status(200).json([]);
    }

    res.status(500).json({
      message: "Failed to fetch banners",
      error: error instanceof Error ? error.message : String(error),
    });
  }
  // Remove the finally block with disconnect - singleton handles this
}
