import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiShoppingCart } from "react-icons/fi";

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
  name,
  imageUrl,
  stock,
  price,
  onCheckout,
  onAddToCart,
}) => {
  return (
    <Card className="relative w-64">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-40 object-cover rounded-t-md"
          />
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            Stock: {stock}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <p className="text-sm text-gray-500 mt-1">Rp{price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <Button
          variant="outline"
          onClick={onAddToCart}
          className="flex items-center gap-2"
        >
          <FiShoppingCart />
          Masukkan ke Cart
        </Button>
        <Button onClick={onCheckout}>Checkout</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
