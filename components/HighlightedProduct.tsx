"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaInfoCircle } from "react-icons/fa";
import Notification from "./Notification";
import { Button } from "./ui/button";
import ProductCard from "./ProductCard";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { useCart } from "../context/CartContext";
import { useSession, signIn } from "next-auth/react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const HighlightedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const { addToCart } = useCart();
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    async function fetchHighlightedProducts() {
      try {
        const response = await fetch(
          "/api/highlightedProduct/getHighlightedProduct"
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Highlighted Products:", data);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch highlighted products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHighlightedProducts();
  }, []);

  // Handle adding product to cart
  const handleAddToCart = React.useCallback(
    async (product: Product) => {
      // Check if user is authenticated
      if (status !== "authenticated") {
        // Store intended action in localStorage to resume after login
        localStorage.setItem(
          "pendingHighlightAction",
          JSON.stringify({
            action: "add",
            productId: product.id,
          })
        );

        // Redirect to Google OAuth login
        signIn("google", { callbackUrl: window.location.href });
        return;
      }

      try {
        // Add to local cart
        addToCart({
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.image,
        });

        // Send to server with credentials
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Include auth cookies
          body: JSON.stringify({
            productId: product.id,
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
    },
    [status, addToCart]
  );

  // Check for pending actions after login
  useEffect(() => {
    if (status === "authenticated") {
      const pendingAction = localStorage.getItem("pendingHighlightAction");

      if (pendingAction) {
        try {
          const actionData = JSON.parse(pendingAction);
          if (actionData.action === "add" && actionData.productId) {
            // Find the product and complete the pending add to cart action
            const product = products.find((p) => p.id === actionData.productId);
            if (product) {
              handleAddToCart(product);
            }
          }
          localStorage.removeItem("pendingHighlightAction");
        } catch (error) {
          console.error("Error processing pending highlight action:", error);
        }
      }
    }
  }, [status, products, handleAddToCart]);

  // Handle direct checkout (no authentication required)
  const handleCheckout = (product: Product) => {
    // Create checkout item
    const checkoutItem = [
      {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.image,
      },
    ];

    // Store in localStorage
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItem));

    // Redirect to checkout page
    router.push("/checkout");
  };

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 md:px-10 lg:px-20">
      {notification && <Notification message={notification} type="success" />}

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-6">
          <motion.h2
            className="text-lg md:text-xl lg:text-2xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Produk Unggulan
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button variant="link" asChild>
              <Link
                href="/shop"
                className="flex items-center gap-1 text-xs sm:text-sm"
              >
                Lihat Semua <FaInfoCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {loading ? (
          // Loading state with skeletons - 2 columns on mobile with square images
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          // Products found - 2 columns on mobile with square images
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                imageUrl={product.image}
                stock={product.stock}
                price={product.price}
                onCheckout={() => handleCheckout(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </motion.div>
        ) : (
          // No products found
          <div className="text-center py-6">
            <p className="text-gray-500">Tidak ada produk unggulan saat ini.</p>
          </div>
        )}
      </div>
    </section>
  );
};

/// Optimized skeleton for mobile view with square images
const ProductCardSkeleton = () => (
  <div className="h-full">
    <Card className="overflow-hidden h-full flex flex-col">
      {/* Square image container */}
      <div className="aspect-square w-full relative">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="p-1.5 sm:p-3 pb-0">
        <Skeleton className="h-3 sm:h-5 w-3/4" />
      </CardHeader>
      <CardContent className="p-1.5 sm:p-3 pt-1 flex-grow">
        <Skeleton className="h-4 sm:h-6 w-1/2 mb-1" />
      </CardContent>
      <CardFooter className="p-1.5 sm:p-3 pt-0 flex gap-1 sm:gap-2">
        <Skeleton className="h-7 sm:h-8 w-full" />
        <Skeleton className="h-7 sm:h-8 w-7 sm:w-8" />
      </CardFooter>
    </Card>
  </div>
);

export default HighlightedProducts;