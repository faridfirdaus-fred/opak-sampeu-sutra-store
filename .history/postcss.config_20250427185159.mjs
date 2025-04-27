import tailwindcss from "tailwindcss";

const config = {
  plugins: {
    tailwindcss: tailwindcss({ prefix: "tw" }), // Memastikan Tailwind CSS dimuat dengan prefix
    autoprefixer: {}, // Tambahkan autoprefixer jika diperlukan
  },
};

export default config;
