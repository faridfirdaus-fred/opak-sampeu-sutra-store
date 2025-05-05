import { PrismaClient } from "@prisma/client";

// Declare global variable to maintain prisma instance across hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of PrismaClient
export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Prevent multiple instances during hot reloading in development
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
export default prisma;