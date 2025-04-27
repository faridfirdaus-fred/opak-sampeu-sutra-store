import { PrismaClient } from "@prisma/client";

// Deklarasi tipe untuk properti global
declare global {
  declare module "node:global" {
    namespace NodeJS {
      interface Global {
        prisma: PrismaClient | undefined;
      }
    }
  }
}

// Mencegah multiple instances di development
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
