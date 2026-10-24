# 2026-10-24 — Phase 11: Site transformation (brief: UI/UX v2, temples, daily content, SEO, tests)

## What was built

- **Design system v2** ("Warm Cream / Sacred Saffron", brief Phase 2): new tokens in
  `app/globals.css` (cream #FFF8F2, saffron #FF7722, teal #0F766E, charcoal #1F1B18,
  warmBorder #F0E2D8…). v1 token names kept as aliases so all existing components render.
  Fonts: + Playfair Display (headings), Inter (body); Noto Sans Devanagari retained.
  Documented in DESIGN.md §12; ADR-003 in TECH_STACK.md.
- **Shell v2** (brief Phase 4): app-window removed → normal site flow. New sticky
  `components/site/Header.tsx` (desktop nav: दैनिक दर्शन/मंदिर/पर्व/मंत्र/ज्ञान + search/saved/
  notifications/cart), charcoal `components/site/Footer.tsx` (4 link columns + legal row),
  BottomNav fixed with new tabs (होम/दर्शन/मंदिर/मंत्र/मेनू). Skip-link + :focus-visible
  global. Old shell/Header/DesktopNav removed.
- **Temple directory** (brief Phase 5): 10 verified Delhi NCR temples in
  `lib/data/temple-records.ts` — every record with address, coords, hours (or null →
  "सत्यापित नहीं"), metro, parking, photography rules, source URLs, lastVerified 2026-10-24,
  Commons photos with author/license. Pages: `/temples` (debounced search, category filter,
  name/distance sort with optional geolocation — `lib/geo.ts`), `/temples/[slug]` (SSG ×10,
  JSON-LD TouristAttraction, breadcrumbs, attribution, related temples).
- **Daily content**: `/daily-darshan` (deterministic featured temple + Gita/upanishadic
  wisdom + DB panchang + upcoming festivals), `/mantras` (12 sourced mantras, adjustable
  text size, copy, meaning-vs-tradition separation; audio = documented v2 stub),
  `/festivals` (16 source-verified dates from drikpanchang.com with regional notes).
  Data: `lib/data/{mantras,wisdom,festivals}.ts` + `lib/rotation.ts`.
- **Search & favorites**: `/search` (local index over temples/mantras/festivals/wisdom/pages,
  Debounced, keyboard-navigable, aria-live, highlighted terms — `lib/site-search.ts`),
  `/saved` (localStorage favorites via zustand persist, remove/clear-all).
  FavoriteButton on temples/mantras/festivals/wisdom.
- **Info pages**: `/about`, `/contact`, `/privacy`, `/terms`, `/content-sources`
  (photo licenses, verification principles, correction workflow).
- **SEO**: metadataBase + title template + OG in layout; per-page titles/canonicals;
  `sitemap.xml` (incl. 10 temple URLs), `robots.txt` (disallows /api/, /saved, /search);
  JSON-LD: WebSite+SearchAction (home), TouristAttraction (each temple).
- **Perf/security**: next/image with remotePatterns for upload.wikimedia.org; security
  headers in next.config (CSP, XFO DENY, nosniff, Referrer-Policy, Permissions-Policy).
- **Tests**: +18 unit tests (`tests/unit/content.test.ts` — data provenance, rotation,
  search, geo) → 40/40. New e2e spec `tests/e2e/site.spec.ts` (directory, favorites,
  darshan, mantras, festivals, search, legal, sitemap/robots). flows.spec.ts TC-SH-02
  updated to new tab set.
- **Ops**: CI workflow `.github/workflows/ci.yml` (lint→unit→build→e2e→audit);
  k6 load-test config `tests/load/k6-load-test.js` (ramp 200→1k→5k→10k→12k→0, traffic mix,
  thresholds) — staging-only, documented.

## Gates
- `npm run lint` clean; `npm run test` 40/40; `npm run build` green (temples SSG ×10).
- E2E run pending browser install fix (playwright chromium reinstalled).

## Known issues / follow-ups
- next-pwa → workbox chain: 8 high npm-audit findings (build-time tooling, unmaintained
  package). Recommend migrating to Serwist (needs ADR).
- /api/bookings GET is unauthenticated and returns names/phones (anonymous app by design)
  — needs auth or field minimization before real use.
- CSP uses 'unsafe-inline'/'unsafe-eval' (Next.js + Workbox requirement) — tighten via
  nonces if migrating off next-pwa.
