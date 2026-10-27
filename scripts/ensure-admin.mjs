// scripts/ensure-admin.mjs — opt-in production ADMIN bootstrap for the hosted
// libSQL/Turso database.
//
// Why: `npm run db:seed` only runs locally; the hosted DB may have no ADMIN (or a
// user-registered account on the admin e-mail that was never promoted). This
// script resolves that without needing Turso credentials on a developer machine:
// Vercel's build environment already has them.
//
// It is SAFE BY DEFAULT — it does nothing unless explicitly enabled:
//
//   ENSURE_ADMIN=1 \
//   SEED_ADMIN_EMAIL="admin@niranjani.local" \
//   SEED_ADMIN_PASSWORD="<a strong password>" \
//   ENSURE_ADMIN_RESET_PASSWORD=1   # only for the first bootstrap / password rotation
//
// Behaviour:
//   * no user with SEED_ADMIN_EMAIL → create it as ADMIN (scrypt hash, same format
//     as lib/auth.ts: scrypt$N$r$p$salt$hash);
//   * existing user → promote to ADMIN + sadhuVerified; password is reset ONLY when
//     ENSURE_ADMIN_RESET_PASSWORD=1 (never silently);
//   * the plaintext password is never logged or stored.
//
// Manual usage against a local copy / with credentials in the shell:
//   node scripts/ensure-admin.mjs --url=file:./prisma/dev.db --email=… --password=… [--reset-password]
import { randomBytes, randomUUID, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

import { createClient } from "@libsql/client";

const scrypt = promisify(scryptCallback);
const args = process.argv.slice(2);
const argOf = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const hasFlag = (name) => args.includes(`--${name}`);

const url = argOf("url") ?? process.env.TURSO_DATABASE_URL ?? "";
const authToken = process.env.TURSO_AUTH_TOKEN;
const email = (argOf("email") ?? process.env.SEED_ADMIN_EMAIL ?? "admin@niranjani.local").trim().toLowerCase();
const password = argOf("password") ?? process.env.SEED_ADMIN_PASSWORD ?? "";
const enabled = argOf("url") !== undefined || hasFlag("force") || process.env.ENSURE_ADMIN === "1";
const resetPassword = hasFlag("reset-password") || process.env.ENSURE_ADMIN_RESET_PASSWORD === "1";

// Same scrypt parameters + encoding as lib/auth.ts (N=2^17, r=8, p=1, keylen 64).
async function hashPassword(plain) {
  const salt = randomBytes(16);
  const derived = await scrypt(plain.normalize("NFC"), salt, 64, {
    N: 2 ** 17,
    r: 8,
    p: 1,
    maxmem: 256 * 1024 * 1024,
  });
  return ["scrypt", 2 ** 17, 8, 1, salt.toString("hex"), derived.toString("hex")].join("$");
}

async function main() {
  if (!url) {
    console.log("[ensure-admin] no TURSO_DATABASE_URL / --url — skipping (local/CI build).");
    return;
  }
  if (!enabled) {
    console.log("[ensure-admin] ENSURE_ADMIN is not set — skipping (opt-in only).");
    return;
  }
  if (password.length < 8) {
    throw new Error("[ensure-admin] SEED_ADMIN_PASSWORD must be set (min 8 chars) when ENSURE_ADMIN=1");
  }

  console.log(`[ensure-admin] target: ${url.replace(/\/\/[^@/]*@/, "//***@")} email=${email}`);

  const client = createClient({ url, authToken });
  const existing = await client.execute({
    sql: 'SELECT id, role FROM "User" WHERE "email" = ? LIMIT 1',
    args: [email],
  });

  if (existing.rows.length === 0) {
    const passwordHash = await hashPassword(password);
    await client.execute({
      sql: `INSERT INTO "User" ("id","name","email","phone","passwordHash","role","sadhuVerified","createdAt")
            VALUES (?, ?, ?, NULL, ?, 'ADMIN', true, CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER))`,
      args: [randomUUID(), "प्रबंधक (ADMIN)", email, passwordHash],
    });
    console.log(`[ensure-admin] created ADMIN account for ${email}.`);
  } else {
    const id = existing.rows[0].id;
    if (resetPassword) {
      const passwordHash = await hashPassword(password);
      await client.execute({
        sql: `UPDATE "User" SET "role"='ADMIN', "sadhuVerified"=true, "passwordHash"=? WHERE "id"=?`,
        args: [passwordHash, id],
      });
      console.log(`[ensure-admin] promoted ${email} to ADMIN and reset the password from env.`);
    } else {
      await client.execute({
        sql: `UPDATE "User" SET "role"='ADMIN', "sadhuVerified"=true WHERE "id"=?`,
        args: [id],
      });
      console.log(
        `[ensure-admin] promoted ${email} to ADMIN (password unchanged — set ENSURE_ADMIN_RESET_PASSWORD=1 to reset it).`
      );
    }
  }

  client.close();
}

main().catch((error) => {
  console.error("[ensure-admin] FAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
});
