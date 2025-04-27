"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiShoppingCart } from "react-icons/fi";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
  price: number;
  onCheckout: () => void;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  imageUrl,
  stock,
  price,
  onCheckout,
  onAddToCart,
}) => {
  const router = useRouter();

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={() => router.push(`/shop/${id}`)}
      >
        {/* Product Image */}
        <div className="h-64 relative">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Stock Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={stock > 0 ? "secondary" : "destructive"}
              className="backdrop-blur-sm"
            >
              {stock > 0 ? `Stok: ${stock}` : "Habis"}
            </Badge>
          </div>
        </div>
      </div>

      <CardHeader className="p-4 pb-0">
        <h3 className="text-lg font-semibold line-clamp-2">{name}</h3>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-xl font-bold text-primary">
          Rp{price.toLocaleString()}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button onClick={onCheckout} disabled={stock <= 0} className="flex-1">
          Beli Sekarang
        </Button>

        <Button
          onClick={onAddToCart}
          disabled={stock <= 0}
          variant="outline"
          size="icon"
        >
          <FiShoppingCart />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
