"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="p-4">Open Sidebar</button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="p-4">
            <h2 className="text-lg font-bold">Admin Sidebar</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/admin/dashboard" className="text-blue-500">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/admin/settings" className="text-blue-500">
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 p-4">{children}</main>
        <Toaster richColors />
      </div>
    </div>
  );
}
