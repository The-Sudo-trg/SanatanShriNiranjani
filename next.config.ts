import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

// next-pwa (Workbox) — PWA installability + offline shell (TECH_STACK §1).
// STUB(v2): evaluate Turbopack↔Workbox compatibility each release; webpack build emits sw.js.
export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
