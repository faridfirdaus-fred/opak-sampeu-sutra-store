"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  IconBox,
  IconCategory,
  IconMagnet,
  IconDashboard,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Product",
      url: "/admin/dashboard/product",
      icon: IconBox,
    },
    {
      title: "Category",
      url: "/admin/dashboard/category",
      icon: IconCategory,
    },
    {
      title: "Banner",
      url: "/admin/dashboard/banner",
      icon: IconMagnet,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="border-r shadow-sm" {...props}>
      {/* Sidebar Header */}
      <SidebarHeader className="border-b py-4">
        <div className="flex items-center justify-center px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                OP
              </span>
            </div>
            <span className="font-semibold text-xl tracking-tight">
              Admin Panel
            </span>
          </Link>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {data.navMain.map((item, index) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/admin/dashboard" &&
                pathname.startsWith(item.url));

            return (
              <SidebarMenuItem key={index} className="my-1">
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      "flex items-center gap-3 py-2.5 px-4 rounded-md transition-colors duration-200",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span>{item.title}</span>
                    {isActive && (
                      <div className="absolute left-0 h-5 w-0.5 bg-primary rounded-r"></div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span className="text-xs font-medium">Opak Sampeusutra</span>
            <span>•</span>
            <span className="text-xs">v1.0</span>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            © 2025 Opak Sampeusutra
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
