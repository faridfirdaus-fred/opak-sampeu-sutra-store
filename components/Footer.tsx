"use client";

import Link from "next/link";
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
  return (
    <footer className="bg-hytam text-gray-100 rounded-t-4xl">
      <div className="container mx-auto px-6 lg:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Opak Sampeu Sutra</h3>
            <p className="text-gray-200 leading-relaxed">
              Kami adalah perusahaan yang menyediakan produk berkualitas tinggi
              untuk memenuhi kebutuhan pelanggan kami.
            </p>

            <div>
              <h4 className="font-semibold text-lg">Sosial Media</h4>
              <div className="flex items-center space-x-4 mt-4">
                <Link
                  href="https://instagram.com/opaksampeu_sutra"
                  target="_blank"
                  className="group flex items-center gap-2 text-gray-200 hover:text-primer transition-colors"
                >
                  <FaInstagram className="text-xl group-hover:text-primer transition-colors" />
                  <span className="group-hover:text-primer transition-colors">
                    @opaksampeu_sutra
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Halaman</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="group flex items-center gap-3 text-gray-200 hover:text-primer transition-colors"
                >
                  <FaHome className="text-lg group-hover:text-primer transition-colors" />
                  <span className="group-hover:text-primer transition-colors">
                    Beranda
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="group flex items-center gap-3 text-gray-200 hover:text-primer transition-colors"
                >
                  <FaInfoCircle className="text-lg group-hover:text-primer transition-colors" />
                  <span className="group-hover:text-primer transition-colors">
                    Tentang
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="group flex items-center gap-3 text-gray-200 hover:text-primer transition-colors"
                >
                  <FaShoppingBag className="text-lg group-hover:text-primer transition-colors" />
                  <span className="group-hover:text-primer transition-colors">
                    Belanja
                  </span>
                </Link>
              </li>
            </ul>

            <h3 className="text-2xl font-bold">Kontak</h3>
            <div className="space-y-4">
              <div>
                <Link
                  href="https://wa.me/6282129091953"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-gray-200 hover:text-primer transition-colors"
                >
                  <FaPhone className="text-lg group-hover:text-primer transition-colors" />
                  <span className="group-hover:text-primer transition-colors">
                    +6282129091953
                  </span>
                </Link>
              </div>
              <div>
                <Link
                  href="mailto:opaksampeusutra@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-gray-200 hover:text-primer transition-colors"
                >
                  <FaEnvelope className="text-lg group-hover:text-primer transition-colors" />
                  <span className="group-hover:text-primer transition-colors">
                    opaksampeusutra@gmail.com
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Lokasi</h3>
            <div className="space-y-4 mt-4">
              <div>
                <Link
                  href="https://maps.google.com/?q=Jl.+Sukagalih+Aspol+No.1,+Cipedes,+Kec.+Sukajadi,+Kota+Bandung,+Jawa+Barat+40162"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-gray-200 hover:text-primer transition-colors"
                >
                  <FaMapMarkerAlt className="text-lg group-hover:text-primer transition-colors" />
                  <p className="text-sm group-hover:text-primer transition-colors">
                    Jl. Sukagalih Aspol No.1, Cipedes, Kec. Sukajadi, Kota
                    Bandung, Jawa Barat 40162 (Bandung)
                  </p>
                </Link>
              </div>
              <div>
                <Link
                  href="https://maps.google.com/?q=M6PH%2BXR3,+Jl.+Raya+Nusa+Indah,+Sukamanah,+Kec.+Cipedes,+Kab.+Tasikmalaya,+Jawa+Barat+46131"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-gray-200 hover:text-primer transition-colors"
                >
                  <FaMapMarkerAlt className="text-lg group-hover:text-primer transition-colors" />
                  <p className="text-sm group-hover:text-primer transition-colors">
                    M6PH+XR3, Jl. Raya Nusa Indah, Sukamanah, Kec. Cipedes, Kab.
                    Tasikmalaya, Jawa Barat 46131 (Tasikmalaya)
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-200">
        <p>© 2024 Opak Sampeu Sutra. Semua Hak Dilindungi.</p>
      </div>
    </footer>
  );
}
