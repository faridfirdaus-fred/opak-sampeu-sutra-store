module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Pastikan path ini sesuai dengan struktur proyek Anda
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF7722", // Warna primer baru
      },
    },
  },
  plugins: [],
};
