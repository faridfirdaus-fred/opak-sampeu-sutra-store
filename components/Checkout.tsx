"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Notification from "@/components/Notification";

interface CheckoutProps {
  productId: string;
  stock: number;
  price: number;
  name: string;
  imageUrl: string; // Tambahkan imageUrl sebagai prop
}

export default function Checkout({
  productId,
  stock,
  price,
  name,
  imageUrl,
}: CheckoutProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddToCart = async () => {
    try {
      // Tambahkan ke keranjang dengan container yang valid
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
          container: "TOPLES", // Gunakan nilai enum yang valid
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add item to cart:", errorData);
        throw new Error("Gagal menambahkan produk ke keranjang");
      }

      // Update local cart juga
      addToCart({
        id: productId,
        productId,
        name,
        price,
        quantity,
        imageUrl,
      });

      // Notifikasi sukses
      setNotification("Produk berhasil ditambahkan ke keranjang!");
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error(error);
      setNotification("Gagal menambahkan produk ke keranjang!");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment" && quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <>
      {notification && <Notification message={notification} type="success" />}
      <div className="flex flex-col gap-4 p-4 border rounded-md shadow-md bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="font-medium">Atur jumlah dan catatan</p>
          <p className="text-sm text-gray-500">Stok: {stock}</p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange("decrement")}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <p className="text-lg font-bold">{quantity}</p>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange("increment")}
            disabled={quantity >= stock}
          >
            +
          </Button>
        </div>

        {/* Subtotal */}
        <p className="text-lg font-bold">
          Subtotal: Rp{(price * quantity).toLocaleString()}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-green-500 text-white hover:bg-green-600"
            disabled={stock <= 0}
          >
            + Keranjang
          </Button>
        </div>
      </div>
    </>
  );
}
