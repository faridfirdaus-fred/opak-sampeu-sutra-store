import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { AxiosResponse } from "axios";

interface CloudinaryResource {
  secure_url: string;
  public_id: string;
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
        `https://api.cloudinary.com/v1_1/ddldmru1u/resources/image`,
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

      const responseData: CloudinaryResponse = response.data;

      console.log("Cloudinary Response:", responseData); // Tambahkan log ini

      const images = responseData.resources.map((resource) => ({
        url: resource.secure_url,
        title: resource.public_id,
      }));

      console.log("Mapped Images:", images); // Tambahkan log ini

      res.status(200).json(images);
    } catch (error) {
      console.error("Error fetching images from Cloudinary:", error); // Tambahkan log error
      res.status(500).json({ error: "Failed to fetch images from Cloudinary" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
