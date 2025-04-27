"use client";

import { Button } from "@/components/ui/button";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
}

interface BannerTableProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
}

export default function BannerTable({
  banners,
  onEdit,
  onDelete,
}: BannerTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gambar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Judul
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {banners.map((banner) => (
            <tr key={banner.id}>
              <td className="px-6 py-4">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="h-16 w-32 object-cover rounded-md"
                />
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {banner.title}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(banner)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(banner.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
