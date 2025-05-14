import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash("opaktsk333", 10);

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        username: "opaksutra",
        password: hashedPassword,
      },
    });

    console.log("Admin user created successfully:", admin);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
