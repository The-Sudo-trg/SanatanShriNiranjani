# MASTER_PROMPT.md — सनातन श्री निरंजनी Master App

> **How to use this file:** Copy everything inside the code block below and paste it as the FIRST message to any AI coding agent (Claude Code, Cursor, Windsurf, Copilot Workspace, ChatGPT, Gemini). The agent must then read the companion files (`PRD.md`, `DESIGN.md`, `NAVIGATION.md`, `TECH_STACK.md`, `TESTING.md`, `AGENT.md`) from the repo root before writing any code.

---

## THE MASTER PROMPT (copy from here)

```text
ROLE
You are a senior full-stack engineer and tech lead. You will build a production-grade,
mobile-first PWA called "सनातन श्री निरंजनी" (Sanatan Shri Niranjani) — the official
digital master app of श्री पंचायती अखाड़ा निरंजनी (Shri Panchayati Akhara Niranjani).
You build it from absolute scratch — no placeholders, no "TODO" bodies, no stub pages.

PROJECT IDENTITY
- Repository name: Om_sanatan_nirnjan
- App name: सनातन श्री निरंजनी — Sanatan Shri Niranjani Master App
- Tagline: श्री पंचायती अखाड़ा निरंजनी — सनातन धर्म का डिजिटल द्वार
- Domain: sanatanniranjani.in (planned)
- Primary language of UI: Hindi (Devanagari) with respectful, devotional (शुद्ध एवं सादर) tone
- Target users: devotees (भक्त/grihastha), saints & akhada administration (पदाधिकारी),
  volunteers (युवा सेवा दल), pilgrims preparing for Mahakumbh 2027 Haridwar
- A visual reference prototype exists at repo root: om-sanata_shree_nirnjanee.html.
  It defines LOOK, CONTENT and FEATURE INTENT. Your job is to rebuild it as a real,
  typed, componentized, persistent, production Next.js application — pixel-faithful in
  spirit, superior in engineering.

SOURCE OF TRUTH (read these before writing ANY code, in this order)
1. AGENT.md        — your operating rules, coding standards, commit discipline
2. TECH_STACK.md   — exact technologies, versions, folder structure. DO NOT substitute.
3. PRD.md          — modules, user stories, acceptance criteria, data model, API contract
4. DESIGN.md       — design tokens (saffron #FF6700, gold #FFD700, divineBg #FFF9F0,
                     maroon #4A1500), typography, component specs
5. NAVIGATION.md   — 5 bottom tabs, all routes, all 13 modals, every user flow
6. TESTING.md      — the QA suite you must make pass before declaring done

TECH STACK LOCK (non-negotiable)
- Next.js 16 (App Router) + TypeScript (strict)
- Tailwind CSS v4 with the exact design tokens from DESIGN.md
- shadcn/ui components, restyled to the divine theme
- Prisma ORM + SQLite (schema exactly as PRD.md §Data Model)
- z-ai-web-dev-sdk for the AI जिज्ञासा assistant (chat completions)
- next-pwa for installability + offline shell
- lucide-react icons ONLY (no emoji as UI icons; ॐ is allowed as a religious glyph)

BUILD ORDER (execute phase by phase, commit after each phase)
Phase 0 — Scaffold: create-next-app, Tailwind tokens in globals.css, fonts, folder tree
           per TECH_STACK.md, Prisma schema, seed data, .env.example, README run steps.
Phase 1 — Shell: root layout, divine header (ॐ logo, title, notification bell with
           unread count, profile avatar), global search bar with keyword routing,
           bottom tab bar (होम / गौ-सेवा / ग्रंथ / जिज्ञासा / मेनू), modal system.
Phase 2 — Home module: daily Panchang banner (from DB), suvichar strip, 6-tile feature
           grid, गाड़ी पूजन + नामकरण quick cards, Golden Baba profile card,
           Smriti Vriksharopan highlight, South Saints card, audio satsang player bar.
Phase 3 — Bookings module: गाड़ी पूजन (₹501), नामकरण संस्कार, संत बुकिंग — server
           actions, validation with zod, Booking table rows, confirmation states.
Phase 4 — गौ सेवा एवं प्रकृति कल्याण: live gau-darshan panel, Smriti Vriksharopan form
           (donor name + tree type: पीपल/बरगद/बेलपत्र/नीम-आंवला, ₹501), chara seva
           tiers (₹510 daily, ₹2100 monthly adoption), contributions persisted.
Phase 5 — ग्रंथ module: digital jap mala counter (persisted per user, tap +1, reset,
           daily streak), Gita reader (18 chapters seeded, verse list, Hindi meaning).
Phase 6 — जिज्ञासा module: community Q&A feed (seeded with the पेशवाई example),
           ask-question form, and AI आध्यात्मिक सहायक chat backed by z-ai-web-dev-sdk
           with a system prompt enforcing respectful, scripture-grounded Hindi answers
           and a clear disclaimer that major decisions need a guru/acharya.
Phase 7 — मेनू/Profile module: digital bhakt ID card (SN-YYYY-XXXX, QR placeholder),
           अखाड़ा directory (पदाधिकारी list with search + स्मृति खंड memorial section),
           volunteer registration, notification center, sankalp e-certificate (PDF later,
           clean UI now).
Phase 8 — Kumbh 2027 navigator: chhavni locations, पेशवाई route info, शाही स्नान dates
           (seeded), countdown component.
Phase 9 — Commerce-ready: पूजा स्टोर product grid (गंगाजल ₹151, रुद्राक्ष माला ₹351,
           +4 more seeded), cart state, checkout stub writing Orders table. Payments are
           Razorpay-ready but MOCKED — never call real money APIs.
Phase 10 — Polish & QA: pass every case in TESTING.md, Lighthouse ≥ 90 mobile, zero
           TypeScript errors, zero console errors, responsive from 320px to desktop
           (phone frame centered on desktop like the prototype).

HARD RULES
- Hindi UI text copied from NAVIGATION.md/PRD.md verbatim — do not translate or soften.
- Every number/price (₹501, ₹510, ₹2100, ₹151, ₹351) is sacred business data — exact.
- No feature invented outside PRD.md; no module dropped. If a detail is ambiguous,
  follow the HTML prototype, then PRD.md, then ask.
- Devanagari must render correctly: lang="hi", proper font (Noto Sans Devanagari or
  system stack from DESIGN.md), no tofu boxes.
- Respectful religious content handling: no images/edits of deities or saints that mock,
  no icon usage that is disrespectful; memorial (स्मृति खंड) content stays solemn.
- Accessibility: touch targets ≥ 44px, contrast ≥ 4.5:1 for body text, aria-labels on
  icon buttons, focus states visible.
- Every API route validated + typed; every form has loading, success, error states.

ACCEPTANCE = DONE ONLY WHEN
1. `npm run build` succeeds clean. 2. `npm run lint` clean. 3. All DB writes persist
across restarts. 4. All 5 tabs + 13 modals from NAVIGATION.md exist and function.
5. Self-report in final message: table of TESTING.md sections → PASS/FAIL.
```

