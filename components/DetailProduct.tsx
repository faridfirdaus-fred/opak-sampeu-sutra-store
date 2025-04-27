"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Checkout from "@/components/Checkout";

interface DetailProductProps {
  id: string;
  name: string;
  description: string;
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
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Product Image */}
      <div className="flex-1">
        <Image
          src={imageUrl}
          alt={name}
          width={500}
          height={500}
          className="object-cover rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-sm text-muted-foreground">{category}</p>
        </div>
        <p className="text-lg">{description}</p>
        <p className="text-2xl font-bold text-primary">
          Rp{price.toLocaleString()}
        </p>
        <Badge
          variant={stock > 0 ? "secondary" : "destructive"}
          className="w-fit"
        >
          {stock > 0 ? `Stok: ${stock}` : "Habis"}
        </Badge>

        {/* Checkout Component */}
        <Checkout productId={id} stock={stock} price={price} name={name} />
      </div>
    </div>
  );
}
