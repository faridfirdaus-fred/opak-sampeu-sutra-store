"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Type for Product
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
}

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// Individual Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to product detail

    try {
      // Call your cart API here
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      // Show success notification
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to product detail
    router.push(`/checkout?productId=${product.id}`);
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="overflow-hidden h-full flex flex-col">
        <motion.div
          className="relative cursor-pointer overflow-hidden"
          onClick={() => router.push(`/shop/${product.id}`)}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Product Image */}
          <div className="h-64 relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Stock Badge */}
            <div className="absolute top-2 right-2">
              <Badge
                variant={product.stock > 0 ? "secondary" : "destructive"}
                className="backdrop-blur-sm"
              >
                {product.stock > 0 ? `Stok: ${product.stock}` : "Habis"}
              </Badge>
            </div>
          </div>
        </motion.div>

        <CardHeader className="p-4 pb-0">
          <Link href={`/shop/${product.id}`} className="hover:underline">
            <h3 className="text-lg font-semibold line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </CardHeader>

        <CardContent className="p-4 pt-2 flex-grow">
          <p className="text-xl font-bold text-primary">
            Rp{product.price.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="flex-1"
          >
            Beli Sekarang
          </Button>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            variant="outline"
            size="icon"
          >
            <motion.div whileTap={{ scale: 0.9 }}>
              <FaShoppingCart />
            </motion.div>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
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

export default function HighlightedProducts() {
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
       console.log("Fetched Highlighted Products:", data); // Tambahkan log
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
    <section className="py-12 px-4 md:px-20">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          // Products found
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
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
}
