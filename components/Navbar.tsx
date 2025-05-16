"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiMenu, FiX } from "react-icons/fi"; // Added icons for menu toggle
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion"; // For animations

export default function Navbar() {
  const { data: session } = useSession();
  const [showLogoutCard, setShowLogoutCard] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  // Close logout card when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowLogoutCard(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/shop", label: "Produk" },
    { href: "/about", label: "Tentang Kami" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Match width with other components */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 mx-auto py-2">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo - smaller on mobile */}
          <Link href="/" className="flex items-center gap-1 sm:gap-2 z-10">
            <Image
              src="/icon.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <ul className="flex space-x-4 lg:space-x-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm lg:text-md font-medium transition-colors duration-200 ${
                      pathname === link.href
                        ? "text-primer"
                        : "text-gray-600 hover:text-primer"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cart and Login/Avatar */}
          <div className="relative flex items-center gap-2 sm:gap-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <AiOutlineShoppingCart
                className={`text-xl sm:text-2xl transition-colors duration-200 cursor-pointer ${
                  pathname === "/cart"
                    ? "text-primer"
                    : "text-gray-600 hover:text-primer"
                }`}
              />
            </Link>

            {/* Login/Avatar */}
            {session ? (
              <div className="relative">
                <Avatar
                  className="cursor-pointer h-8 w-8 sm:h-9 sm:w-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLogoutCard(!showLogoutCard);
                  }}
                >
                  <AvatarImage
                    src={session.user?.image || ""}
                    alt={session.user?.name || "User Avatar"}
                  />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {showLogoutCard && (
                  <Card className="absolute right-0 mt-2 w-48 z-50">
                    <CardContent className="p-2">
                      <p className="text-sm font-medium truncate">
                        {session.user?.name}
                      </p>
                      <Button
                        onClick={() => signOut()}
                        className="mt-2 w-full h-8 px-4 text-xs sm:text-sm font-medium text-white"
                        variant="destructive"
                      >
                        Logout
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primer hover:bg-darken-primer rounded-xl sm:rounded-2xl"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="md:hidden p-1 ml-1 text-gray-600 hover:text-primer focus:outline-none"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <FiMenu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden px-4 sm:px-8 bg-background border-t"
          >
            <ul className="py-3">
              {navLinks.map((link) => (
                <li key={link.href} className="mb-2">
                  <Link
                    href={link.href}
                    className={`block py-2 text-sm font-medium transition-colors duration-200 ${
                      pathname === link.href
                        ? "text-primer"
                        : "text-gray-600 hover:text-primer"
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
