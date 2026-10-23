import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
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
      "public/sw.js*",
      "public/workbox-*.js",
      "om-sanata_shree_nirnjanee.html",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Approved saint photos are served from their canonical remote URLs (DESIGN §8);
      // plain <img> keeps the build decoupled from the Next image optimizer.
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
