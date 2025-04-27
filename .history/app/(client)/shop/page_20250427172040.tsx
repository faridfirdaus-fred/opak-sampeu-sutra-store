"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/api/product/getProduct");
      const data = await response.json();
      setProducts(data);
    }

    fetchProducts();
  }, []);

  const handleCheckout = (id: string) => {
    console.log(`Checkout product with ID: ${id}`);
  };

  const handleAddToCart = (id: string) => {
    console.log(`Add product with ID: ${id} to cart`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          imageUrl={product.imageUrl}
          stock={product.stock}
          onCheckout={() => handleCheckout(product.id)}
          onAddToCart={() => handleAddToCart(product.id)}
        />
      ))}
    </div>
  );
}
