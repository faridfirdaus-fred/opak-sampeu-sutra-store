"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartContextProps {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  fetchCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      const sessionResponse = await fetch("/api/auth/session");
      const session = await sessionResponse.json();

      if (!session || !session.user?.id) {
        console.log("User not logged in");
        return;
      }

      const response = await fetch(`/api/cart`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch cart items:", errorData);
        return;
      }

      const data = await response.json();

      // Gabungkan item yang memiliki productId yang sama
      const mergedItems: { [key: string]: CartItem } = {};

      data.forEach((item: any) => {
        const productId = item.productId;
        if (mergedItems[productId]) {
          // Jika produk sudah ada, tambahkan quantity
          mergedItems[productId].quantity += item.quantity;
        } else {
          // Jika produk belum ada, tambahkan sebagai item baru
          mergedItems[productId] = {
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            imageUrl: item.product.imageUrl,
          };
        }
      });

      // Ubah object menjadi array
      setItems(Object.values(mergedItems));
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  // Add to cart dengan penggabungan produk yang sama
  const addToCart = async (item: CartItem) => {
    try {
      // Cek apakah produk sudah ada di keranjang
      const existingItemIndex = items.findIndex(
        (i) => i.productId === item.productId
      );

      if (existingItemIndex !== -1) {
        // Jika produk sudah ada, update quantity di frontend
        const updatedItems = [...items];
        const newQuantity =
          updatedItems[existingItemIndex].quantity + item.quantity;
        updatedItems[existingItemIndex].quantity = newQuantity;
        setItems(updatedItems);

        // Update di backend
        await fetch(`/api/cart/${items[existingItemIndex].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        });
      } else {
        // Jika produk belum ada, tambahkan ke keranjang
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
            container: "TOPLES", // Gunakan nilai enum yang valid
          }),
        });

        if (response.ok) {
          // Refresh keranjang setelah berhasil menambahkan
          fetchCart();
        } else {
          console.error("Failed to add item to cart");
        }
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  // Hapus dari keranjang
  const removeFromCart = async (id: string) => {
    try {
      // Optimistic UI update
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));

      // Kirim request ke server
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Jika gagal, rollback dan refresh cart
        console.error("Failed to remove item from cart");
        fetchCart();
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      // Refresh cart jika terjadi kesalahan
      fetchCart();
    }
  };

  // Update kuantitas
  const updateQuantity = async (id: string, quantity: number) => {
    try {
      // Optimistic UI update
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );

      // Kirim request ke server
      const response = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        console.error(
          "Failed to update item quantity, API returned:",
          response.status
        );
        const errorText = await response.text();
        console.error("Error details:", errorText);

        // Refresh cart jika terjadi kesalahan
        fetchCart();
      }
    } catch (error) {
      console.error("Failed to update item quantity:", error);
      // Refresh cart jika terjadi kesalahan
      fetchCart();
    }
  };

  // Load cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
