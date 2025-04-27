"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CheckoutProps {
  productId: string;
  stock: number;
  price: number;
  name: string;
}

export default function Checkout({
  productId,
  stock,
  price,
  name,
}: CheckoutProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of product ${productId} to cart`);
  };

  const handleBuyNow = () => {
    console.log(`Buying ${quantity} of product ${productId}`);
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment" && quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md shadow-md">
      <div className="flex items-center justify-between">
        <p className="font-medium">Atur jumlah dan catatan</p>
        <p className="text-sm text-muted-foreground">Stok: {stock}</p>
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
          className="flex-1"
          disabled={stock <= 0}
        >
          + Keranjang
        </Button>
        <Button onClick={handleBuyNow} className="flex-1" disabled={stock <= 0}>
          Beli Langsung
        </Button>
      </div>
    </div>
  );
}
