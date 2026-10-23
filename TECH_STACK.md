# TECH_STACK.md — सनातन श्री निरंजनी Master App

> Status: **LOCKED**. Any change to this file requires a new ADR note at the bottom and approval from the repo owner (`The-Sudo-trg`).

## 1. Decision Summary

| Layer | Technology | Version (min) | Why |
|---|---|---|---|
| Framework | **Next.js (App Router)** | 16 | One codebase for UI + API routes + server actions; PWA-ready; best AI-agent codegen support |
| Language | **TypeScript (strict)** | 5.x | Catches bugs at compile time; self-documenting for agents |
| Styling | **Tailwind CSS** | 4.x | Utility-first matches the prototype's Tailwind classes; tokens via CSS variables |
| UI kit | **shadcn/ui + Radix primitives** | latest | Accessible modals, tabs, dialogs out of the box — restyled to divine theme |
| Icons | **lucide-react** | latest | Consistent, respectful line icons; `ॐ` glyph used only as religious symbol |
| DB & ORM | **SQLite + Prisma ORM** | 6.x | Zero-ops local persistence, typed queries, easy migration to Postgres later |
| AI | **z-ai-web-dev-sdk** | latest | Chat completions for AI जिज्ञासा assistant, server-side only |
| Forms & validation | **react-hook-form + zod** | latest | Booking forms need robust Hindi-label validation |
| State (light) | **Zustand** | 5.x | Cart, jap mala counter, modal registry — no Redux ceremony |
| PWA | **next-pwa (Workbox)** | latest | Installable on phone, offline shell for ग्रंथ & जप माला |
| Audio | **HTML5 Audio + custom hook** | native | Satsang/bhajan player, no heavy library |
| QR (placeholder) | **qrcode.react** | latest | Digital Bhakt ID cards |
| Dates / Panchang | **seeded static data** (v1) | — | Real ephemeris (e.g. astronomical libs) is v2 scope |
| Testing | **Vitest + React Testing Library + Playwright** | latest | Unit + component + E2E mapped to TESTING.md |
| Lint / format | **ESLint + Prettier** | latest | Enforced in pre-commit |
| Hosting | **Vercel** (free tier) | — | Zero-config Next.js deploy, preview URLs per PR |

## 2. Explicitly Rejected (and why)

| Option | Reason rejected |
|---|---|
| Plain HTML + CDN JS (current prototype) | No persistence, no type safety, unmaintainable at 9 modules |
| React Native / Expo | Two codebases (web+mobile), slower MVP; PWA covers mobile first |
| Flutter | Same as above; Dart less agent-friendly |
| MongoDB | No relational integrity for bookings/orders/users |
| Firebase-only | Vendor lock on auth+DB; harder local dev for agents |
| Real payment gateway in v1 | Regulatory + trust risk; mock until akhada trust account is KYC-ready |

## 3. Folder Structure (canonical — agents MUST follow)

