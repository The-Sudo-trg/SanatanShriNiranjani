import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next v16 ships native flat configs — spread them (no FlatCompat needed)
const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
      "public/sw.js",
      "public/workbox-*.js",
      "public/fallback-*.js",
      "om-sanata_shree_nirnjanee.html",
      "scripts/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Approved saint photos are served from their canonical remote URLs (DESIGN §8);
      // plain <img> keeps the build decoupled from the Next image optimizer.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
