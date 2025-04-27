import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // Tambahkan domain Cloudinary di sini
  },
};

export default nextConfig;
