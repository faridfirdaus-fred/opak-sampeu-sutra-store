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
      if (message.toLowerCase() === "cek harga produk" || message.toLowerCase().includes("harga produk")) {
        // Get top products (limit to 5)
        const products = await prisma.product.findMany({
          take: 5,
          orderBy: { name: 'asc' }
        });
        
        if (products.length > 0) {
          const productList = products.map(p => 
            `- ${p.name}: Rp${p.price.toLocaleString()}`
          ).join('\n');
          
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
          "\"Cek pesanan [nomor pesanan]\"\n\n" +
          "Contoh: Cek pesanan OSS12345";
        return res.status(200).json({ reply });
      }
      
      // Handle cara pemesanan
      if (message.toLowerCase() === "cara pemesanan") {
        const reply = 
          "Cara Pemesanan Produk Opak Sampeu Sutra:\n\n"