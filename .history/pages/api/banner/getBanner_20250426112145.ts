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
      const response: AxiosResponse<CloudinaryResponse> = await axios.get(
        `https://api.cloudinary.com/v1_1/ddldmru1u/resources/image/upload`,
        {
          params: {
            prefix: "banner/", // Hanya mengambil gambar dari folder "banner"
          },
          auth: {
            username: process.env.CLOUDINARY_API_KEY || "",
            password: process.env.CLOUDINARY_API_SECRET || "",
          },
        }
      );

      // Ambil hanya URL gambar
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
