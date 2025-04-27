"use client";

import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  return ( <SessionProvider>
    <html lang="en">
      <body>
        {!isAdminRoute && <Navbar />}
        {children}
        {!isAdminRoute && <Footer />}
        <Chat
      </body>
    </html></SessionProvider>
  );
}