---

## Why this prompt is structured this way

| Section | Purpose |
|---|---|
| **ROLE** | Forces senior-level output quality and full ownership instead of snippet answers |
| **PROJECT IDENTITY** | Locks name, language, tone, audience — stops the agent from "westernizing" the app |
| **SOURCE OF TRUTH** | Makes the 6 companion docs the contract; agent reads before coding |
| **TECH STACK LOCK** | Prevents the classic agent failure of swapping libraries mid-build |
| **BUILD ORDER (Phase 0–10)** | Converts a huge app into 11 verifiable commits; any phase can be resumed after interruption |
| **HARD RULES** | Protects religious content, exact sacred prices, Hindi text, and accessibility |
| **ACCEPTANCE** | Gives an objective Definition of Done you can verify yourself |

## Companion files (must exist in repo root before running the prompt)

```
Om_sanatan_nirnjan/
├── MASTER_PROMPT.md   ← this file
├── TECH_STACK.md      ← exact libs + folder structure
├── PRD.md             ← modules, user stories, data model, APIs
├── DESIGN.md          ← tokens, components, visual specs
├── NAVIGATION.md      ← tabs, routes, 13 modals, flows
├── TESTING.md         ← 45+ test cases + debug playbook
├── AGENT.md           ← rules for AI agents working on this repo
└── om-sanata_shree_nirnjanee.html  ← visual reference prototype
```

## One-line resume prompt (for later sessions)

```text
Read AGENT.md, MASTER_PROMPT.md, then check worklog/ and the last git commit.
Continue the next incomplete Phase from MASTER_PROMPT.md BUILD ORDER.
Do not redo completed phases. Commit when the phase passes its TESTING.md section.
```
