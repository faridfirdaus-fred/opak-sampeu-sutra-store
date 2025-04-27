import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { AxiosResponse } from "axios";

interface CloudinaryResource {
  secure_url: string;
}

interface CloudinaryResponse {
  resources: CloudinaryResource[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { method } = req;

  if (method === "GET") {
    try {
      const response: AxiosResponse<CloudinaryResponse> = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/search`,
        {
          expression: "folder:banner", // cari semua asset di folder banner
          max_results: 30, // bisa disesuaikan
        },
        {
          auth: {
            username: process.env.CLOUDINARY_API_KEY || "",
            password: process.env.CLOUDINARY_API_SECRET || "",
          },
        }
      );

      const imageUrls = response.data.resources.map(
        (resource) => resource.secure_url
      );

      res.status(200).json(imageUrls);
    } catch (error) {
      console.error("Error fetching images from Cloudinary:", error);
      res.status(500).json({ error: "Failed to fetch images from Cloudinary" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
