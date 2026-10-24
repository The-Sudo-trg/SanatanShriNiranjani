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
  // Temple photos are sourced from Wikimedia Commons (verified licenses — see
  // lib/data/temple-records.ts and /content-sources). Optimize them at the edge.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  // Security headers (brief Phase 12). CSP allows Next's inline bootstrap
  // ('unsafe-inline'/'unsafe-eval' — Next.js hydration + Workbox SW); no
  // third-party scripts are used, so script sources stay tight.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(self), camera=(), microphone=(), payment=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://upload.wikimedia.org",
              "font-src 'self' data:",
              "connect-src 'self' https://upload.wikimedia.org",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

// next-pwa (Workbox) — PWA installability + offline shell (TECH_STACK §1).
// STUB(v2): evaluate Turbopack↔Workbox compatibility each release; webpack build emits sw.js.
export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
