"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaInstagram,
  FaHome,
  FaInfoCircle,
  FaShoppingBag,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement subscription logic here
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Opak Sampeu Sutra</h3>
            <p className="text-gray-600">
              Kami adalah perusahaan yang menyediakan produk berkualitas tinggi
              untuk memenuhi kebutuhan pelanggan kami.
            </p>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Sosial Media</h4>
              <div className="flex space-x-4 mt-2">
                <Link
                  href="https://instagram.com/opaksampeu_sutra"
                  target="_blank"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <FaInstagram className="text-2xl" />
                </Link>
              </div>
              <p className="text-sm mt-2">opaksampeu_sutra</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Halaman</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FaHome /> Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FaInfoCircle /> Tentang
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FaShoppingBag /> Belanja
                </Link>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Kontak</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <FaPhone className="mt-1 text-primary" />
                  <p>+6282129091953</p>
                </div>
                <div className="flex items-start gap-2">
                  <FaEnvelope className="mt-1 text-primary" />
                  <p>opaksampeusutra@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription & Location */}
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-3">
                Daftarkan email Anda untuk mendapatkan pembaruan terbaru dari
                kami.
              </p>
              <form onSubmit={handleSubscribe} className="mt-4">
                <div className="flex max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    required
                    className="w-full px-4 py-2 rounded-l border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-r hover:bg-primary-dark"
                  >
                    Kirim
                  </button>
                </div>
              </form>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Lokasi</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 text-primary flex-shrink-0" />
                  <p className="text-sm">
                    Jl. Sukagalih aspol No.1, Cipedes, Kec. Sukajadi, Kota
                    Bandung, Jawa Barat 40162 (Bandung)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 text-primary flex-shrink-0" />
                  <p className="text-sm">
                    M6PH+XR3, Jl. Raya Nusa Indah, Sukamanah, Kec. Cipedes, Kab.
                    Tasikmalaya, Jawa Barat 46131 (Tasikmalaya)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-6 text-center text-sm">
          <p>© 2024 Opak Sampeu Sutra. Semua Hak Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
