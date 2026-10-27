# Day 1 — Auth Backend (2026-10-27)

Foundation day: anyone can register + log in over the API with e-mail + password,
roles live in the DB, every auth endpoint is unit-tested, and GitHub push is unblocked.
No UI (Day 2).

## Task 0 — GitHub push unblocked (blocker)

- **Credential/TLS fix:** the stored GitHub credential (Windows Credential Manager,
  user `jadavmadhavkumar`) is valid and has push rights. The real failure was the
  system TLS backend — git-over-HTTPS died at
  `schannel: AcquireCredentialsHandle failed: SEC_E_NO_CREDENTIALS` *before* auth was
  attempted. Fixed repo-locally with `git config --local http.sslBackend openssl`
  (public `git ls-remote` then worked, then authenticated `git push` worked).
- **Upstream:** `main` had no tracking branch (bare `## main`); fixed with
  `git branch --set-upstream-to=origin/main main`. `git push` now succeeds; the tree
  was clean and level with `origin/main` before new work.
- **"Security push gate (Mimosa flag on jobs_for_me findings)":** no such tool, flag,
  config or note exists in this repository. `Mimosa` / `jobs_for_me` → 0 hits across
  tracked files; `.git/hooks` contains only samples; no push-protection config in
  `.github/`. The only in-repo security gate is CI's report-only
  `npm audit --audit-level=high || true` (`.github/workflows/ci.yml`), already
  non-blocking. Nothing to clear — logged rather than invented.
- **Test baseline repair:** `npm run test` was broken on this Windows machine —
  vitest could not boot (`Cannot find native binding` → rolldown) because
  `node_modules` had been installed under WSL2/Linux. Installed the lockfile-pinned
  Windows optional binding `@rolldown/binding-win32-x64-msvc@1.2.15` with
  `npm install --no-save` (no package.json / package-lock.json change). Baseline
  restored to 40/40 before feature work.

## Task 1 — Prisma schema (§A.2)

- **New models:** `User` (`email @unique`, `passwordHash`, `role String
  @default("USER")` — Prisma's SQLite connector has no enums, so USER | SADHU |
  VOLUNTEER | ADMIN is validated in `lib/auth.ts`; `sadhuVerified @default(false)`,
  `createdAt`), `OrderEvent` (`orderId`, `status`, `note?`, `at`), `Feedback`
  (`name?`, `email?`, `message`, `templeSlug?`, `createdAt`).
- **Columns added:** `Order.userId?` + `updatedAt @default(now()) @updatedAt`
  (`status @default("PENDING")` already existed — not duplicated) + `events`;
  `GauContribution.userId?`; `Booking.userId?`; all with `SetNull`/`Cascade` relations.
- `npx prisma db push` (no data-loss prompt) + `npx prisma generate`. Data preserved:
  Booking 4 → 4, GauContribution 4 → 4, Order 1 → 1; `updatedAt` backfilled.
- **Seed ADMIN (secure):** id `seed-admin`, only the scrypt hash is stored. **No working
  default password is committed** — `SEED_ADMIN_PASSWORD` supplies it, otherwise the
  seed generates a strong random password, prints it once, and stores the hash. The
  seed never promotes an existing account (prevents registering the seed e-mail first
  and being silently made ADMIN). Local `.env` (git-ignored) sets a dev password.
- **Pre-existing seed bug fixed:** Panchang was upserted by the *rolling date* while the
  rows carry fixed ids, so `npm run db:seed` crashed with P2002 on any day after the
  first run. Now upserts by `id` and moves the date — re-runnable every day.

## Task 2 — `lib/auth.ts` (zero new dependencies — locked decision honoured)

- `hashPassword` / `verifyPassword`: node:crypto **scrypt** at OWASP-recommended cost
  (N=2^17, r=8, p=1 ≈ 128 MiB, explicit `maxmem`), 16-byte random salt, PHC-style
  `scrypt$N$r$p$salt$hash`, `timingSafeEqual` comparison. Passwords NFC-normalised
  (Devanagari typed on NFC/NFD keyboards hashes identically). Malformed stored hashes
  fail closed; old hashes with lower cost params still verify (tested).
- `signJwt` / `verifyJwt`: **HMAC-SHA256 JWT** via node:crypto, 7-day expiry, `alg`
  pinned, constant-time signature compare, rejects tampered / expired / garbage tokens.
  `AUTH_SECRET` required outside local development/test (staging without `NODE_ENV`
  fails closed); dev/test use a stable fallback.
- `setSessionCookie` / `clearSessionCookie`: **`__Host-sn_session`** cookie
  (`HttpOnly`, `SameSite=Lax`, `Secure`, `Path=/`, `Max-Age=604800`, no `Domain`) —
  the `__Host-` prefix prevents sibling-subdomain cookie shadowing. Serialised onto a
  plain Web `Response` (no `next/server` dependency — framework-pure and unit-testable).
- `getSessionUser(req?)`: Request-aware (`Cookie` header) with a `next/headers`
  fallback for Server Components; DB lookup returns only public fields.
- `requireRole(role | roles[], req?)`: `{ ok: true, user }` or
  `{ ok: false, response }` with **401** (no session) / **403** (wrong role).
- `DUMMY_PASSWORD_HASH` + dummy verify on unknown e-mail → response timing does not
  enumerate users.

