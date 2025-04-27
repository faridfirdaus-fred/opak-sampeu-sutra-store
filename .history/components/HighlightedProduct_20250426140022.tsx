"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";

// Type for Product
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
}

// Individual Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to product detail
    // Add to cart logic here
    console.log(`Added ${product.name} to cart`);
    // You would typically dispatch to a cart state manager or call an API
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to product detail
    // Buy now logic - typically go straight to checkout
    console.log(`Buy now: ${product.name}`);
    router.push(`/checkout?productId=${product.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <div
        className="relative cursor-pointer group"
        onClick={() => router.push(`/shop/${product.id}`)}
      >
        {/* Product Image */}
        <div className="h-64 relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Stock Badge */}
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
          {product.stock > 0 ? `Stok: ${product.stock}` : "Habis"}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/shop/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary mb-1 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-xl font-bold text-primary mb-3">
          Rp{product.price.toLocaleString()}
        </p>

        <div className="mt-auto flex gap-2">
          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-3 rounded-md text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Beli Sekarang
          </button>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex items-center justify-center bg-white border border-primary text-primary hover:bg-primary/10 py-2 px-3 rounded-md disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Highlighted Products Component
export default function HighlightedProducts() {
  // Sample data - in a real app, you'd fetch this from an API
  const highlightedProducts: Product[] = [
    {
      id: "1",
      name: "Opak Sampeu Original",
      price: 15000,
      stock: 25,
      description:
        "Opak sampeu original dengan rasa khas singkong pilihan terbaik, renyah dan enak.",
      image: "/products/opak-original.jpg", // Replace with your actual image path
    },
    {
      id: "2",
      name: "Opak Sampeu Pedas",
      price: 18000,
      stock: 15,
      description:
        "Opak sampeu dengan tambahan cabai pilihan yang memberikan sensasi pedas yang nikmat.",
      image: "/products/opak-pedas.jpg", // Replace with your actual image path
    },
    {
      id: "3",
      name: "Opak Sampeu Sutra Manis",
      price: 17000,
      stock: 20,
      description:
        "Opak sampeu sutra dengan sensasi manis yang khas, cocok untuk camilan keluarga.",
      image: "/products/opak-manis.jpg", // Replace with your actual image path
    },
    {
      id: "4",
      name: "Opak Sampeu Asin",
      price: 16000,
      stock: 0,
      description: "Opak sampeu dengan rasa asin gurih yang menggugah selera.",
      image: "/products/opak-asin.jpg", // Replace with your actual image path
    },
  ];

  return (
    <section className="py-12 px-4 md:px-20">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Produk Unggulan
          </h2>
          <Link
            href="/shop"
            className="text-primary flex items-center gap-1 hover:underline"
          >
            Lihat Semua <FaInfoCircle />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {highlightedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
