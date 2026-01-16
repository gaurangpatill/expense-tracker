import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL_TEST;
if (!connectionString) {
  throw new Error("DATABASE_URL_TEST is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function resetDatabase() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "RecurringRun",
      "RecurringRule",
      "Budget",
      "Transaction",
      "Attachment",
      "Category",
      "FinancialAccount",
      "UserPreferences",
      "Session",
      "Account",
      "VerificationToken",
      "User"
    RESTART IDENTITY CASCADE;
  `);
}

export async function createUser(email: string, password = "Password123!") {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });
}

export async function disconnect() {
  await prisma.$disconnect();
  await pool.end();
}
