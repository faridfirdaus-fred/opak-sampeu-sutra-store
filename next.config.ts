/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dsc57r0af/**",
      },
    ],
  },
  eslint: {
    // Don't block builds because of ESLint errors in Prisma files
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
