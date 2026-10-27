// Vitest global setup — provisions a throwaway SQLite database for the API route
// integration tests, then deletes it. The dev database (prisma/dev.db) is never
// touched: DATABASE_URL is overridden per test with `file:./test.db`, which Prisma
// resolves next to prisma/schema.prisma, i.e. prisma/test.db.
import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const schemaPath = path.join(repoRoot, "prisma", "schema.prisma");
const testDbPath = path.join(repoRoot, "prisma", "test.db");
const prismaCli = path.join(repoRoot, "node_modules", "prisma", "build", "index.js");

function removeTestDb() {
  for (const suffix of ["", "-journal", "-wal", "-shm"]) {
    rmSync(`${testDbPath}${suffix}`, { force: true });
  }
}

export default function setup() {
  removeTestDb();
  try {
    execFileSync(
      process.execPath,
      [prismaCli, "db", "push", "--skip-generate", "--schema", schemaPath],
      {
        cwd: repoRoot,
        env: { ...process.env, DATABASE_URL: "file:./test.db" },
        stdio: "pipe",
      }
    );
  } catch (error) {
    const stderr =
      typeof error === "object" && error !== null && "stderr" in error
        ? String((error as { stderr?: unknown }).stderr)
        : String(error);
    throw new Error(`Failed to provision the test database: ${stderr}`);
  }
  // Teardown: keep the working tree clean after the run.
  return () => removeTestDb();
}
