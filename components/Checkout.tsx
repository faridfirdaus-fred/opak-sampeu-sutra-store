"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlusIcon, MinusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

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

export default function Checkout({
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

  // Format price nicely with Indonesian currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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
      message += `${index + 1}. ${item.name} (${item.quantity} x ${formatPrice(
        item.price
      )}) = ${formatPrice(item.price * item.quantity)}\n`;
    });

    message += `\n*Total Pembayaran: ${formatPrice(totalAmount)}*`;

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
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-16">
        <div className="flex justify-center items-center">
          <div className="animate-pulse text-gray-500">
            Memuat informasi checkout...
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">
            Tidak ada item untuk checkout
          </h1>
          <Button
            onClick={() => router.push("/shop")}
            className="bg-primer text-white hover:bg-white hover:text-primer border border-primer"
          >
            Kembali ke Toko
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column: Items */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">
                Pesanan Anda
              </h2>
              <div className="divide-y">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm sm:text-base line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {formatPrice(item.price)}
                        </p>
                        {item.stock !== undefined && (
                          <p className="text-xs text-gray-500 mt-1">
                            Stok: {item.stock}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 ml-auto mt-2 sm:mt-0">
                      <div className="flex items-center border rounded-md">
                        <button
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          onClick={() => handleDecreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <span className="px-2 sm:px-3 text-xs sm:text-sm">
                          {item.quantity}
                        </span>
                        <button
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          onClick={() => handleIncreaseQuantity(item.id)}
                          disabled={item.quantity >= (item.stock || 10)}
                        >
                          <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                      <div className="font-medium text-sm sm:text-base whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm sm:text-base">
                    Total
                  </span>
                  <span className="text-base sm:text-lg font-bold text-primer">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column: Customer info and checkout button */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">
                Informasi Pengiriman
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={customerInfo.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-primer focus:border-primer"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                    Alamat Pengiriman <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-primer focus:border-primer"
                    rows={3}
                    placeholder="Masukkan alamat lengkap pengiriman"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    name="notes"
                    value={customerInfo.notes}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-primer focus:border-primer"
                    rows={2}
                    placeholder="Tambahkan catatan untuk pesanan Anda"
                  />
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 mt-4 text-white flex items-center justify-center gap-2"
                  onClick={handleWhatsAppCheckout}
                >
                  <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Pesan via WhatsApp</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
