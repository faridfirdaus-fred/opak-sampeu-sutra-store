import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dsc57r0af/**", // Sesuaikan dengan path Cloudinary Anda
      },
    ],
  },
};

export default nextConfig;
