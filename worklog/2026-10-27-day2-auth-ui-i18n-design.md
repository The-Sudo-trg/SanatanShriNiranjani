# Day 2 — Auth frontend, language toggle, saint showcase, shell/design hardening (2026-10-27, evening)

Owner request round: fix the hydration console error, remove ज्ञान + chat entry from the
shell, add a cookie-persisted language toggle (Hindi default), add real sign-in/out +
registration pages that write accounts, add a verified साधु showcase with scroll animation
to the landing page, make the site dynamic where it must be, and fix design flaws —
production grade, no regressions.

## 1. Console hydration error — root cause + fix

- The mismatch was **browser-extension-injected attributes**, not app state: DevTools showed
  `fdprocessedid="…"` on buttons (Header notification bell, temple save buttons, …). Password
  managers / form fillers add that attribute to the SSR HTML before React hydrates — React
  cannot patch it, so it warns.
- Fix: `suppressHydrationWarning` on DOM form controls that can be touched by extensions, added
  centrally where possible — [components/ui/button.tsx](components/ui/button.tsx),
  [components/ui/input.tsx](components/ui/input.tsx) — plus each SSR-rendered `<button>`/`<input>`
  in the page shell and page-level client components (Header, SearchBar, FavoriteButton,
  MantraLibrary, TempleDirectory, SiteSearch, SavedList, StoreClient, booking forms, modals…).
  Navigation links are untouched (extensions do not modify anchors).
- Note: this suppresses only the third-party attribute warning; no app state/behaviour is hidden.

## 2. Language toggle (Hindi default) — cookie persisted, server rendered

- New dependency-free i18n: [lib/i18n.ts](lib/i18n.ts) (typed hi/en catalogue, ~120 shell/auth
  keys, `t()`, `createTranslator()`, role labels) + [lib/i18n-server.ts](lib/i18n-server.ts)
  (`getLocale()` reads the cookie in Server Components).
- [components/site/LanguageToggle.tsx](components/site/LanguageToggle.tsx) — top-bar globe button;
  writes first-party `sn_lang` cookie (1 year, SameSite=Lax) then `router.refresh()`.
- **No flash / no hydration mismatch:** `RootLayout` reads the cookie per request and renders
  `<html lang="hi|en">`, Header, SearchBar, Footer and BottomNav server-side in that locale.
  Hindi is the default; English translates the **UI chrome** (nav, header, footer, bottom nav,
  auth pages, profile). Sacred/product content (mantras, scripture, saint bios, temple data)
  remains Hindi by contract (AGENT.md §2).
- E2E covers toggle → reload → persistence → switch back (`tests/e2e/auth.spec.ts`).

## 3. Auth frontend (DEVELOPMENT_PLAN Day 2) — real sign in / sign up / profile

- Routes: **`/login`**, **`/register`**, **`/profile`** (protected, `noindex`) — all localized.
- Register: name, e-mail, optional phone, password, accessible role picker (भक्त / संत /
  स्वयंसेवक → USER / SADHU / VOLUNTEER; ADMIN is never offered). Client validation mirrors
  `lib/validators.ts` with localized messages; server zod stays the source of truth; 409/400
  server Hindi errors shown in an `aria-live` alert. SADHU shows the “सत्यापन लंबित” note.
- Login: generic Hindi error for wrong credentials; `?next=` redirect is sanitised to a relative
  same-origin path (open-redirect tested for `//evil`, `https://…`, `%2F%2F…`, `\evil`, loops).
- Header is session-aware from the server layout: **लॉग इन + पंजीकरण** when signed out;
  name/avatar + **लॉग आउट** when signed in. Mobile shows a visible sign-in pill (not only an icon).
- `/menu` profile tab now shows the **real** session account (initials, name, e-mail, role badge,
  SADHU verification state, profile/logout) or a login/register invitation — the fake
  “देश प्रेमी” identity is gone. Volunteer/certificate/directory/bookings sections kept.
- API: self-registration now also accepts `VOLUNTEER` (still rejects `ADMIN`); unit tests updated.

## 4. साधु showcase on the landing page — verified data + scroll animation

- New [lib/data/sadhus.ts](lib/data/sadhus.ts): **5 sourced records** — names, pad, Hindi bios,
  origins, memorial flags, verification URLs and `verifiedOn` — with Wikimedia Commons photos only
  (free licence + author + file-page attribution):
  1. आचार्य महामंडलेश्वर स्वामी कैलाशानंद गिरि (CC BY-SA 4.0)
  2. श्री महंत नरेंद्र गिरि जी (CC BY-SA 4.0, ब्रह्मलीन 2021)
  3. स्वामी चिन्मयानंद सरस्वती (public domain)
  4. श्री नारायण गुरु (public domain)
  5. महामंडलेश्वर एस.के. नारायण गिरि “गोल्डन बाबा” (living; **no free photo exists** → dignified
     ॐ medallion, never a random substitute)
- New [components/home/SadhuShowcase.tsx](components/home/SadhuShowcase.tsx): mobile scroll-snap
  carousel / desktop 2–3 column grid; one-shot IntersectionObserver reveal with CSS `@keyframes
  sn-fade-up` (staggered). **Cards are visible by default** so a JS failure can never hide real
  content; `prefers-reduced-motion` disables the animation. Photo credit + licence link, स्रोत
  link, “सत्यापित” chip per card.
