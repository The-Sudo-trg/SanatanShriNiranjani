import { defineConfig, devices } from "@playwright/test";

// E2E suite mapping NAVIGATION.md §6 flows F1–F10 and TESTING.md P0 cases.
// Starts its own dev server on :3100 so it never fights a developer's :3000.
export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "**/*.spec.ts",
  globalSetup: "tests/e2e/reset-db.mjs",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false, // shared SQLite → serial correctness (TC-SH-08 style persistence)
  retries: 1,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    locale: "hi-IN",
    timezoneId: "Asia/Kolkata",
    viewport: { width: 375, height: 667 }, // TC-SH-01 viewport
  },
  // Explicit viewport AFTER the device spread — Desktop Chrome's 1280×720 would
  // otherwise override it and run the suite on the desktop tier (TC-SH-02 contract: 375×667).
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 667 } } }],
  webServer: {
    command: "node scripts/next-dev.mjs --webpack --port 3100",
    url: "http://localhost:3100",
    timeout: 180_000,
    reuseExistingServer: false,
  },
});
