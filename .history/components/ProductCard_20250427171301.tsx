"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function () {
  interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    stock: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(6); // Jumlah produk yang ditampilkan awalnya

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product/getProduct");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 6); // Tambah 6 produk setiap kali scroll
  };

  return (
    <div
      className="p-4"
      onScroll={(e) => {
        const target = e.target as HTMLElement;
        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
          loadMoreProducts();
        }
      }}
    >
      <h1 className="text-2xl font-bold mb-4">Shop</h1>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        }}
      >
        {products.slice(0, visibleProducts).map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.imageUrl || "/images/default-product.jpg"}
            stock={product.stock}
          />
        ))}
      </div>
    </div>
  );
}