```
Om_sanatan_nirnjan/
├── app/
│   ├── layout.tsx                # root: fonts, providers, PWA meta
│   ├── page.tsx                  # → होम (tab-home)
│   ├── gau-seva/page.tsx         # → गौ सेवा एवं प्रकृति कल्याण
│   ├── granth/page.tsx           # → ग्रंथालय + जप माला
│   ├── jigyasu/page.tsx          # → सत्संग मंच + AI सहायक
│   ├── menu/page.tsx             # → मेनू / profile / digital ID
│   ├── store/page.tsx            # → पूजा स्टोर
│   ├── kumbh-2027/page.tsx       # → महाकुंभ नेविगेटर
│   ├── bookings/page.tsx         # → मेरी बुकिंग (user's list)
│   ├── api/
│   │   ├── panchang/route.ts     # GET today's panchang
│   │   ├── bookings/route.ts     # POST create, GET list
│   │   ├── gau-seva/route.ts     # POST tree/fodder contribution
│   │   ├── mala/route.ts         # GET/POST jap count
│   │   ├── forum/route.ts        # GET questions, POST question
│   │   ├── chat/route.ts         # POST → z-ai-web-dev-sdk (AI जिज्ञासा)
│   │   ├── cart/route.ts         # GET/POST/DELETE cart lines
│   │   ├── orders/route.ts       # POST checkout (mock pay)
│   │   └── volunteers/route.ts   # POST registration
│   └── globals.css               # DESIGN.md tokens as CSS vars
├── components/
│   ├── shell/                    # Header, BottomNav, SearchBar, ModalRoot
│   ├── home/                     # PanchangBanner, FeatureGrid, SuvicharStrip...
│   ├── gau/                      # TreePlantationForm, CharaSevaCard, LiveCam
│   ├── granth/                   # JapMala, GitaReader
│   ├── jigyasu/                  # ForumFeed, AskForm, AiChat
│   ├── menu/                     # DigitalId, AkharaDirectory, VolunteerForm
│   ├── store/                    # ProductCard, CartSheet, CheckoutButton
│   └── ui/                       # shadcn components (button, dialog, input...)
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── ai.ts                     # z-ai-web-dev-sdk wrapper + system prompt
│   ├── validators.ts             # zod schemas (booking, gau, volunteer, order)
│   └── constants.ts              # sacred prices, tree types, kumbh dates
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                   # panchang sample, gita chapters, saints, products
├── stores/                       # zustand stores (cart.ts, mala.ts, modals.ts)
├── public/
│   ├── manifest.json             # PWA: name, theme #FF6700, icons
│   └── icons/                    # 192/512 png (ॐ on saffron)
├── tests/
│   ├── unit/  ├── components/  └── e2e/
├── docs (this set) + AGENT.md + README.md
└── om-sanata_shree_nirnjanee.html  # visual reference (do NOT import into build)
```

## 4. NPM Dependencies

```bash
# core
npx create-next-app@latest . --ts --tailwind --app --eslint --src-dir=false
npm i @prisma/client zustand zod react-hook-form @hookform/resolvers lucide-react qrcode.react
npm i -D prisma vitest @testing-library/react @testing-library/jest-dom jsdom
npm i -D @playwright/test prettier eslint-config-prettier
npm i z-ai-web-dev-sdk
# shadcn/ui
npx shadcn@latest init -d
npx shadcn@latest add button card dialog input select tabs badge sheet sonner avatar
```

## 5. Environment Variables (`.env.example`)

```env
# Database
DATABASE_URL="file:./dev.db"

# AI (server-side only, never exposed to client)
# z-ai-web-dev-sdk reads its own auth config; do not commit real keys.

# App
NEXT_PUBLIC_APP_NAME="सनातन श्री निरंजनी"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Payments (v2 — keep mocked in v1)
# RAZORPAY_KEY_ID=""
# RAZORPAY_KEY_SECRET=""
```

## 6. Scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "format": "prettier --write ."
  }
}
```

## 7. Data Migration Path (v1 → v2)

1. v1 ships SQLite (`file:./dev.db`) — perfect for single-server Vercel-free deploys or a small VPS.
2. When traffic grows: change datasource provider to `postgresql`, update `DATABASE_URL`, run `prisma db push` — **schema in PRD.md is written to be provider-agnostic** (no SQLite-specific types).
3. When real payments unlock: add `razorpay` npm package, create `api/payments/verify` webhook; order flow in PRD §7 already models `status: PENDING→PAID`.
4. When live streams go real: replace `LiveDarshanPlayer` placeholder with YouTube Live embed or RTSP→HLS relay; component API stays identical.

## 8. Performance & Quality Budgets

| Metric | Budget |
|---|---|
| Lighthouse mobile (Performance / A11y / Best Practices / SEO) | ≥ 90 / 90 / 95 / 90 |
| First Load JS per route | ≤ 200 KB gzipped |
| Cold dev boot to interactive | ≤ 5 s |
| TypeScript | `strict: true`, zero errors |
| ESLint | zero errors, zero warnings on `main` |
| Devanagari rendering | zero tofu (□) glyphs — verified in TESTING.md §8 |
