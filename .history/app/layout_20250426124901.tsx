"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import Navbar from "../components/Navbar"; // Import Navbar
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Bungkus aplikasi dengan SessionProvider */}
        <SessionProvider>
          {/* Tambahkan Navbar */}
          <Navbar />
          {/* Konten halaman */}
          {children}
          
        </SessionProvider>
      </body>
    </html>
  );
}
