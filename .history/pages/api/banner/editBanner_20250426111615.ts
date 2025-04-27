import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";
import formidable from "formidable";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const config = {
  api: {
    bodyParser: false, // Nonaktifkan bodyParser untuk menangani file upload
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "PUT") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to parse form data" });
      }

      const publicId = Array.isArray(fields.public_id) ? fields.public_id[0] : fields.public_id || ""; // ID gambar yang akan diedit
      const file = files.file as formidable.File | undefined; // File baru (opsional)

      try {
        let result;

        if (file) {
          // Jika ada file baru, ganti gambar
          result = await cloudinary.v2.uploader.upload(file.filepath, {
            public_id: publicId, // Ganti gambar dengan ID yang sama
            overwrite: true,
          });
        } else {
          // Jika tidak ada file baru, hanya edit metadata
          result = await cloudinary.v2.uploader.explicit(publicId, {
            type: "upload",
            context: {
              alt: fields.alt || "", // Tambahkan atau ubah metadata
            },
          });
        }

        res.status(200).json({
          url: result.secure_url,
          public_id: result.public_id,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to edit banner" });
      } finally {
        if (file) {
          // Hapus file sementara setelah diunggah
          fs.unlinkSync(file.filepath);
        }
      }
    });
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
