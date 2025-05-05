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

interface CustomerInfo {
  fullName: string;
  address: string;
  notes: string;
}

export default function CheckoutPage() {
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
    // Retrieve selected items from localStorage
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
  }, []);

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
    // Use the provided phone number
    const phoneNumber = "6282129091953";

    // Create the order message
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

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  // Handle checkout via WhatsApp
  const handleWhatsAppCheckout = () => {
    // Form validation
    if (!customerInfo.fullName || !customerInfo.address) {
      alert(
        "Mohon lengkapi nama dan alamat pengiriman untuk melanjutkan pesanan."
      );
      return;
    }

    // Open WhatsApp in new tab
    window.open(generateWhatsAppMessage(), "_blank");

    // Clear checkout items from localStorage
    localStorage.removeItem("checkoutItems");

    // Redirect to home page after a delay
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
    <div className="container mx-auto p-4 max-w-4xl">
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

                {/* Stock information */}
                <p className="text-xs text-gray-500 mt-1">
                  Stok tersedia: {item.stock || "Tidak diketahui"}
                </p>

                {/* Quantity controls */}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Pesan via WhatsApp
        </Button>
      </div>
    </div>
  );
}
