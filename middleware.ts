import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const adminToken = req.cookies.get("adminToken");

  // Jika tidak ada token admin dan bukan di halaman login, redirect ke login
  if (!adminToken && !req.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Jika sudah login dan mencoba mengakses halaman login, redirect ke dashboard
  if (adminToken && req.nextUrl.pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

// Middleware hanya berlaku untuk route admin
export const config = {
  matcher: ["/admin/:path*"],
};
