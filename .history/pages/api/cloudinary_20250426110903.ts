import axios from "axios";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const response = await axios.get(
        `https://api.cloudinary.com/v1_1/ddldmru1u/resources/image`,
        {
          auth: {
            username: process.env.CLOUDINARY_API_KEY || "",
            password: process.env.CLOUDINARY_API_SECRET || "",
          },
        }
      );

      const images = response.data.resources.map((resource) => ({
        url: resource.secure_url,
        title: resource.public_id, // Anda bisa mengganti ini dengan metadata lain
      }));

      res.status(200).json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch images from Cloudinary" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
