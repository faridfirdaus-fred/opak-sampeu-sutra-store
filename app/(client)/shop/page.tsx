"use client";

import { useEffect, useState } from "react";
import SearchAndFilter from "../../../components/searchAndFilter";
import ProductCard from "../../../components/ProductCard";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
  price: number;
  category: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ["OPAK", "BASTIK", "KACANG"]; // Sesuai dengan enum Category di Prisma

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await fetch("/api/product/getProduct");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Default: tampilkan semua produk
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilter = (category: string) => {
    if (category === "Semua") {
      setFilteredProducts(products); // Tampilkan semua produk
    } else {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    }
  };

  const handleCheckout = (id: string) => {
    // Find the product
    const product = products.find((p) => p.id === id);
    if (!product) return;

    // Create checkout item
    const checkoutItem = [
      {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      },
    ];

    // Store in localStorage
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItem));

    // Redirect to checkout page
    window.location.href = "/checkout";
  };

  const handleAddToCart = (id: string) => {
    // The actual add to cart functionality is implemented in the ProductCard component
    console.log(`Add product with ID: ${id} to cart`);
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 md:px-10 lg:px-20 mb-10 sm:mb-20">
    
      {/* Search and Filter */}
      <div className="mb-4 sm:mb-6">
        <SearchAndFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          categories={categories}
        />
      </div>

      {loading ? (
        // Loading skeleton
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
          {[...Array(10)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        // Product Grid - Always 2 columns on mobile, scaling up for larger screens
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.imageUrl}
              stock={product.stock}
              price={product.price}
              onCheckout={() => handleCheckout(product.id)}
              onAddToCart={() => handleAddToCart(product.id)}
            />
          ))}
        </motion.div>
      ) : (
        // No products found
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500">Tidak ada produk yang ditemukan.</p>
        </div>
      )}
    </div>
  );
}

// Simple skeleton loader that matches the ProductCard
const ProductCardSkeleton = () => (
  <div className="h-full">
    <div className="overflow-hidden h-full flex flex-col rounded-lg bg-gray-100 shadow-sm">
      {/* Square image container */}
      <div className="aspect-square w-full relative bg-gray-200"></div>
      <div className="p-2 sm:p-3">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="flex gap-1 sm:gap-2">
          <div className="h-7 sm:h-8 bg-gray-200 rounded flex-grow"></div>
          <div className="h-7 sm:h-8 w-7 sm:w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);
