# Hotfix — production 500s caused by DB schema drift (2026-10-27, evening)

## Incident

Production (https://sanatanshriniranjani.vercel.app) after the Day-2 deploy:

| Route | Result |
|---|---|
| `/` `/temples` `/store` `/menu` `/daily-darshan` `/jigyasu` | 200 |
| **`/gau-seva`** | **500 “A server error occurred”** |
| **`/bookings`** | **500** |
| **`/api/gau-seva`**, **`/api/bookings`** | **500** |
| **`/api/auth/register`** (valid body) | **500** `पंजीकरण में त्रुटि…` |

## Root cause

**Production database schema drift — not an application bug.**

- Day 1 changed `prisma/schema.prisma`: new `User`, `OrderEvent`, `Feedback` tables;
  `Booking.userId`, `GauContribution.userId`, `Order.userId` + `Order.updatedAt`.
- Those changes were applied to the **local SQLite dev DB** (`prisma db push`) and the
  code/e2e/unit tests all ran against that up-to-date DB — but they were **never applied to
  the hosted Turso database** used by Vercel.
- The Day-2 deploy went out automatically, so production Prisma queried tables/columns that
  do not exist: `no such table: User` / `no such column: GauContribution.userId` → 500.
  Routes whose models were unchanged kept working (home, temples, store, menu, forum).

## Fix — build-time additive schema sync

The Vercel **build environment** receives `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`, but
`prisma db push` cannot target `libsql://` directly (the schema datasource is the local file;
production connects via the libSQL driver adapter). So:

- New `scripts/db-sync-schema.mjs`:
  - connects with `@libsql/client` (already a dependency);
  - introspects `sqlite_master` / `PRAGMA table_info` and applies only what is missing:
    `CREATE TABLE IF NOT EXISTS "User"/"OrderEvent"/"Feedback"`, unique index
    `User_email_key`, `ALTER TABLE … ADD COLUMN userId` (+ FK) on Booking/GauContribution/Order,
    `Order.updatedAt`;
  - never drops anything; the only UPDATE backfills `Order.updatedAt` for pre-existing rows
    with Prisma-compatible epoch milliseconds;
  - idempotent (second run applies 0 changes);
  - **fails the build** if the schema cannot be completed, so a broken schema can never deploy
    silently; skips entirely when no Turso URL is configured (local dev / GitHub CI).
- `package.json`: `build` now runs `prisma-generate → db-sync-schema → next-build`; added
  `npm run db:sync` for manual runs.
- `.env.example` documents the Turso variables and the build-time sync.

## Verification (against an old-schema DB, not production)

- Cloned the **pre-Day-1 schema** (`git show 06aa66f:prisma/schema.prisma`) into a scratch DB
  with existing rows in `Order`, `Booking`, `GauContribution`.
- `node scripts/db-sync-schema.mjs --url=file:…` → applied 9 changes; **existing rows intact**,
  `updatedAt` backfilled as integer ms; second run → 0 changes (idempotent).
- Prisma runtime against the migrated DB: `user.create/findUnique`, `feedback.create`,
  `booking.findMany`, `gauContribution.findMany`, `order.findMany` (updatedAt returned as a
  Date), `orderEvent.create` with FK → all OK.
- `npx prisma db push --schema prisma/schema.prisma` against the migrated DB →
  “Your database is now in sync with your Prisma schema” ✅ (the manual DDL matches Prisma’s).
- Scratch files removed; `prisma/dev.db` untouched.

## Prevention / runbook

- Any future `schema.prisma` change must be mirrored by an additive migration step in
  `scripts/db-sync-schema.mjs` (or a proper migration tool once Turso credentials are handled
  outside Vercel). The build now enforces the production schema before deploying.
- Local `npm run build` (no Turso env) skips the sync; GitHub CI uses a fresh file DB.
- Non-additive changes (rename/drop/type change) need an explicit migration + backup step —
  never add them silently to the sync script.

## Follow-ups

- `Order.updatedAt` is added with a constant default (`0`) because SQLite cannot `ALTER ADD`
  a `CURRENT_TIMESTAMP` default; Prisma always supplies the value on insert, existing rows are
  backfilled, and `prisma db push` accepts the result as in sync.
- Consider a `/api/health` endpoint that checks schema presence so drift is caught by uptime
  monitoring instead of user reports.
