import type { PrismaClient } from "@prisma/client";
import { createPrismaClient } from "@/lib/prisma-create";

// Prisma singleton (TESTING.md §13.2 — one client across HMR/dev)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
