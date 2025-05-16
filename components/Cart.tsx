"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout?: (selectedItems: CartItem[]) => void;
}

export default function Cart({
  items,
  onRemove,
  onUpdateQuantity,
  onCheckout,
}: CartProps) {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    if (items.length > 0 && selectedItems.length === items.length) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedItems, items]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleQuantityChange = async (
    id: string,
    type: "increment" | "decrement"
  ) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    setLoadingItems((prev) => ({ ...prev, [id]: true }));

    try {
      const newQuantity =
        type === "increment"
          ? item.quantity + 1
          : Math.max(1, item.quantity - 1);

      await onUpdateQuantity(id, newQuantity);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleRemove = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus item ini dari keranjang?")) {
      onRemove(id);
      if (selectedItems.includes(id)) {
        setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      }
    }
  };

  const selectedTotal = items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const selectedProducts = items.filter((item) =>
      selectedItems.includes(item.id)
    );

    if (onCheckout) {
      onCheckout(selectedProducts);
    }

    localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));
    router.push("/checkout");
  };

  // Format price with Indonesian currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-10">
      <motion.div
        className="border rounded-lg shadow-md bg-white overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Keranjang</h2>

          {items.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 mb-4">Keranjang Anda kosong.</p>
              <Button
                onClick={() => router.push("/shop")}
                className="bg-primer text-white hover:bg-white hover:text-primer border border-primer"
              >
                Belanja Sekarang
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Select All Checkbox */}
              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Pilih Semua
                </label>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-lg border ${
                      selectedItems.includes(item.id)
                        ? "bg-gray-50 border-primer"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row p-3 sm:p-4 gap-3 sm:gap-4">
                      {/* Checkbox and Image */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <Checkbox
                          id={`select-${item.id}`}
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleSelect(item.id)}
                        />
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                            sizes="(max-width: 640px) 64px, 80px"
                          />
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex flex-col sm:flex-row flex-1 justify-between">
                        <div className="mb-2 sm:mb-0">
                          <h3 className="font-medium text-sm sm:text-base line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatPrice(item.price)}
                          </p>
                          <p className="text-xs sm:text-sm font-medium text-primer mt-1">
                            Subtotal: {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-3">
                          <div className="flex items-center border rounded-md shadow-sm">
                            <button
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                              onClick={() =>
                                handleQuantityChange(item.id, "decrement")
                              }
                              disabled={
                                item.quantity <= 1 || loadingItems[item.id]
                              }
                            >
                              <MinusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <span className="px-2 sm:px-3 text-xs sm:text-sm font-medium">
                              {loadingItems[item.id] ? "..." : item.quantity}
                            </span>
                            <button
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                              onClick={() =>
                                handleQuantityChange(item.id, "increment")
                              }
                              disabled={loadingItems[item.id]}
                            >
                              <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 h-auto"
                            disabled={loadingItems[item.id]}
                          >
                            <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary - Fixed at bottom on mobile */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t py-4 mt-4">
                <div className="px-4 sm:px-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                    <p className="text-sm sm:text-base">
                      Total ({selectedItems.length} item):
                      <span className="font-bold ml-1 text-primer">
                        {formatPrice(selectedTotal)}
                      </span>
                    </p>
                    <Button
                      onClick={handleCheckout}
                      className="bg-primer text-white hover:bg-white hover:text-primer border border-primer w-full sm:w-auto"
                      disabled={selectedItems.length === 0}
                    >
                      Checkout ({selectedItems.length} item)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
