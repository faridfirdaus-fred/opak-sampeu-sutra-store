"use client";

// Import yang diperlukan di Cart.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";

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
  onCheckout: (selectedItems: CartItem[]) => void;
}

export default function Cart({
  items,
  onRemove,
  onUpdateQuantity,
  onCheckout,
}: CartProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Effect untuk update isAllSelected
  useEffect(() => {
    if (items.length > 0 && selectedItems.length === items.length) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedItems, items]);

  // Handle select all
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
  };

  // Handle individual checkbox
  const handleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Update quantity with loading state
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

  // Handle remove with confirmation
  const handleRemove = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus item ini dari keranjang?")) {
      onRemove(id);
      // Also remove from selected items if it's selected
      if (selectedItems.includes(id)) {
        setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      }
    }
  };

  // Calculate total for selected items
  const selectedTotal = items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Keranjang</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Keranjang Anda kosong.</p>
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
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-4 p-3 rounded-md ${
                selectedItems.includes(item.id) ? "bg-blue-50" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  id={`select-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleSelect(item.id)}
                />
                <div className="relative w-16 h-16">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Rp{item.price.toLocaleString()}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    Subtotal: Rp{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center border rounded-md">
                  <button
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => handleQuantityChange(item.id, "decrement")}
                    disabled={item.quantity <= 1 || loadingItems[item.id]}
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-3">
                    {loadingItems[item.id] ? "..." : item.quantity}
                  </span>
                  <button
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => handleQuantityChange(item.id, "increment")}
                    disabled={loadingItems[item.id]}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700"
                  disabled={loadingItems[item.id]}
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="border-t pt-4 mt-4">
            <p className="text-lg font-bold">
              Total ({selectedItems.length} item): Rp
              {selectedTotal.toLocaleString()}
            </p>
            <Button
              onClick={() =>
                onCheckout(
                  items.filter((item) => selectedItems.includes(item.id))
                )
              }
              className="bg-blue-500 text-white hover:bg-blue-600 mt-4 w-full"
              disabled={selectedItems.length === 0}
            >
              Checkout ({selectedItems.length} item)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