## Task 3 — API routes (App Router; Next 16 async-request APIs respected)

| Route | Method | Behaviour |
|---|---|---|
| `/api/auth/register` | POST | zod (Hindi) → 409 duplicate → scrypt hash → 201 + session cookie; SADHU starts `sadhuVerified:false`; only USER/SADHU self-selectable |
| `/api/auth/login` | POST | verify scrypt → 200 + session cookie; wrong password AND unknown e-mail → same generic Hindi 401 |
| `/api/auth/logout` | POST | expires `__Host-sn_session` cookie (`Max-Age=0`) |
| `/api/auth/me` | GET | current user (never `passwordHash`) or 401; `dynamic = "force-dynamic"` |
| `/api/feedback` | POST | writes `Feedback` row (Day 8 pre-wiring); blanks → NULL; Hindi validation |

Hardening in the shared helpers (`lib/api.ts`):
- `readJsonBody()` — 8 KiB JSON body cap → 413 Hindi (no unbounded buffering on public
  routes), malformed JSON → Hindi 400.
- `zodErrorMessage()` — any non-Devanagari Zod default is replaced by a generic Hindi
  message, so no English leaks through even for unknown-body edge cases.
- `jsonNoStore()` — `Cache-Control: private, no-store` + `Vary: Cookie` on all auth
  responses.
- Every Prisma call is wrapped: DB failure → Hindi JSON 500, not an HTML crash page.
- Register rejects `role: ADMIN|VOLUNTEER` and ignores injected `sadhuVerified`.

Validators added to `lib/validators.ts`: `registerSchema`, `loginSchema`,
`feedbackSchema` (Hindi messages incl. required-field messages), e-mail normalised
(trim + lowercase), password min 8 / max 200, empty optional phone → "not provided".

## Task 4 — Tests

- New `tests/unit/auth.test.ts` — **33 cases** covering all 12 required cases plus
  extras: role escalation, e-mail casing, phone empty/illegal, malformed & oversized
  bodies, privilege-field injection, cache headers, role-list guard, legacy scrypt
  params, hash/JWT primitives, cookie flags, feedback.
- Real integration harness: `tests/unit/setup/global-setup.ts` provisions a throwaway
  `prisma/test.db` via `prisma db push`, teardown deletes it; `dev.db` is never touched.
  Nothing is mocked — handlers → Prisma → scrypt/HMAC all execute.
- `npm run test` → **73/73 green** (was 40/40: +33 auth cases).
- `npm run lint` clean; `npm run build` green (`/api/auth/*` + `/api/feedback` present).
- `tests/e2e/reset-db.mjs` now also clears non-seed users + feedback (Day-2 e2e hygiene).
- Added TESTING.md §14 (TC-AT-01…13) as the auth test contract.

## Task 5 — Verification & delivery

- End-to-end curl against `next start` (production build, throwaway DB): **40/40 checks
  passed** — register/duplicate/weak-password/SADHU/malformed/oversized/injection,
  login/wrong-password/unknown-email, `/me` with/without/tampered cookie + cache
  headers, logout→401, feedback. Cookie attributes and Hindi messages verified from raw
  headers/bodies. `dev.db` untouched (curl ran on `prisma/curl-check.db`, deleted after).
- **Independent adversarial audit** (separate reviewer agent, read-only) of the auth
  surface; findings addressed: hard-coded seed ADMIN password removed, seed promotion
  vector closed, Hindi fallback for Zod default messages, no-store auth responses,
  bounded request bodies, Prisma try/catch, OWASP scrypt cost + `maxmem` + NFC, stricter
  `AUTH_SECRET` gating, `__Host-` cookie, e2e reset coverage.
- Conventional commits + pushed to `origin/main`.

## Routes / Schema / Env

- **Routes:** `app/api/auth/{register,login,logout,me}/route.ts`, `app/api/feedback/route.ts`
- **Schema:** `User`, `OrderEvent`, `Feedback`; `Order.userId`/`updatedAt`,
  `GauContribution.userId`, `Booking.userId` (+ relations)
- **Env:** `AUTH_SECRET` (required outside local dev, min 16 chars),
  `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (seed only; empty → random, printed once)
- **Admin (local dev):** `admin@niranjani.local`; password lives only in the git-ignored
  `.env` (or the once-printed generated secret) — the DB stores only the scrypt hash.

## Stubs / open questions

- Sessions are stateless JWTs: logout clears the cookie but cannot server-revoke an
  already-exfiltrated token. A DB-backed session/token table is a Day 7
  (rate-limiting/PWA) candidate if true revocation is required.
- No login/register rate limiting or lockout yet — explicitly Day 7 scope (brute-force
  cost is currently the scrypt work factor).
- Password-change and SADHU verification approval endpoints are out of Day-1 scope
  (`sadhuVerified` is stored; approval flow comes with the admin UI).
- `Secure` cookie is on unconditionally (locked decision). Modern browsers treat
  `localhost` as a secure context; plain-HTTP LAN device testing will need a TLS host.
- E2E Playwright suite was not run today (no UI changes); unit + build + curl are the
  Day-1 gates.

## Next

Day 2 — auth UI (login/register forms wired to these routes, Hindi copy per DESIGN.md).
