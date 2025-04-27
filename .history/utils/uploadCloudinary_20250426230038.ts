type ContentType = "product" | "banner" | "highlighted";

export const uploadToCloudinary = async (
  file: File,
  contentType: ContentType
) => {
  try {
    // Tentukan preset berdasarkan jenis konten
    const preset = getPresetForContentType(contentType);

    // Buat form data untuk upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    // Lakukan upload ke Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload gagal");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error saat upload ke Cloudinary:", error);
    throw error;
  }
};

// Helper untuk mendapatkan preset berdasarkan jenis konten
const getPresetForContentType = (contentType: ContentType): string => {
  switch (contentType) {
    case "product":
      return process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_PRODUCT || "";
    case "banner":
      return process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_BANNER || "";
    case "highlighted":
      return process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_HIGHLIGHTED || "";
    default:
      throw new Error("Jenis konten tidak valid");
  }
};
