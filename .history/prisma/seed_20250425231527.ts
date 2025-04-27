import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Tambahkan kategori
  const category = await prisma.category.upsert({
    where: { name: "Makanan Ringan" },
    update: {},
    create: {
      name: "Makanan Ringan",
    },
  });

  // Tambahkan produk
  await prisma.product.upsert({
    where: { name: "Opak Sampeu Pedas" },
    update: {},
    create: {
      name: "Opak Sampeu Pedas",
      description: "Opak sampeu dengan rasa pedas yang menggugah selera.",
      price: 15000,
      stock: 100,
      categoryId: category.id,
    },
  });
}

main()
  .then(() => {
    console.log("Data dummy berhasil ditambahkan.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
