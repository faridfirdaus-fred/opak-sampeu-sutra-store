"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar({ lng }) {
  const { t } = useTranslation(lng, "navbar");
  const [language, setLanguage] = useState(lng || "id");

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/layanan", label: t("services") },
    { href: "/kontak", label: t("contact") },
  ];

  return (
    <nav className="sticky top-0 z-50 max-w-5xl mx-auto border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          LOGO
        </Link>

        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex items-center justify-center flex-1 px-4">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Language Selector */}
        <Footer lng={lng} path="/" />
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
