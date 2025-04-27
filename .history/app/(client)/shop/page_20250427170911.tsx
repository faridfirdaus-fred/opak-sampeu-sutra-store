"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

const mockProducts = Array.from({ length: 30 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Produk ${i + 1}`,
  price: Math.floor(Math.random() * 100000) + 10000,
  image: "/images/sample-product.jpg",
  stock: Math.floor(Math.random() * 20),
}));

export default function Shop() {
  const [visibleProducts, setVisibleProducts] = useState(6); // Jumlah produk yang ditampilkan awalnya

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
        {mockProducts.slice(0, visibleProducts).map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            stock={product.stock}
          />
        ))}
      </div>
    </div>
  );
}
