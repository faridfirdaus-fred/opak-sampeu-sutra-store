"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaInfoCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard"; // Import the ProductCard from the first code snippet
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

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
        console.log("Fetched Highlighted Products:", data); // Log data for debugging
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch highlighted products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHighlightedProducts();
  }, []);

  return (
    <section className=" py-12 px-4 md:px-20">
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
                onCheckout={() => {
                  // Handle checkout logic here
                }}
                onAddToCart={() => {
                  // Handle add to cart logic here
                }}
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
