import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

// Shared Prisma client factory (used by lib/db.ts singleton and prisma/seed.ts).
//
// ADR-002 — Turso on serverless: Vercel's Lambda filesystem is read-only, so the
// local file:./dev.db cannot serve production. When TURSO_DATABASE_URL is set we
// route through the libSQL driver adapter (hosted SQLite w/ full write support);
// otherwise (local dev / Vitest / E2E) we keep the plain file client — zero
// behavior change for `npm run dev` and the test suite.
export function createPrismaClient(): PrismaClient {
  // Keep older generated clients compatible with the schema's local fallback.
  // This also prevents preview startup from requiring an unrelated DATABASE_URL.
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.TURSO_DATABASE_URL ?? "file:./dev.db";
  }

  if (process.env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSQL({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }
  return new PrismaClient();
}
