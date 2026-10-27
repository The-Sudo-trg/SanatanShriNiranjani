// scripts/db-sync-schema.mjs — idempotent, ADDITIVE schema sync for the hosted
// libSQL/Turso database (ADR-002).
//
// Why this exists: Vercel's runtime filesystem is read-only and `prisma db push`
// cannot target libsql:// directly (the schema's datasource is a local SQLite
// file; production connects through the libSQL driver adapter). The build
// environment *does* receive TURSO_DATABASE_URL/TURSO_AUTH_TOKEN, so we apply the
// additive part of the Prisma schema here, before `next build`.
//
// Safety rules:
//   * only CREATE TABLE / CREATE INDEX / ALTER TABLE ADD COLUMN (never DROP/DELETE);
//   * every statement is guarded by introspection, so re-runs are no-ops;
//   * the only UPDATE writes a timestamp to rows we just created a default for;
//   * failure aborts the build (a broken schema must not be deployed silently).
//
// Local dev/test: pass `--url=file:./prisma/some.db` to exercise it against a
// copied database. `DATABASE_URL=file:./dev.db` is NOT touched by `npm run build`
// (no remote URL configured → the step is skipped).
import { createClient } from "@libsql/client";

const args = process.argv.slice(2);
const explicitUrl = args.find((arg) => arg.startsWith("--url="))?.slice("--url=".length);
const url = explicitUrl ?? process.env.TURSO_DATABASE_URL ?? "";
const authToken = process.env.TURSO_AUTH_TOKEN;

// Textual timestamps in SQLite are integer milliseconds in Prisma; this matches
// `Date.now()` semantics for any backfill we perform.
const NOW_MS = "CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)";

// Exact DDL Prisma generates for the Day-1 additions (kept in sync with
// prisma/schema.prisma; verified by `prisma db push` against the migrated DB).
const CREATE_USER = `CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "sadhuVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;

const CREATE_USER_EMAIL_INDEX = `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`;

const CREATE_ORDER_EVENT = `CREATE TABLE IF NOT EXISTS "OrderEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "note" TEXT,
  "at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`;

const CREATE_FEEDBACK = `CREATE TABLE IF NOT EXISTS "Feedback" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "email" TEXT,
  "message" TEXT NOT NULL,
  "templeSlug" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;

// Tables that gained an optional owner column after the first production deploy.
const ADD_USERID_COLUMNS = [
  ["Booking", "userId"],
  ["GauContribution", "userId"],
  ["Order", "userId"],
];

function quoteIdent(name) {
  return `"${String(name).replaceAll('"', '""')}"`;
}

async function main() {
  if (!url) {
    console.log("[db-sync] no TURSO_DATABASE_URL / --url configured — skipping schema sync (local/CI build).");
    return;
  }

  const isRemote = url.startsWith("libsql://") || url.startsWith("https://") || url.startsWith("http://");
  console.log(`[db-sync] target: ${isRemote ? url.replace(/\/\/[^@/]*@/, "//***@") : url}`);

  const client = createClient({ url, authToken });
  const applied = [];
  const skipped = [];

  const tableExists = async (table) => {
    const res = await client.execute({
      sql: "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
      args: [table],
    });
    return res.rows.length > 0;
  };
  const columnExists = async (table, column) => {
    const res = await client.execute(`PRAGMA table_info(${quoteIdent(table)})`);
    return res.rows.some((row) => row.name === column);
  };
  const run = async (label, sql, argsList = []) => {
    await client.execute({ sql, args: argsList });
    applied.push(label);
  };

  // 1) New tables (User first — the owner columns reference it).
  for (const [table, ddl] of [
    ["User", CREATE_USER],
    ["OrderEvent", CREATE_ORDER_EVENT],
    ["Feedback", CREATE_FEEDBACK],
  ]) {
    if (await tableExists(table)) skipped.push(`table ${table}`);
    else await run(`create table ${table}`, ddl);
  }

  // 2) Unique index on User.email (registration relies on it).
  const indexRes = await client.execute({
    sql: "SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'User_email_key'",
    args: [],
  });
  if (indexRes.rows.length === 0 && (await tableExists("User"))) {
    await run("create index User_email_key", CREATE_USER_EMAIL_INDEX);
  } else {
    skipped.push("index User_email_key");
  }

  // 3) Optional owner columns on existing tables.
  for (const [table, column] of ADD_USERID_COLUMNS) {
    if (!(await tableExists(table))) {
      skipped.push(`table ${table} (absent)`);
      continue;
    }
    if (await columnExists(table, column)) {
      skipped.push(`${table}.${column}`);
      continue;
    }
    await run(
      `add ${table}.${column}`,
      `ALTER TABLE ${quoteIdent(table)} ADD COLUMN ${quoteIdent(column)} TEXT REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
  }

  // 4) Order.updatedAt (added with the same change). SQLite cannot ALTER-ADD a
  // NON-CONSTANT default, so add NOT NULL with a constant, then backfill existing
  // rows with Prisma-compatible epoch milliseconds.
  if (await tableExists("Order")) {
    if (await columnExists("Order", "updatedAt")) {
      skipped.push("Order.updatedAt");
    } else {
      await run(
        "add Order.updatedAt",
        `ALTER TABLE "Order" ADD COLUMN "updatedAt" DATETIME NOT NULL DEFAULT 0`
      );
      await run("backfill Order.updatedAt", `UPDATE "Order" SET "updatedAt" = ${NOW_MS} WHERE "updatedAt" = 0`);
    }
  }

  console.log(`[db-sync] applied ${applied.length} change(s)${applied.length ? ": " + applied.join(", ") : ""}`);
  if (skipped.length) console.log(`[db-sync] already present (skipped): ${skipped.join(", ")}`);

  // Cheap sanity check: every table the Prisma schema needs must now exist.
  const required = [
    "User",
    "OrderEvent",
    "Feedback",
    "Booking",
    "GauContribution",
    "Order",
    "Panchang",
    "Temple",
    "Saint",
  ];
  const missing = [];
  for (const table of required) if (!(await tableExists(table))) missing.push(table);
  if (missing.length) throw new Error(`[db-sync] schema incomplete, missing tables: ${missing.join(", ")}`);

  client.close();
  console.log("[db-sync] schema is up to date.");
}

main().catch((error) => {
  console.error("[db-sync] FAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
});
