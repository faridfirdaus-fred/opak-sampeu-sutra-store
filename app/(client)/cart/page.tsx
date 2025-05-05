"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "../../../context/CartContext";
import Cart from "../../../components/Cart";
import Notification from "../../../components/Notification";

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, removeFromCart, updateQuantity } = useCart();
  const [notification, setNotification] = useState<string | null>(null);

  // Jika belum login, tampilkan pesan untuk login
  if (!session) {
    return (
      <div className="px-4 md:px-20 py-10">
        <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>
        <div className="p-4 border rounded-md shadow-md bg-white">
          <p className="text-gray-500 mb-4">
            Silakan login untuk melihat keranjang belanja Anda.
          </p>
          <button
            onClick={() => router.push("/api/auth/signin")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  interface SelectedItem {
    id: string;
    quantity: number;
  }

  const handleCheckout = (selectedItems: SelectedItem[]): void => {
    // Implementasi checkout untuk item yang dipilih
    console.log("Selected items for checkout:", selectedItems);

    if (selectedItems.length === 0) {
      setNotification("Silakan pilih produk yang ingin dibeli");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Simulasikan checkout berhasil
    setNotification("Checkout berhasil! Pesanan Anda sedang diproses.");
    setTimeout(() => setNotification(null), 3000);

    // Implementasi lanjutan: redirect ke halaman pembayaran misalnya
    // router.push('/checkout');
  };

  return (
    <div className="px-4 md:px-20 py-10">
      {notification && <Notification message={notification} type="success" />}
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>
      <Cart
        items={items}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
