"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  IconCamera,
  IconDashboard,
  IconInnerShadowTop,
  IconSettings,
  IconBox,
  IconCategory,
  IconLogout,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
      title: "Categories",
      url: "/admin/dashboard/category",
      icon: IconCategory,
    },
    {
      title: "Banners",
      url: "/admin/dashboard/banner",
      icon: IconCamera,
    },
  ],
  navBottom: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Logout",
      url: "/logout",
      icon: IconLogout,
    },
  ],
  user: {
    avatar: "/avatar-placeholder.jpg",
  },
};

export function AppSidebar({ ...props }) {
  const pathname = usePathname();

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
                src="/s.png"
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
                pathname.startsWith(item.url));

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
            Settings
          </h2>
        </div>
        <SidebarMenu>
          {data.navBottom.map((item, index) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={index} className="my-1.5">
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted hover:translate-x-1",
                      item.title === "Logout" && "text-red-500 hover:bg-red-50"
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

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <Image
              src={data.user.avatar || "/avatar-placeholder.jpg"}
              alt="Admin"
              width={40}
              height={40}
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="flex-1">
           
            
          </div>
          <SidebarTrigger className="ml-auto">
            <IconSettings className="w-4 h-4 text-muted-foreground" />
          </SidebarTrigger>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}