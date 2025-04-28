"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex mb-20 mt-10 flex-col md:flex-row gap-8 px-20 py-6 bg-white rounded-lg shadow-md">
      {/* Product Image */}
      <div className="flex-1 max-w-md py-10 mx-auto md:mx-0">
        {" "}
        {/* Batasi lebar gambar */}
        <Image
          src={imageUrl}
          alt={name}
          width={400}
          height={400}
          className="w-[400px] h-[400px] object-cover rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 py-10 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-sm text-gray-500">{category}</p>
        </div>
        <p className="text-lg text-gray-700">{description}</p>
        <p className="text-2xl font-bold text-green-600">
          Rp{price.toLocaleString()}
        </p>
        <Badge
          variant={stock > 0 ? "secondary" : "destructive"}
          className="w-fit"
        >
          {stock > 0 ? `Stok: ${stock}` : "Habis"}
        </Badge>

        {/* Checkout Component */}
        <Checkout
          productId={id}
          stock={stock}
          price={price}
          name={name}
          imageUrl={imageUrl} // Teruskan imageUrl
        />
      </div>
    </div>
  );
}
