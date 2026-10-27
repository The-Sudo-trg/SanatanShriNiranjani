# DEVELOPMENT PLAN — Sanatan Shri Niranjani

> **Two deadlines:**
> 1. 🎯 **5 November 2026** — **FULL PRODUCT website** finished: registration & accounts
>    (user / sadhu / volunteer / admin), product + order tracking, complete gau seva,
>    security, backend + frontend — everything. (10 working days: Oct 27 → Nov 5)
> 2. 🎯 **31 December 2026** — whole **project** finished (Android + iOS app published),
>    reusing the same backend (auth, tracking, gau seva APIs).
>
> Assumed effort: **5–7 focused hours per day.** Every day ends with a commit
> (conventional commit, AGENT.md §4) and a one-line `worklog/` note.

---

## Status snapshot (26 Oct 2026)

Done and verified: design system v2, website shell, 10 verified temples, daily
darshan, mantras, festivals, search, saved, legal pages, SEO, 40/40 unit tests,
50 e2e green, production build green.

Open (drives Phase A): GitHub push blocked (credential + security gate),
**no user accounts**, store has no order tracking, gau seva has no account
history/certificates, `/api/bookings` leaks phones, next-pwa vulnerabilities,
Lighthouse not run, 3 temples without photos.

**Scope trade-off (decided):** multilingual scaffold + preferences page move to
the app phase (v1.1). Registration, tracking, gau seva and security take their
days. Content (temples/mantras/festivals) is already multilingual-ready.

---

# PHASE A — FULL-PRODUCT WEBSITE (Day 1 → Day 10)

## A.1 What "full product" means (Definition of Done, Nov 5)

- [ ] Anyone can **register** as भक्त (user), संत (sadhu), or स्वयंसेवक (volunteer)
      — email + password, Hindi validation messages, no phone/SMS dependency.
- [ ] Login / logout / profile (`/profile`) with session cookie (httpOnly, secure).
- [ ] **Sadhu** accounts register with a "verification pending" state (admin approves).
- [ ] **Volunteer** pass moves into the account (no more anonymous form).
- [ ] **Store**: orders belong to logged-in users; full tracking lifecycle
      `PENDING → CONFIRMED → SHIPPED → DELIVERED` (+ `CANCELLED`), timeline visible
      to the user on `/orders`, status updated by admin on `/admin`.
- [ ] **Gau seva**: tree/chara contributions attach to the account, history list,
      and **e-certificate (संकल्प पत्र)** with certificate number, printable.
- [ ] Bookings attach to accounts; `/api/bookings` returns only the caller's rows
      (leak fixed).
- [ ] **Admin** (`ADMIN` role): order status, sadhu approvals, bookings,
      contributions. Everything role-gated.
- [ ] Security: hashed passwords, JWT httpOnly cookies, rate limiting on auth +
      write routes, security headers, `npm audit` clean (Serwist migration).
- [ ] Lighthouse mobile: Performance 90+, A11y/BP/SEO 95+ on home + temple detail.
- [ ] 3 missing temple photos sourced with licenses; feedback form stores to DB.
- [ ] Full e2e: register → login → order → track → gau seva → certificate → admin.
- [ ] Deployed to Vercel, verified live, tagged `v1.0-full-product`. **Frozen.**

## A.2 Backend architecture (locked decisions)

| Decision | Choice | Why |
|---|---|---|
| Password hashing | `node:crypto` **scrypt** (salt + timing-safe compare) | zero new dependencies (AGENT.md §2.6) |
| Sessions | JWT (HMAC-SHA256, built-in `crypto`) in **httpOnly, SameSite=Lax, Secure** cookie, 7-day expiry | no DB session table needed for v1 |
| Roles | `USER`, `SADHU`, `VOLUNTEER`, `ADMIN` on `User.role` | one table, simple middleware |
| Validation | existing zod + Hindi errors (`lib/validators.ts`) | repo convention |
| New deps | **none** (scrypt + HMAC via node:crypto; Serwist replaces next-pwa — ADR-005) | |

**Prisma schema additions:**
```
User            { id, name, email @unique, phone?, passwordHash, role, sadhuVerified @default(false), createdAt }
Order           + userId?, status @default("PENDING"), updatedAt
OrderEvent      { id, orderId, status, note?, at }        // tracking timeline
GauContribution + userId?
Booking         + userId?
Feedback        { id, name?, email?, message, templeSlug?, createdAt }
```

**New API routes:** `POST /api/auth/register|login|logout`, `GET /api/auth/me`,
`GET /api/orders` (own) , `PATCH /api/admin/orders/:id` (ADMIN),
`GET/PATCH /api/admin/sadhus` (ADMIN), `POST /api/feedback`.
`requireRole()` middleware in `lib/auth.ts` guards every write route.

## A.3 Day-by-day

