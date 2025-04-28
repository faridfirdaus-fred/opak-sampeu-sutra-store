"use client";

import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion"; // Import Framer Motion

const ProductFeature = () => {
  const features = [
    {
      title: "Rasa Autentik dari Tradisi Lokal",
      description:
        "Opak Sampeu dibuat dengan resep warisan turun-temurun, menghadirkan cita rasa khas yang tak tergantikan. Setiap gigitan membawa Anda menikmati kekayaan budaya Indonesia.",
    },
    {
      title: "Bahan Alami dan Berkualitas Tinggi",
      description:
        "Kami hanya menggunakan singkong pilihan dan tanpa bahan pengawet, sehingga aman dan sehat untuk dikonsumsi. Kualitas bahan baku adalah prioritas utama kami!",
    },
    {
      title: "Tekstur Renyah dan Lezat",
      description:
        "Diproses dengan teknik tradisional namun higienis, Opak Sampeu menawarkan tekstur renyah yang sempurna dan rasa gurih yang bikin ketagihan.",
    },
    {
      title: "Cocok untuk Segala Kesempatan",
      description:
        "Baik untuk camilan santai, teman minum teh, atau sajian di acara spesial, Opak Sampeu selalu menjadi pilihan yang tepat.",
    },
  ];

  return (
    <motion.section
      className="py-16 mb-20 px-6 md:px-20"
      initial={{ opacity: 0, y: 50 }} // Awal animasi
      animate={{ opacity: 1, y: 0 }} // Animasi saat muncul
      transition={{ duration: 0.8, ease: "easeOut" }} // Durasi dan easing
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }} // Awal animasi untuk teks
          animate={{ opacity: 1, x: 0 }} // Animasi saat muncul
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} // Delay untuk teks
        >
          <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
            CASSAVA CHIPS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Kenapa <span className="text-yellow-600">Opak Sampeu Sutra</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 20 }} // Awal animasi untuk setiap fitur
                animate={{ opacity: 1, y: 0 }} // Animasi saat muncul
                transition={{ duration: 0.5, delay: index * 0.2 }} // Delay untuk setiap fitur
              >
                <FaCheckCircle className="text-yellow-600 mt-1" size={20} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Link
            href="/about"
            className="inline-block mt-6 text-yellow-600 font-medium hover:underline"
          >
            Tentang Kami →
          </Link>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="relative w-full h-[400px] lg:h-[500px]"
          initial={{ opacity: 0, x: 50 }} // Awal animasi untuk gambar
          animate={{ opacity: 1, x: 0 }} // Animasi saat muncul
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }} // Delay untuk gambar
        >
          <Image
            src="/feature.webp"
            alt="Feature Image"
            layout="fill"
            className="object-cover rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductFeature;
