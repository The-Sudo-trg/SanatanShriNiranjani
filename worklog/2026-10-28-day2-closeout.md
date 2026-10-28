# Day 2 close-out — 28 Oct 2026 (auth frontend verification + gaps)

Plan row: Day 2 (Wed Oct 28) auth frontend. The bulk of the day-2 scope was
shipped on 27 Oct (see `2026-10-27-day2-auth-ui-i18n-design.md`); today closed
the remaining "done when" gaps and verified the live deployment.

## Done today

- **Prod incident fix**: register/login were empty-body 500s on Vercel —
  `AUTH_SECRET` was never set in the project env (fail-closed throw escaped all
  try/catch). Secret generated + added to Production/Preview, deployed via
  `vercel redeploy`, verified live end-to-end (201/200/200/200 + cookie).
  Code hardened: register/login wrap token signing in try/catch → typed Hindi
  JSON 500s (`70118fe`).
- **Auth hardening**: `readJsonBody` JSON-content-type-only + UTF-8-byte size
  cap + NaN-safe Content-Length; `safeNextPath` deduped into
  `lib/next-path.ts` (login/register pages were drifting copies) (`7f077d7`).
- **header mobile logout** — mobile users could not sign out outside
  /profile|/menu; added `lg:hidden` icon button beside the avatar pill.
- **E2E close-out** (Day-2 "done when: full auth flow on device"):
  sadhu role picker → `सत्यापन लंबित` on /profile; volunteer role picker;
  `?next=%2Fmenu` full round-trip lands on /menu; mobile-header logout test;
  logout selectors scoped to visible buttons (TESTING.md TC-AT-20b/22/23/24).
- **Toolchain note**: local dev container (WSL, Windows-installed node_modules)
  was missing Linux native bindings → installed `--no-save`
  `lightningcss-linux-x64-gnu`, `@tailwindcss/oxide-linux-x64-gnu`,
  `@rolldown/binding-linux-x64-gnu@1.2.15` to run the suites. E2E now runs
  against the webpack dev server on :3100; the Kumbh-countdown hydration flake
  is unchanged and unrelated (passes on retry).

## Gates

- `tsc --noEmit` clean; `eslint .` clean.
- Unit: 78/78 green (incl. `/api/auth/*` route-level suite).
- E2E: 58 passed + 1 known pre-existing flake (Kumbh countdown, passes on
  retry; documented).
- Live prod verified: register→login→me→logout works on
  https://sanatanshriniranjani.vercel.app.

## Next

- Day 3 (roles): sadhu-approval admin flow, volunteer pass → account, role
  guards on `/api/volunteers`, 403 e2e tests.
