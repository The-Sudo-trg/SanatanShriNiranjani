// Capture review screenshots of key pages at mobile (375) + desktop (1440).
// Usage: node scripts/screenshot-pages.mjs [baseUrl]
// Screenshots land in shots/ (git-ignored).
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:3000";
mkdirSync("shots", { recursive: true });

const PAGES = [
  ["home", "/"],
  ["darshan", "/daily-darshan"],
  ["temples", "/temples"],
  ["temple-detail", "/temples/kalkaji-mandir-new-delhi"],
  ["festivals", "/festivals"],
  ["mantras", "/mantras"],
  ["search", "/search"],
  ["saved", "/saved"],
  ["sources", "/content-sources"],
];

const browser = await chromium.launch();
for (const [width, height, tag] of [
  [375, 812, "mobile"],
  [1440, 900, "desktop"],
]) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    locale: "hi-IN",
    timezoneId: "Asia/Kolkata",
  });
  const page = await ctx.newPage();
  for (const [name, path] of PAGES) {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `shots/${name}-${tag}.png`, fullPage: true });
    console.log(`shots/${name}-${tag}.png`);
  }
  await ctx.close();
}
await browser.close();
