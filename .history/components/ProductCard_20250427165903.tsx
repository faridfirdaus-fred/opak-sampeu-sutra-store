"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  stock,
}: ProductCardProps) {
  const handleAddToCart = () => {
    console.log(`Added product ${id} to cart`);
  };

  const handleCheckout = () => {
    console.log(`Checkout product ${id}`);
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Stock Badge */}
      <div className="absolute top-2 right-2">
        <Badge
          variant={stock > 0 ? "secondary" : "destructive"}
          className="backdrop-blur-sm"
        >
          {stock > 0 ? `Stok: ${stock}` : "Habis"}
        </Badge>
      </div>

      {/* Product Image */}
      <div className="h-64 relative">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Details */}
      <CardHeader className="p-4 pb-0">
        <Link href={`/shop/${id}`} className="hover:underline">
          <h3 className="text-lg font-semibold line-clamp-2">{name}</h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-xl font-bold text-primary">
          Rp{price.toLocaleString()}
        </p>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
        <Button
          onClick={handleAddToCart}
          disabled={stock <= 0}
          variant="outline"
          size="icon"
        >
          🛒
        </Button>
        <Button
          onClick={handleCheckout}
          disabled={stock <= 0}
          className="flex-1"
        >
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
