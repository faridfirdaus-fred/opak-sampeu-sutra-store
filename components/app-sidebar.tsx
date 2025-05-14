"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  IconCamera,
  IconDashboard,
  IconBox,
  IconLogout,
} from "@tabler/icons-react";

// Replace with the actual library name
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import router
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
const DEFAULT_AVATAR_BASE64 =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjYiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAyMXYtMmE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIj48L3BhdGg+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ij48L2NpcmNsZT48L3N2Zz4=";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/admin/dashboard/product",
      icon: IconBox,
    },

    {
      title: "Banners",
      url: "/admin/dashboard/banner",
      icon: IconCamera,
    },
  ],
  navBottom: [
    {
      title: "Logout",
      url: "/logout",
      icon: IconLogout,
    },
  ],
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: DEFAULT_AVATAR_BASE64, // Use base64 directly
  },
};

export function AppSidebar({ ...props }) {
  const pathname = usePathname();
  const router = useRouter(); // Gunakan router untuk navigasi

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear any local storage or session data if needed
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");

      // Redirect to login page
      router.push("/admin/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally show an error message to the user
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r shadow-md bg-gradient-to-b from-white to-gray-50"
      {...props}
    >
      {/* Sidebar Header */}
      <SidebarHeader className="border-b py-5 px-4">
        <div className="flex items-center justify-center">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10  rounded-lg flex ">
              <Image
                src="/icon.png"
                alt="Logo"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight">
                Opak Sampeu Sutra
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Admin Dashboard
              </span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-3 py-6">
        <div className="mb-2 px-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Main Navigation
          </h2>
        </div>
        <SidebarMenu>
          {data.navMain.map((item, index) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/admin/dashboard" &&
                (pathname ?? "").startsWith(item.url));

            function cn(
              ...classes: (string | undefined | null | false)[]
            ): string {
              return classes.filter(Boolean).join(" ");
            }

            return (
              <SidebarMenuItem key={index} className="my-1.5">
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 relative overflow-hidden",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted hover:translate-x-1"
                    )}
                  >
                    <item.icon
                      strokeWidth={1.8}
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span className="font-medium">{item.title}</span>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        className="absolute left-0 top-0 w-1 bg-primary rounded-r"
                      />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <div className="mt-8 mb-2 px-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Keluar
          </h2>
        </div>
        <SidebarMenu>
          {data.navBottom.map((item, index) => {
            if (item.title === "Logout") {
              return (
                <SidebarMenuItem key={index} className="my-1.5">
                  <SidebarMenuButton
                    onClick={handleLogout} // Panggil handleLogout saat logout diklik
                    className="flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-50"
                  >
                    <item.icon
                      strokeWidth={1.8}
                      className="w-5 h-5 text-red-500"
                    />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            const isActive = pathname === item.url;

            function cn(
              ...classes: (string | undefined | null | false)[]
            ): string {
              return classes.filter(Boolean).join(" ");
            }

            return (
              <SidebarMenuItem key={index} className="my-1.5">
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted hover:translate-x-1"
                    )}
                  >
                    <item.icon
                      strokeWidth={1.8}
                      className={cn(
                        "w-5 h-5",
                        isActive
                          ? "text-primary"
                          : item.title === "Logout"
                          ? "text-red-500"
                          : "text-muted-foreground"
                      )}
                    />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
