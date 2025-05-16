"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center gap-12 mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/about1.webp"
                alt="About Us"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tentang Kami
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Kami adalah sebuah usaha lokal yang berdedikasi untuk menghadirkan
              opak, makanan ringan khas Indonesia yang terbuat dari singkong,
              dengan kualitas terbaik. Berdiri sejak tahun 2022, Opak Sampeu
              Sutra lahir dari semangat Alief Falatehan dan keluarganya.
            </p>
            <p className="text-lg text-gray-600">
              Nama Opak Sampeu Sutra terinspirasi dari tekstur lembut dan renyah
              opak kami, yang dibuat dengan bahan-bahan alami berkualitas
              tinggi, termasuk singkong segar dari kebun lokal.
            </p>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row-reverse items-center gap-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/feature.webp"
                alt="Our Features"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Misi Kami</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Tradisi dan Kreativitas",
                  description:
                    "Melestarikan cita rasa tradisional dengan menjaga proses pembuatan yang autentik dan higienis.",
                  icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  title: "Inovasi dan Kreativitas",
                  description:
                    "Berinovasi dalam menciptakan varian baru yang sesuai dengan kebutuhan konsumen modern",
                  icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
                },
                {
                  title: "Berkontribusi Kepada Masyarakat",
                  description:
                    "Memberdayakan masyarakat lokal dengan menciptakan lapangan kerja yang stabil.",
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primer flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-slate-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={feature.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