- **Data reconciliation (accuracy fixes):**
  - Removed the Day-1 placeholder sadhu `महामंडलेश्वर स्वामी श्री ... जी महाराज`.
  - The old seed wrongly marked Golden Baba `memorial: true` and Chinmayananda/Narayana Guru
    `memorial: false` — corrected (Golden Baba is living; the two south masters are ब्रह्मलीन).
  - Golden Baba modal/home card no longer describe him as ब्रह्मलीन; memorial blocks now list the
    actual दिवंगत संत from the DB.
  - Removed two copyright-risky hotlinked photos (`assettype.com` news CDN, `keralaheritage.org`)
    that CSP also blocked — replaced with the medallion / Commons photographs.
  - `prisma/seed.ts` now imports `SADHUS` as the single source of truth and deletes the three
    legacy ids, so directory/modals and landing page can never drift.
- Home integration: section rendered between temple discovery and interests; Golden Baba card
  looked up by id instead of the ambiguous `memorial: true` query.

## 5. Removals requested by the owner

- **ज्ञान** removed from the top navigation (the `/granth` page itself stays reachable from home
  tiles, menu and footer — no content deleted).
- **Chat support entry removed from the landing page:** the “AI जिज्ञासा” tile is gone from the
  home feature grid (now 5 tiles). The AI सहायक itself remains on `/jigyasu`, where the forum is.
  There was **no floating chat widget in the codebase**; the round bubble at the bottom was the
  **Next.js dev indicator**, which overlapped the mobile tab bar — now disabled via
  `devIndicators: false` (dev-only UI; production had none).

## 6. Dynamic vs static strategy

- The shell (`app/layout.tsx`) reads the **language cookie + session** per request → all
  user-visible pages render dynamically (build output: every page ƒ except `robots.txt` /
  `sitemap.xml`). DB pages also keep explicit `dynamic = "force-dynamic"` (home, daily-darshan,
  menu, profile, login, register, store, bookings, jigyasu, granth, gau-seva, kumbh).
- Static-by-nature assets stay static: fonts via `next/font`, local typed content datasets
  (temples/mantras/festivals/wisdom/sadhus), `sitemap.xml`, `robots.txt`, PWA assets.
- Analytics now mounts only in production (dev loads a third-party script the strict CSP blocks —
  it was pure console noise).

## 7. Design / UX fixes (no redesign — DESIGN.md tokens kept)

- Mobile header no longer wraps/overflows: compact brand with truncation, 44px targets, language
  toggle + bell + cart + visible sign-in pill; search/heart move to the search row/menu where there
  is space; desktop keeps the full 4-link nav + auth buttons.
- English leaks removed from Hindi UI: “QR Verified” → क्यूआर सत्यापित, “Verified Digital ID (QR
  Code)” → सत्यापित डिजिटल परिचय पत्र (क्यूआर), “Digital ID & Certificate” → डिजिटल परिचय पत्र
  (आईडी एवं प्रमाण पत्र), “Memorial Profile” → स्मृति खंड, “Volunteer” → स्वयंसेवक (locale-aware).
- Footer links got proper hit areas; “पूरी सूची” links now 44px targets; dev overlay no longer
  covers the bottom nav; auth/profile pages are responsive at 390 / 768 / 1440.

## Routes / Schema / Env

- **New routes:** `/login`, `/register`, `/profile` (+ `?next=`), existing auth APIs unchanged
  except `VOLUNTEER` self-registration.
- **Schema:** unchanged today (saint photo metadata lives in the typed data file; DB stores the
  verified textual fields).
- **Env:** unchanged (`AUTH_SECRET`, `SEED_ADMIN_*`). Language uses cookie `sn_lang` (no env).

## Tests / gates

- `npx tsc --noEmit` clean; `npm run lint` clean.
- `npm run test` → **78/78** (73 + 4 i18n + VOLUNTEER-role case): auth route suite, i18n catalogue
  completeness (hi/en key parity), hashing/JWT primitives.
- `npm run test:e2e` → **56 tests, 55 pass + 1 flaky** (pre-existing Kumbh countdown hydration
  timing, passes on Playwright retry; same test was flaky before this round). New `auth.spec.ts`:
  register → profile → logout → login → profile, Hindi client validation, generic wrong-password
  error, guest redirect + safe `next`, and language toggle persistence.
- `npm run build` green; `prisma db push` unchanged (+ re-seed of verified saints).
- Visual verification at 390 / 768 / 1440 (screenshots in `shots/`, gitignored).

## Stubs / open questions

- Digital ID card is still the v1 static card (`SN-2027-9842`) for every user; role-aware IDs
  belong with the Day-3 role pass.
- English locale covers the UI chrome + auth flows only — full content translation would need a
  content pipeline (scripture/saint bios stay Hindi by contract).
- AI सहायक remains on `/jigyasu` only (owner asked to remove chat from the landing surface).
- No login rate limiting yet (Day 7 security day); sessions are stateless JWTs.

## Next

Day 3 — roles: साधु verification approval flow + role badges + guard the old anonymous
volunteer path behind accounts.
