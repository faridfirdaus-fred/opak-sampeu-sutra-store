"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Notification from "./Notification";
import { Card, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
  price: number;
  onAddToCart?: () => void;
  onCheckout?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  imageUrl,
  stock,
  price,
  onAddToCart,
  onCheckout,
}) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [notification, setNotification] = useState<string | null>(null);
  const { status } = useSession();

  const handleImageClick = () => {
    router.push(`/shop/${id}`);
  };

  // Format price nicely with Indonesian currency format
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  // Memoize handleAddToCart with useCallback
  const handleAddToCart = useCallback(async () => {
    // If an external onAddToCart function is provided, use it
    if (onAddToCart) {
      onAddToCart();
      return;
    }

    // Check if user is authenticated
    if (status !== "authenticated") {
      localStorage.setItem(
        "pendingCartAction",
        JSON.stringify({
          action: "add",
          productId: id,
          quantity: 1,
        })
      );

      signIn("google", { callbackUrl: window.location.href });
      return;
    }

    try {
      addToCart({
        id,
        productId: id,
        name,
        price,
        quantity: 1,
        imageUrl,
      });

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: id,
          quantity: 1,
          container: "TOPLES",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add item to cart:", errorData);
        throw new Error("Gagal tambah ke keranjang server");
      }

      setNotification("Produk berhasil ditambahkan ke keranjang!");
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error(error);
      setNotification("Gagal menambahkan produk ke keranjang!");
      setTimeout(() => setNotification(null), 3000);
    }
  }, [id, name, price, imageUrl, status, addToCart, onAddToCart]);

  // Now include handleAddToCart in the dependency array
  useEffect(() => {
    if (status === "authenticated") {
      const pendingAction = localStorage.getItem("pendingCartAction");

      if (pendingAction) {
        try {
          const actionData = JSON.parse(pendingAction);
          if (actionData.action === "add" && actionData.productId === id) {
            handleAddToCart();
          }
          localStorage.removeItem("pendingCartAction");
        } catch (error) {
          console.error("Error processing pending cart action:", error);
        }
      }
    }
  }, [status, id, handleAddToCart]);

  const handleBuyNow = () => {
    // If an external onCheckout function is provided, use it
    if (onCheckout) {
      onCheckout();
      return;
    }

    // Create checkout item
    const checkoutItem = [
      {
        id: id,
        productId: id,
        name: name,
        price: price,
        quantity: 1,
        imageUrl: imageUrl,
      },
    ];

    // Store in localStorage for checkout page
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItem));

    // Redirect to checkout page
    router.push("/checkout");
  };

  return (
    <>
      {notification && <Notification message={notification} type="success" />}
      <motion.div
        className="h-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-300 bg-slate-50">
          <div
            className="relative cursor-pointer overflow-hidden group"
            onClick={handleImageClick}
          >
            {/* Square image container for all screen sizes */}
            <div className="aspect-square w-full relative">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>

            <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
              <Badge
                variant={stock > 0 ? "secondary" : "destructive"}
                className="backdrop-blur-sm bg-white/80 text-gray-700 text-xs px-2 py-0.5 rounded-full"
              >
                {stock > 0 ? `Stok: ${stock}` : "Habis"}
              </Badge>
            </div>
          </div>

          <div className="px-2 sm:px-3 py-1 sm:py-2">
            {/* Reduce title size and font-weight */}
            <h3 className="text-sm sm:text-base font-medium text-gray-700 line-clamp-2 mb-1">
              {name}
            </h3>

            {/* Clean price format */}
            <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">
              {formattedPrice}
            </p>
          </div>

          <CardFooter className="px-2 sm:px-3 pt-0 pb-2 sm:pb-3 flex gap-1 sm:gap-2 mt-auto">
            <Button
              onClick={handleBuyNow}
              disabled={stock <= 0}
              className="flex-1 bg-primer hover:bg-white hover:text-primer text-white text-xs sm:text-sm rounded-lg shadow-sm h-8 sm:h-9 transition-all duration-200"
            >
              Beli Sekarang
            </Button>

            <Button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primer transition-all duration-200 hover:text-white text-primer rounded-lg shadow-sm"
            >
              <FaShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
};

export default ProductCard;
