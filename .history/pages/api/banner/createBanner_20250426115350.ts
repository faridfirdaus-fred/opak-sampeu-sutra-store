import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";
import formidable from "formidable";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to parse form data" });
      }

      const file = files.file
        ? ((Array.isArray(files.file)
            ? files.file[0]
            : files.file) as formidable.File)
        : null;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      try {
        const uploadResult = await cloudinary.v2.uploader.upload(
          file.filepath,
          {
            folder: "banner", // Unggah ke folder "banner"
          }
        );

        res.status(200).json({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to upload image to Cloudinary" });
      } finally {
        // Hapus file sementara setelah diunggah
        fs.unlinkSync(file.filepath);
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
