// lib/prisma.js

import { PrismaClient } from "@prisma/client";

// Extend the NodeJS.Global interface to include the prisma property
const globalForPrisma = global as NodeJS.Global;
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient;
    }
  }
}

// Mencegah multiple instances di development
const globalForPrisma = global;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}

const prisma = globalForPrisma.prisma;

export default prisma;
