import type { NextConfig } from "next";
import path from "node:path";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // pin the tracing root to this repo (silences package-lock-in-parent-dir warning)
  outputFileTracingRoot: path.join(import.meta.dirname, "."),
  // ADR-002 (Turso): adapter-libsql does a dynamic `require.context(".")` over the
  // @libsql/* folder, dragging READMEs into the webpack graph → "Module parse
  // failed". Keep the whole libSQL stack runtime-resolved instead of bundled.
  serverExternalPackages: [
    "@prisma/adapter-libsql",
    "@libsql/client",
    "@libsql/core",
    "@libsql/isomorphic-fetch",
    "@libsql/isomorphic-ws",
  ],
};

// next-pwa (Workbox) — PWA installability + offline shell (TECH_STACK §1).
// STUB(v2): evaluate Turbopack↔Workbox compatibility each release; webpack build emits sw.js.
export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
