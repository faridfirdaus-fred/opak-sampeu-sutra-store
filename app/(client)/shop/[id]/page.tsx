"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DetailProduct from "../../../../components/DetailProduct";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { id } = await params; // Unwrap params menggunakan await
        const response = await fetch(`/api/product/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch product");
        }

        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        router.push("/shop"); // Redirect jika produk tidak ditemukan
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="p-6">
      <DetailProduct
        id={product.id}
        name={product.name}
        description={product.description}
        price={product.price}
        stock={product.stock}
        imageUrl={product.imageUrl}
        category={product.category}
      />
    </div>
  );
}
