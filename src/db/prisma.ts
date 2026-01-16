import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
  adapter?: PrismaPg;
};

const isTest = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);
const connectionString =
  isTest && process.env.DATABASE_URL_TEST
    ? process.env.DATABASE_URL_TEST
    : process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const shouldCache = process.env.NODE_ENV !== "production" && !isTest;

const pool =
  shouldCache && globalForPrisma.pool
    ? globalForPrisma.pool
    : new Pool({
        connectionString,
        max: isTest ? 1 : undefined,
      });

const adapter =
  shouldCache && globalForPrisma.adapter
    ? globalForPrisma.adapter
    : new PrismaPg(pool);

export const prisma =
  shouldCache && globalForPrisma.prisma
    ? globalForPrisma.prisma
    : new PrismaClient({
        adapter,
      });

if (shouldCache) {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
  globalForPrisma.adapter = adapter;
}
