"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Add this import
import { FaInfoCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { useCart } from "@/context/CartContext"; // Import cart context
import Notification from "@/components/Notification"; // Import notification component

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
  const handleAddToCart = async (product: Product) => {
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

      // Send to server
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          container: "TOPLES", // Using valid enum value
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

  // Handle direct checkout
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
    <section className="py-12 px-4 md:px-20">
      {notification && <Notification message={notification} type="success" />}

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            className="text-2xl md:text-3xl font-bold"
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
              <Link href="/shop" className="flex items-center gap-1">
                Lihat Semua <FaInfoCircle />
              </Link>
            </Button>
          </motion.div>
        </div>

        {loading ? (
          // Loading state with skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          // Products found
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
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
          <div className="text-center py-10">
            <p className="text-gray-500">Tidak ada produk unggulan saat ini.</p>
          </div>
        )}
      </div>
    </section>
  );
};

// Loading skeleton component
const ProductCardSkeleton = () => (
  <div className="h-full">
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-64 relative">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="p-4 pb-0">
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <Skeleton className="h-7 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  </div>
);

export default HighlightedProducts;
