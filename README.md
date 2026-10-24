# ॐ Om_sanatan_nirnjan — सनातन श्री निरंजनी Master App

> **श्री पंचायती अखाड़ा निरंजनी** — सनातन धर्म का डिजिटल द्वार
> Official digital master app: live darshan, गौ सेवा, digital granth & jap mala, AI जिज्ञासा, puja bookings, पूजा स्टोर, saint directory with QR-verified IDs, and the महाकुंभ 2027 navigator.

![status](https://img.shields.io/badge/status-documentation%20v1.0-FF6700) ![stack](https://img.shields.io/badge/stack-Next.js%2016%20%2B%20TypeScript%20%2B%20Prisma-4A1500) ![ui](https://img.shields.io/badge/language-%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80-FFD700)

## 📂 Documentation Set (build contract)

| File | Purpose |
|---|---|
| [`MASTER_PROMPT.md`](./MASTER_PROMPT.md) | Copy-paste prompt that builds the entire app from scratch, phase by phase |
| [`TECH_STACK.md`](./TECH_STACK.md) | Locked technologies, folder structure, dependencies, env vars |
| [`PRD.md`](./PRD.md) | Full product requirements: 9 modules, user stories, data model, API contract |
| [`DESIGN.md`](./DESIGN.md) | "Divine Saffron" design system: tokens, components, accessibility |
| [`NAVIGATION.md`](./NAVIGATION.md) | 5 tabs, 8 pages, 13 modals, keyword search routing, 10 user flows |
| [`TESTING.md`](./TESTING.md) | 60+ test cases (P0/P1/P2), bug report template, debug playbook |
| [`AGENT.md`](./AGENT.md) | Operating rules for AI coding agents working in this repo |
| [`om-sanata_shree_nirnjanee.html`](./om-sanata_shree_nirnjanee.html) | Original visual prototype (reference only, not part of the build) |

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
npm run db:push && npm run db:seed
npm run dev        # http://localhost:3000
```

Production: `npm run build && npm start` — deploy target: Vercel (see TECH_STACK.md §7).

### Verify the whole contract

```bash
npm run lint       # ESLint — zero errors
npm run test       # Vitest unit suite (22 tests)
npm run test:e2e   # Playwright flows F1–F10 (spawns its own dev server on :3100)
```

### Platform note — WSL2 / `/mnt` (drvfs) users

node's `fs.copyFile` (copy_file_range(2)) fails with EPERM *inside* a Windows mount.
This repo ships three small shims so every npm script works on both native and WSL
environments:

- `scripts/prisma-generate.mjs` — `prisma generate` wrapper; retries and places the
  query engine via stream copy when the drvfs copy fails.
- `scripts/next-build.mjs` / `scripts/next-dev.mjs` — Dev/build wrappers that preload
  `scripts/copyfile-patch.cjs` (NODE_OPTIONS) so Next.js artifact copies fall back
  transparently to read/write streaming on EPERM. On Windows/macOS the patch is inert.

No behavior on native platforms changes; no extra dependencies were added.

## 🛠️ Build Workflow (recommended)

1. Push this documentation set to GitHub first (commands below).
2. Open your AI coding agent (Claude Code / Cursor / Windsurf) inside the repo.
3. Paste the prompt from `MASTER_PROMPT.md` → it builds Phase 0–10 in order.
4. After each phase, verify the matching `TESTING.md` section.
5. Resume later with the one-line resume prompt at the bottom of `MASTER_PROMPT.md`.

## 📦 Push This Documentation to GitHub

```bash
git init
git add README.md MASTER_PROMPT.md TECH_STACK.md PRD.md DESIGN.md NAVIGATION.md TESTING.md AGENT.md om-sanata_shree_nirnjanee.html
git commit -m "docs: complete build contract (master prompt, PRD, design, navigation, testing, agent rules)"
git branch -M main
git remote add origin https://github.com/The-Sudo-trg/Om_sanatan_nirnjan.git
git push -u origin main
```

(If you already ran `echo "# Om_sanatan_nirnjan" >> README.md`, delete that file first or merge its contents — this README replaces it.)

## 🧭 App at a Glance

| Tab | Module highlights |
|---|---|
| होम | Panchang banner, suvichar, 6-feature grid, Golden Baba card, satsang player |
| गौ-सेवा | लाइव गौ-दर्शन, स्मृति वृक्षारोपण (₹501), चारा सेवा (₹510/₹2100) |
| ग्रंथ | डिजिटल जप माला (persistent counter), श्रीमद्भगवद्गीता reader |
| जिज्ञासा | Community Q&A + AI आध्यात्मिक सहायक (Hindi, guru-guardrailed) |
| मेनू | Digital Bhakt ID (QR), अखाड़ा directory + स्मृति खंड, volunteer pass |

## 🤝 Contribution

- AI agents: read `AGENT.md` first — it is binding.
- Humans: keep Hindi tone respectful, prices exact, and run `TESTING.md` sections before PRs.

## 📜 License & Content Note

Code: MIT (c) 2026 The-Sudo-trg. Religious content, saint names, and imagery belong to श्री पंचायती अखाड़ा निरंजनी and are used with devotional intent; memorial content (स्मृति खंड) must always remain solemn.

---

## v2 Site (2026-10-24) — transformation brief

New public surface alongside the akhada app (see `worklog/2026-10-24-phase-11-site-transformation.md`, TECH_STACK.md ADR-003/004):

- **मंदिर सूची** `/temples` — 10 verified Delhi NCR temples (sources + last-verified dates, Commons photos), optional distance sorting.
- **दैनिक दर्शन** `/daily-darshan` — daily featured temple + dated Gita/upanishadic wisdom + panchang (DB-seeded only) + upcoming festivals.
- **मंत्र** `/mantras` — 12 sourced mantras (Devanagari, transliteration, meaning, adjustable text size, copy).
- **पर्व** `/festivals` — drikpanchang.com-verified dates with regional notes and per-entry source links.
- **खोज** `/search`, **सेव किया हुआ** `/saved` (localStorage-only favorites), `/about`, `/contact`, `/privacy`, `/terms`, `/content-sources`.

Extra commands:

```bash
npm run test:e2e          # Playwright: flows.spec.ts (F1–F10) + site.spec.ts (new IA)
npx playwright install chromium   # once per machine
k6 run tests/load/k6-load-test.js # load test — LOCAL/STAGING ONLY, never production
```

CI: `.github/workflows/ci.yml` (lint → unit → build → e2e → npm audit). Security headers + CSP in `next.config.ts`.
