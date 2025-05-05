"use client";

import { useEffect, useState } from "react";
import SearchAndFilter from "../../../components/searchAndFilter";
import ProductCard from "../../../components/ProductCard";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
  price: number;
  category: string;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const categories = ["OPAK", "BASTIK", "KACANG"]; // Sesuai dengan enum Category di Prisma

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/api/product/getProduct");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data); // Default: tampilkan semua produk
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
    console.log(`Checkout product with ID: ${id}`);
  };

  const handleAddToCart = (id: string) => {
    console.log(`Add product with ID: ${id} to cart`);
  };

  return (
    <div className="px-20 mb-20 mx-auto py-15">
      {/* Search and Filter */}
      <SearchAndFilter
        categories={categories}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      {/* Product Grid */}
      <div
        className={`grid gap-4 ${
          filteredProducts.length < 5
            ? "grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] justify-center"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        }`}
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
      </div>
    </div>
  );
}
