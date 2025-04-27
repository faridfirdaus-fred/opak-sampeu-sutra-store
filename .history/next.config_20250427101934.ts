import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // Tambahkan domain Cloudinary di sini
  },
};
};

export default nextConfig;
