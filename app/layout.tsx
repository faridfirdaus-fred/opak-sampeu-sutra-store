"use client";

import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Chatbot from "@/components/Chatbot";
import { Roboto } from "next/font/google";
import { CartProvider } from "@/context/CartContext";

// Import Roboto font
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Tambahkan berat font yang diperlukan
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  return (
    <SessionProvider>
      <html lang="en" className={roboto.className}>
        <body>
          {!isAdminRoute && <Navbar />}
           <CartProvider>{children}</CartProvider>
          {!isAdminRoute && <Chatbot />}
          {!isAdminRoute && <Footer />}
        </body>
      </html>
    </SessionProvider>
  );
}
