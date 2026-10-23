import type { NextConfig } from "next";
import path from "node:path";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // pin the tracing root to this repo (silences package-lock-in-parent-dir warning)
  outputFileTracingRoot: path.join(import.meta.dirname, "."),
};

// next-pwa (Workbox) — PWA installability + offline shell (TECH_STACK §1).
// STUB(v2): evaluate Turbopack↔Workbox compatibility each release; webpack build emits sw.js.
export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
