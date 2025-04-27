import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default async function chatbotHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      // Handle generic product price query
      if (
        message.toLowerCase() === "cek harga produk" ||
        message.toLowerCase().includes("harga produk")
      ) {
        // Get top products (limit to 5)
        const products = await prisma.product.findMany({
          take: 5,
          orderBy: { name: "asc" },
        });

        if (products.length > 0) {
          const productList = products
            .map((p) => `- ${p.name}: Rp${p.price.toLocaleString()}`)
            .join("\n");

          const reply = `Berikut daftar harga produk kami:\n\n${productList}\n\nUntuk info lebih detail, silakan tanya "harga [nama produk]".`;
          return res.status(200).json({ reply });
        }
      }

      // Handle info pengiriman
      if (message.toLowerCase() === "info pengiriman") {
        const reply =
          "Informasi Pengiriman Opak Sampeu Sutra:\n\n" +
          "- Pengiriman via JNE, J&T, dan SiCepat\n" +
          "- Biaya pengiriman tergantung berat dan tujuan\n" +
          "- Estimasi pengiriman 2-5 hari kerja\n" +
          "- Pengiriman dilakukan setiap hari Senin-Sabtu\n\n" +
          "Untuk info lebih lanjut, silakan hubungi CS kami di +6282129091953";
        return res.status(200).json({ reply });
      }

      // Handle status pesanan
      if (message.toLowerCase() === "status pesanan") {
        const reply =
          "Untuk mengecek status pesanan, silakan berikan nomor pesanan Anda dengan format:\n\n" +
          '"Cek pesanan [nomor pesanan]"\n\n' +
          "Contoh: Cek pesanan OSS12345";
        return res.status(200).json({ reply });
      }

      // Handle cara pemesanan
      if (message.toLowerCase() === "cara pemesanan") {
        const reply =
          "Cara Pemesanan Produk Opak Sampeu Sutra:\n\n" +
          "1. Pilih produk yang diinginkan\n" +
          "2. Tentukan jumlah dan varian\n" +
          "3. Hubungi kami via WhatsApp: +6282129091953\n" +
          "4. Konfirmasi alamat pengiriman\n" +
          "5. Lakukan pembayaran\n" +
          "6. Pesanan akan segera diproses\n\n" +
          "Pembayaran dapat dilakukan melalui transfer bank atau e-wallet.";
        return res.status(200).json({ reply });
      }

      // Cek apakah pertanyaan terkait produk
      const productMatch = message.match(/(harga|stok|deskripsi) (.+)/i);
      if (productMatch) {
        const queryType = productMatch[1].toLowerCase(); // harga, stok, atau deskripsi
        const productQuery = productMatch[2].trim().toLowerCase();

        // Pecah query menjadi kata-kata
        const queryWords = productQuery.split(" ");

        // Ambil semua produk dari database
        const products = await prisma.product.findMany();

        // Cari produk yang cocok berdasarkan kata kunci
        const product = products.find((p) =>
          queryWords.some((word) => p.name.toLowerCase().includes(word))
        );

        if (product) {
          let reply = "";
          if (queryType === "harga") {
            reply = `Harga ${
              product.name
            } adalah Rp${product.price.toLocaleString()}.`;
          } else if (queryType === "stok") {
            reply = `Stok ${product.name} saat ini adalah ${product.stock} unit.`;
          } else if (queryType === "deskripsi") {
            reply = `Deskripsi ${product.name}: ${product.description}.`;
          }
          return res.status(200).json({ reply });
        } else {
          const reply = `Maaf, saya tidak menemukan produk yang cocok dengan kata kunci "${productQuery}".`;
          return res.status(200).json({ reply });
        }
      }

      // Jika tidak terkait produk, berikan respons default
      const reply =
        'Saya dapat membantu Anda dengan informasi produk Opak Sampeu Sutra. Silakan tanya tentang harga, stok, atau deskripsi produk.\n\nContoh:\n- "Harga opak sampeu pedas"\n- "Stok opak sampeu original"\n- "Deskripsi opak sampeu sutra"';
      return res.status(200).json({ reply });
    } catch (error) {
      console.error("Error handling chatbot request:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
