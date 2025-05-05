"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlusIcon, MinusIcon } from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock?: number;
}

interface CheckoutPageProps {
  productId?: string;
  stock?: number;
  price?: number;
  name?: string;
  imageUrl?: string;
}

interface CustomerInfo {
  fullName: string;
  address: string;
  notes: string;
}

export default function CheckoutPage({
  productId,
  stock,
  price,
  name,
  imageUrl,
}: CheckoutPageProps = {}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Customer information state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    // Handle direct product checkout if props are provided
    if (productId && name && price && imageUrl) {
      const singleItem: CartItem = {
        id: `direct-${productId}`,
        productId,
        name,
        price,
        quantity: 1,
        imageUrl,
        stock,
      };

      setItems([singleItem]);
      setLoading(false);
      return;
    }

    // Otherwise retrieve selected items from localStorage
    const storedItems = localStorage.getItem("checkoutItems");

    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        fetchStockInformation(parsedItems);
      } catch (error) {
        console.error("Failed to parse checkout items:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [productId, name, price, imageUrl, stock]);

  // Fetch stock information for items
  const fetchStockInformation = async (items: CartItem[]) => {
    try {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const response = await fetch(`/api/products/${item.productId}`);

            if (response.ok) {
              const productData = await response.json();
              return {
                ...item,
                stock: productData.stock || 10,
              };
            }
            return { ...item, stock: 10 };
          } catch (error) {
            console.error(
              `Failed to fetch stock for product ${item.productId}`,
              error
            );
            return { ...item, stock: 10 };
          }
        })
      );

      setItems(updatedItems);
    } catch (error) {
      console.error("Error fetching stock information:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle quantity increment
  const handleIncreaseQuantity = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId && item.quantity < (item.stock || 10)) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
    updateLocalStorage();
  };

  // Handle quantity decrement
  const handleDecreaseQuantity = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
    updateLocalStorage();
  };

  // Update localStorage when items change
  const updateLocalStorage = useCallback(() => {
    localStorage.setItem("checkoutItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (items.length > 0) {
      updateLocalStorage();
    }
  }, [items, updateLocalStorage]);

  // Calculate total amount
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const phoneNumber = "6282129091953";

    let message = `*PESANAN BARU*\n\n`;
    message += `*Detail Pelanggan:*\n`;
    message += `Nama: ${customerInfo.fullName}\n`;
    message += `Alamat: ${customerInfo.address}\n`;

    if (customerInfo.notes) {
      message += `Catatan: ${customerInfo.notes}\n`;
    }

    message += `\n*Detail Pesanan:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${
        item.quantity
      } x Rp${item.price.toLocaleString()}) = Rp${(
        item.price * item.quantity
      ).toLocaleString()}\n`;
    });

    message += `\n*Total Pembayaran: Rp${totalAmount.toLocaleString()}*`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  // Handle checkout via WhatsApp
  const handleWhatsAppCheckout = () => {
    if (!customerInfo.fullName || !customerInfo.address) {
      alert(
        "Mohon lengkapi nama dan alamat pengiriman untuk melanjutkan pesanan."
      );
      return;
    }

    window.open(generateWhatsAppMessage(), "_blank");
    localStorage.removeItem("checkoutItems");

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading checkout information...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">
          Tidak ada item untuk checkout
        </h1>
        <Button onClick={() => router.push("/shop")}>Kembali ke Toko</Button>
      </div>
    );
  }

  return (
    <div className="container mb-40 mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Items section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Pesanan Anda</h2>
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="py-4 flex items-center">
              <div className="relative w-20 h-20 mr-4">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-600">
                  Rp{item.price.toLocaleString()} x {item.quantity}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Stok tersedia: {item.stock || "Tidak diketahui"}
                </p>
                <div className="flex items-center mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDecreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span className="mx-3 text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleIncreaseQuantity(item.id)}
                    disabled={item.quantity >= (item.stock || 10)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="font-semibold">
                Rp{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold">
            Rp{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Customer information form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Informasi Pengiriman</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={customerInfo.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Alamat Pengiriman <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={customerInfo.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Masukkan alamat lengkap pengiriman"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              name="notes"
              value={customerInfo.notes}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Tambahkan catatan untuk pesanan Anda"
            />
          </div>
        </div>
      </div>

      {/* Checkout with WhatsApp button */}
      <div className="flex justify-end">
        <Button
          className="bg-green-600 text-white hover:bg-green-700 px-8 py-2 flex items-center gap-2"
          onClick={handleWhatsAppCheckout}
        >
          Pesan via WhatsApp
        </Button>
      </div>
    </div>
  );
}
