"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import Notification from "@/components/Notification";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
  price: number;
  onAddToCart?: () => void; // Make it optional
  onCheckout?: () => void; // Make it optional
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

  const handleImageClick = () => {
    router.push(`/shop/${id}`);
  };

  const handleAddToCart = async () => {
    // If an external onAddToCart function is provided, use it
    if (onAddToCart) {
      onAddToCart();
      return;
    }

    // Otherwise use the internal implementation
    try {
      // Tambahkan ke local cart
      addToCart({
        id,
        productId: id,
        name,
        price,
        quantity: 1,
        imageUrl,
      });

      // Kirim ke server dengan container yang valid
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
          container: "TOPLES", // Gunakan nilai enum yang valid
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
  };

  const handleBuyNow = () => {
    // If an external onCheckout function is provided, use it
    if (onCheckout) {
      onCheckout();
      return;
    }

    // Otherwise navigate to the product page
    router.push(`/shop/${id}`);
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
        <Card className="overflow-hidden h-full flex flex-col shadow-md transition-transform transform hover:shadow-2xl bg-slate-100">
          <div
            className="relative cursor-pointer overflow-hidden group"
            onClick={handleImageClick}
          >
            <div className="px-6">
              <div className="relative h-48 w-full overflow-hidden rounded-md border-1">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>

            <div className="absolute top-2 right-2">
              <Badge
                variant={stock > 0 ? "secondary" : "destructive"}
                className="backdrop-blur-sm bg-slate-100 text-black text-sm px-3 py-1 rounded-full"
              >
                {stock > 0 ? `Stok: ${stock}` : "Habis"}
              </Badge>
            </div>
          </div>

          <CardTitle className="px-6 py-0">
            <h3 className="text-xl font-semibold line-clamp-2 text-gray-800">
              {name}
            </h3>
          </CardTitle>

          <CardContent className="px-6 flex-grow">
            <p className="text-md text-gray-">
              Rp{new Intl.NumberFormat("id-ID").format(price)}
            </p>
          </CardContent>
          <CardFooter className="px-6 pt-0 flex gap-2">
            <Button
              onClick={handleBuyNow}
              disabled={stock <= 0}
              className="flex-1 bg-primer hover:bg-white hover:text-primer text-white rounded-lg shadow-sm transition-all duration-200"
            >
              Beli Sekarang
            </Button>

            <Button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              variant="outline"
              size="icon"
              className="hover:bg-primer transition-all duration-200 hover:text-white text-primer rounded-lg shadow-sm"
            >
              <FaShoppingCart />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
};

export default ProductCard;