| Day | Date (2026) | Focus | Tasks | Done when |
|---|---|---|---|---|
| 1 | Tue **Oct 27** | Auth backend | Push pending commits (clear credential + security gate). Prisma schema (§A.2) → `db push` + seed ADMIN. `lib/auth.ts`: scrypt hash/verify, JWT sign/verify, cookie helper, `requireRole`. Auth routes (register/login/logout/me) + unit tests. | Register+login via curl works; tests green |
| 2 | Wed **Oct 28** | Auth frontend | `/register` (role picker: भक्त/संत/स्वयंसेवक), `/login`, `/profile`; header shows login state + logout; zod Hindi errors; e2e: register→logout→login→profile. | Full auth flow on device |
| 3 | Thu **Oct 29** | Roles | Sadhu flow shows "सत्यापन लंबित" until admin approves; volunteer registration becomes account-based pass; role badges; guard `/api/volunteers` & old anonymous paths; e2e role tests. | Wrong-role API access → 403 in tests |
| 4 | Fri **Oct 30** | Product tracking | OrderEvent model + status transitions; `GET /api/orders` (own orders + events); `/orders` page with tracking timeline (status chips, dates); order confirmation now requires login; e2e: order → timeline visible. | User sees own order status history |
| 5 | Sat **Oct 31** | Admin console | `/admin` (ADMIN only): orders table + status update (adds OrderEvent), sadhu approvals, bookings, gau contributions; `/api/bookings` owner-scoped (leak fix); e2e admin tests. | Admin can run the whole operation |
| 6 | Sun **Nov 1** | Gau seva complete | Contributions link to account; `/profile/gau-seva` history; e-certificate (संकल्प पत्र) render page with certificate number + print CSS; e2e: donate → history → certificate. | Certificate prints with real number |
| 7 | Mon **Nov 2** | Security | next-pwa → **Serwist** (ADR-005), audit clean; rate-limit auth + POST routes (in-memory bucket); session expiry + logout-all cookie clear; verify headers/CSP; bookings/volunteer routes re-checked. | `npm audit` 0 high; rate-limit tested |
| 8 | Tue **Nov 3** | Perf + content | Lighthouse (mobile+desktop) on `/`, `/temples`, temple detail → fix to 90+/95+; source 3 missing temple photos (license records); `/api/feedback` + form on contact/temple pages. | Scores recorded & met; photos attributed |
| 9 | Wed **Nov 4** | Full QA | Extend e2e: full user journey (register→order→track→gau→certificate), admin journey, role denials; keyboard-only + screen-reader pass; fix everything found; final unit+e2e+build all green. | 0 failing tests, a11y sweep done |
| 10 | Thu **Nov 5** | DEPLOY 🚀 | `npm run build` → Vercel → **verify live with prod DB**: register, login (Secure cookie!), order+tracking, gau certificate, admin console; tag `v1.0-full-product`; final worklog + README. | **Full product live. Frozen.** |

**Phase A rules:** no new scope after Day 6; slippage eats Day 10's buffer;
every push keeps CI green (lint → unit → build → e2e); sacred prices/Hindi
contract strings untouched (AGENT.md §2.2).

---

# PHASE B — ANDROID + iOS APP (Nov 6 → Dec 31)

**Stack:** Expo + React Native + TypeScript, one codebase, **reusing the Phase A
backend as-is** (auth JWT in secure storage, orders/tracking, gau seva, content
JSON export). No new backend work.

App v1 scope = website parity + push reminders: Home · Daily Darshan (daily
notification) · Temples + distance · Mantras · Festivals · Wisdom · Search ·
Favorites (offline) · **Login/Register** · **Order tracking** · **Gau seva +
certificate** · Jap Mala · Booking forms · AI Jigyasu · About/legal.
Not in v1: real payments, live camera streams, moderation UI.

| Week | Dates | Milestone | Key work |
|---|---|---|---|
| 1 | Nov 6–12 | **M1 shell + home + auth screens** | Expo setup in `app-mobile/`, theme tokens port, 5-tab nav, home screens, login/register UI (APIs already live) |
| 2 | Nov 13–19 | **M2 temples + darshan** | Data JSON export, temple list/detail/filters/distance, favorites (AsyncStorage), daily darshan screen |
| 3 | Nov 20–26 | **M3 content screens** | Mantras, festivals, wisdom, search, saved |
| 4 | Nov 27–Dec 3 | **M4 account flows** | Session in secure store, profile, **order placement + tracking timeline**, gau seva + certificate view, bookings, jap mala, AI chat |
| 5 | Dec 4–10 | **M5 notifications** | Expo notifications, opt-in daily-darshan + festival reminders, local fallback, unsubscribe |
| 6 | Dec 11–17 | **M6 polish + offline beta** | Offline cache, skeletons/empty/error states, Dynamic Type a11y, perf; feature-complete, no P0s |
| 7 | Dec 18–24 | **M7 test + release prep** | Full QA checklist, fix week, EAS builds (APK + TestFlight), store listings (hi+en), privacy policy link |
| 8 | Dec 25–31 | **Launch 🎉** | Submit Play (fast) **and App Store by Dec 26** (review takes days); buffer for rejections; final docs |

---

## Daily routine (every day)

1. Open this doc, do only today's row.
2. Small pieces; run `npm run lint && npm run test` (or Expo reload) after each.
3. Conventional commit at day end; one-line worklog note.
4. Blocked >1 h → note it, take the next parallel task, come back.

## Risks & honest limits

- **Days 1–6 are heavy** (auth + tracking + admin + certificates). If Day 3
  slips, cut sadhu-approval UI to a DB flag + admin API only (UI in v1.1).
- iOS review is the least controllable step — submit by **Dec 26**.
- No SMS/OTP in v1 (needs a paid gateway); email+password only. OTP = v1.1.
- Payments stay mocked on both platforms (same rule as today).
- Push to GitHub is currently blocked twice over: wrong Git credential
  (TheDark-KN vs The-Sudo-trg) **and** the Mimosa commit/push gate on
  jobs_for_me findings — both must clear on Day 1.
