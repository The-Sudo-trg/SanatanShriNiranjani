import { defineConfig } from "vitest/config";
import path from "path";

// Unit tests run against an isolated throwaway database (prisma/test.db) created
// by the global setup — never the dev database. AUTH_SECRET is supplied so JWT
// signing does not fall back to the development secret.
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.ts"],
    globalSetup: ["tests/unit/setup/global-setup.ts"],
    env: {
      DATABASE_URL: "file:./test.db",
      AUTH_SECRET: "vitest-only-auth-secret-0123456789abcdef",
    },
    // The auth route tests share one SQLite file; keep files serial for determinism.
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
