"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/Sidebar"; // Import Sidebar
import { SidebarProvider } from "@/components/ui/sidebar"; // Import SidebarProvider

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <SiteHeader />
          <main className="flex-1 p-4">{children}</main>
          <Toaster richColors />
        </div>
      </div>
    </SidebarProvider>
  );
}
console.log("Admin layout digunakan");