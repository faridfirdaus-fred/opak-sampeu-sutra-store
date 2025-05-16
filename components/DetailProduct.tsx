"use client";

import Image from "next/image";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useSession, signIn } from "next-auth/react";
import { FiShoppingCart, FiCheckCircle } from "react-icons/fi";
import { toast } from "sonner";

interface DetailProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
}

export default function DetailProduct({
  id,
  name,
  description,
  price,
  stock,
  imageUrl,
  category,
}: DetailProductProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();
  const { status } = useSession();

  // Format price with Indonesian currency format
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  // Fetch other products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/product/getProduct");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        // Filter out the current product and limit to 8 products
        const otherProducts = data
          .filter((product: Product) => product.id !== id)
          .slice(0, 8);

        setProducts(otherProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [id]);

  // Handle adding to cart
  const handleAddToCart = async () => {
    if (status !== "authenticated") {
      // Store intended action in localStorage to resume after login
      localStorage.setItem(
        "pendingDetailAction",
        JSON.stringify({
          action: "add",
          productId: id,
        })
      );

      // Redirect to Google OAuth login
      signIn("google", { callbackUrl: window.location.href });
      return;
    }

    setAddingToCart(true);

    try {
      // Add to local cart
      addToCart({
        id: id,
        productId: id,
        name: name,
        price: price,
        quantity: 1,
        imageUrl: imageUrl,
      });

      // Send to server with credentials
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include auth cookies
        body: JSON.stringify({
          productId: id,
          quantity: 1,
          container: "TOPLES",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add item to cart:", errorData);
        throw new Error("Gagal menambahkan ke keranjang");
      }

      toast({
        title: "Berhasil ditambahkan ke keranjang!",
        description: name + " telah ditambahkan ke keranjang Anda.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal menambahkan ke keranjang",
        description: "Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle direct checkout
  const handleCheckout = () => {
    // Create checkout item
    const checkoutItem = [
      {
        id: id,
        productId: id,
        name: name,
        price: price,
        quantity: 1,
        imageUrl: imageUrl,
      },
    ];

    // Store in localStorage
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItem));

    // Redirect to checkout page
    router.push("/checkout");
  };

  return (
    <>
      {/* Product Detail Section */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-6 sm:py-10">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Product Image - Square on mobile, more rectangular on desktop */}
            <div className="w-full md:w-2/5 lg:w-1/3 p-4 sm:p-6 md:p-8">
              <div className="relative aspect-square md:aspect-[4/5] w-full overflow-hidden rounded-lg">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: imageLoaded ? 1 : 0,
                    scale: imageLoaded ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 33vw"
                    priority
                    onLoadingComplete={() => setImageLoaded(true)}
                  />
                </motion.div>

                {/* Category badge */}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-white/80 text-gray-800 backdrop-blur-sm">
                    {category}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <motion.div
              className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Product title and status */}
              <div className="mb-2 sm:mb-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {name}
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    variant={stock > 0 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {stock > 0 ? `Stok: ${stock}` : "Habis"}
                  </Badge>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4 sm:mb-6">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-primer">
                  {formattedPrice}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-sm sm:text-base font-medium mb-2 text-gray-700">
                  Deskripsi Produk
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {description}
                </p>
              </div>

              {/* Call to action buttons */}
              <div className="mt-auto flex flex-col sm:flex-row gap-3">
                {stock > 0 ? (
                  <>
                    {/* Add to Cart Button */}
                    <Button
                      className="flex-1 bg-white hover:bg-primer hover:text-white text-primer border border-primer"
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                    >
                      <FiShoppingCart className="mr-2 h-4 w-4" />
                      {addingToCart
                        ? "Menambahkan..."
                        : "Masukkan ke Keranjang"}
                    </Button>

                    {/* Direct Checkout Button */}
                    <Button
                      className="flex-1 bg-primer hover:bg-white hover:text-primer border border-primer text-white"
                      onClick={handleCheckout}
                    >
                      <FiCheckCircle className="mr-2 h-4 w-4" />
                      Langsung Checkout
                    </Button>
                  </>
                ) : (
                  <Button
                    className="bg-gray-200 text-gray-500 cursor-not-allowed"
                    disabled
                  >
                    Stok Habis
                  </Button>
                )}

                {/* Back to Shop Button */}
                <Button
                  variant="outline"
                  className="mt-3 sm:mt-0 sm:ml-auto border-gray-300 text-gray-600"
                  onClick={() => router.push("/shop")}
                >
                  Kembali ke Toko
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Other Products Section - unchanged */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-4 sm:py-8 mb-10">
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            Produk Lainnya
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Jelajahi produk lainnya dari koleksi kami
          </p>
        </div>

        {/* Rest of the existing code for products grid */}
        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="aspect-square w-full bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          // Products grid
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group block h-full"
              >
                <motion.div
                  className="h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  {/* Product Image - Square */}
                  <div className="aspect-square w-full relative overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm font-semibold text-primer mt-1">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(product.price)}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          // No products found
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada produk lainnya saat ini.</p>
          </div>
        )}
      </div>
    </>
  );
}
