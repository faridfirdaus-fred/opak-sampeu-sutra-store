import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "DELETE") {
    const { public_id } = req.query;

    if (!public_id) {
      return res.status(400).json({ error: "Public ID is required" });
    }

    try {
      const result = await cloudinary.v2.uploader.destroy(public_id as string, {
        resource_type: "image",
      });

      if (result.result === "ok") {
        res.status(200).json({ message: "Banner deleted successfully" });
      } else {
        res.status(500).json({ error: "Failed to delete banner" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete banner" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
