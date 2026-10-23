// Cross-platform `prisma generate` wrapper.
//
// Windows / macOS: plain `prisma generate` runs natively and exits 0.
// WSL2 on /mnt (drvfs): node's copyFile(&range) fails EPERM *inside* the mount, so
// Prisma cannot copy the query engine into .prisma/client. Empirically the CLI
// still writes all generated TS/JS BEFORE the failing engine copy — so the shim:
//   1) runs plain `prisma generate` (library engine client — required for
//      build-time prerendering against SQLite, NOT PRISMA_GENERATE_NO_ENGINE),
//   2) on EPERM-copy failure: stream-copies the engine (read/write — bypasses
//      copy_file_range) and verifies the generated client exists, then exits 0.
// The runtime client resolves the engine next to its own directory.
import { spawnSync } from "node:child_process";
import { createReadStream, createWriteStream, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";

const ENGINE_TARGET = join("node_modules", ".prisma", "client", "libquery_engine-debian-openssl-3.0.x.so.node");
const CLIENT_DIR = join("node_modules", ".prisma", "client");

const statMtime = (p) => {
  try {
    return statSync(p).mtimeMs;
  } catch {
    return -1;
  }
};

const run = (cmd, args) =>
  spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });

function streamCopy(src, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  return pipeline(createReadStream(src), createWriteStream(dest));
}

async function placeEngine() {
  if (existsSync(ENGINE_TARGET)) return;
  const candidates = [
    join("node_modules", "prisma", "libquery_engine-debian-openssl-3.0.x.so.node"),
    join("node_modules", "@prisma", "engines", "libquery_engine-debian-openssl-3.0.x.so.node"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) {
      await streamCopy(c, ENGINE_TARGET);
      return;
    }
  }
}

let result = run("npx", ["prisma", "generate"]);
if (result.status !== 0) {
  // EPERM engine-copy failure leaves generated files intact — recover instead of failing.
  const schemaMtime = statMtime(join("prisma", "schema.prisma"));
  const clientGenerated =
    existsSync(join(CLIENT_DIR, "index.js")) &&
    existsSync(join(CLIENT_DIR, "index.d.ts")) &&
    statMtime(join(CLIENT_DIR, "index.js")) >= schemaMtime;
  if (clientGenerated) {
    console.warn(
      "\n[prisma-generate] engine copy failed (WSL2/drvfs EPERM) — generated client is fresh; placing engine via stream copy…",
    );
    await placeEngine();
    if (existsSync(ENGINE_TARGET)) process.exit(0);
  }
  process.exit(result.status ?? 1);
}
