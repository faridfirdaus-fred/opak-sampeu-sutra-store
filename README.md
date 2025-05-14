# Opak Sampeu Sutra Store

Opak Sampeu Sutra Store adalah platform e-commerce yang menghadirkan opak, makanan ringan khas Indonesia yang terbuat dari singkong, dengan kualitas terbaik. Platform ini dibangun dengan teknologi modern untuk memberikan pengalaman berbelanja yang aman, nyaman, dan efisien.

## 🚀 Fitur Utama

- **Katalog Produk**: Menampilkan berbagai varian opak dengan detail lengkap
- **Manajemen Banner**: Sistem pengelolaan banner promosi yang dinamis
- **Panel Admin**: Dashboard admin untuk mengelola produk dan konten
- **Responsive Design**: Tampilan yang optimal di berbagai perangkat
- **Animasi Modern**: Pengalaman pengguna yang menarik dengan animasi Framer Motion

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion
- **UI Components**: Shadcn/ui

## 📋 Prasyarat

- Node.js (versi 18 atau lebih tinggi)
- MongoDB
- npm atau yarn

## 🚀 Cara Memulai

1. Clone repository:

   ```bash
   git clone https://github.com/yourusername/opak-sampeu-sutra-store.git
   cd opak-sampeu-sutra-store
   ```

2. Install dependencies:

   ```bash
   npm install
   # atau
   yarn install
   ```

3. Setup environment variables:
   Buat file `.env` di root project dan isi dengan variabel berikut:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Jalankan migrasi database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Buat admin user pertama:

   ```bash
   node createadmin.js
   ```

6. Jalankan development server:

   ```bash
   npm run dev
   # atau
   yarn dev
   ```

7. Buka [http://localhost:3000](http://localhost:3000) di browser Anda

## 📁 Struktur Project

```
opak-sampeu-sutra-store/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── admin/            # Admin components
│   └── ui/               # UI components
├── prisma/               # Database schema and migrations
├── public/              # Static assets
└── styles/             # Global styles
```

## 🔐 Autentikasi

Sistem menggunakan NextAuth.js untuk autentikasi dengan fitur:

- Login admin
- Session management
- Protected routes

## 🛍️ Fitur E-commerce

- Katalog produk dengan filter dan pencarian
- Detail produk
- Manajemen banner promosi
- Panel admin untuk manajemen konten

## 🤝 Kontribusi

Kontribusi selalu diterima! Untuk berkontribusi:

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Kontak

Alief Falatehan - [@alief_falatehan](https://twitter.com/alief_falatehan)

Link Project: [https://github.com/yourusername/opak-sampeu-sutra-store](https://github.com/yourusername/opak-sampeu-sutra-store)
