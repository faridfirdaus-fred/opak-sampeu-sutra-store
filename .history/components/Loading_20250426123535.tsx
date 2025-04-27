"use client";

import { ClipLoader, PulseLoader, RingLoader } from "react-spinners";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  type?: "clip" | "pulse" | "ring";
}

export default function LoadingSpinner({
  size = 40,
  color = "#363062", // sesuaikan dengan warna tema aplikasi
  type = "clip",
}: LoadingSpinnerProps) {
  const renderLoader = () => {
    switch (type) {
      case "clip":
        return <ClipLoader color={color} size={size} />;
      case "pulse":
        return <PulseLoader color={color} size={size / 3} />;
      case "ring":
        return <RingLoader color={color} size={size} />;
      default:
        return <ClipLoader color={color} size={size} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {renderLoader()}
      <p className="mt-4 text-gray-500 animate-pulse">Sedang memuat...</p>
    </div>
  );
}
