"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define card types for better type safety
type DashboardMetrics = {
  products: number;
  banners: number;
  highlightedProducts: number;
};

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    products: 0,
    banners: 0,
    highlightedProducts: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);

        // Fetch product count
        const productRes = await fetch("/api/product/getProduct");
        const products = await productRes.json();

        // Fetch banner count
        const bannerRes = await fetch("/api/banner/getBanner");
        const banners = await bannerRes.json();

        // Fetch highlighted product count
        const highlightedRes = await fetch(
          "/api/highlightedProduct/getHighlightedProduct"
        );
        const highlightedProducts = await highlightedRes.json();

        setMetrics({
          products: Array.isArray(products) ? products.length : 0,
          banners: Array.isArray(banners) ? banners.length : 0,
          highlightedProducts: Array.isArray(highlightedProducts)
            ? highlightedProducts.length
            : 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const navigateToPage = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-semibold mb-6">Dashboard Admin</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Product Card */}
              <div
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                onClick={() => navigateToPage("/admin/dashboard/product")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Total Produk</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path
                      fillRule="evenodd"
                      d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold mt-2">
                    {isLoading ? "..." : metrics.products}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-blue-600 text-sm">Kelola produk</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Banner Card */}
              <div
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                onClick={() => navigateToPage("/admin/dashboard/banner")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Total Banner</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold mt-2">
                    {isLoading ? "..." : metrics.banners}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-green-600 text-sm">Kelola banner</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Highlighted Products Card */}
              <div
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                onClick={() => navigateToPage("/admin/dashboard/highlighted")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Produk Unggulan</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-amber-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold mt-2">
                    {isLoading ? "..." : metrics.highlightedProducts}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-amber-600 text-sm">
                    Kelola produk unggulan
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
