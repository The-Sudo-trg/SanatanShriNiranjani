# AGENT.md — Operating Rules for AI Coding Agents
## Repo: The-Sudo-trg/Om_sanatan_nirnjan — सनातन श्री निरंजनी Master App

> Any AI agent (Claude Code, Cursor, Copilot Workspace, Windsurf, Codex, chat LLM) working in this repository MUST follow this file. It overrides your defaults. On conflict between docs: `AGENT.md` → `MASTER_PROMPT.md` → `PRD.md` / `NAVIGATION.md` / `DESIGN.md` / `TECH_STACK.md` → HTML prototype → your own judgment.

---

## 1. First-Session Checklist (do in order, before any feature code)

1. Read: `AGENT.md`, `MASTER_PROMPT.md`, `TECH_STACK.md`, `PRD.md`, `DESIGN.md`, `NAVIGATION.md`, `TESTING.md`.
2. Read the HTML prototype `om-sanata_shree_nirnjanee.html` for look/content intent — **do not import it into the build**.
3. Check `git log --oneline -15` and any `worklog/` notes to find the current Phase (MASTER_PROMPT §BUILD ORDER).
4. Verify toolchain: `node -v` (≥ 20), `npm install`, `npm run db:push`, `npm run db:seed`, `npm run dev` boots clean.
5. Only then continue the next incomplete Phase.

## 2. Hard Rules (violations = failed work)

1. **Never break the build.** After every meaningful change: `npm run build` + `npm run lint` must pass. TypeScript `strict` stays on; no `any` escape hatches except documented interop.
2. **Never change sacred business data.** Prices ₹501 / ₹510 / ₹2100 / ₹151 / ₹351, ID format `SN-YYYY-XXXX`, seeded saint names/titles, Hindi UI strings are contractual. Change only via PRD update.
3. **Never mock silently.** If something is a stub (payments, live streams, QR scan), label it in UI ("शीघ्र") AND in code (`// STUB(v2):`) AND in your report. Hidden stubs are bugs.
4. **Never call real money / real SMS / real camera-stream APIs in v1.**
5. **Never weaken religious respect.** No jokes, no slang, no sensational copy, no ads/tracking scripts, memorial content stays solemn. Hindi tone = सादर एवं श्रद्धापूर्वक.
6. **No new dependencies** without an ADR note at the bottom of `TECH_STACK.md` (why, what it replaces, bundle cost).
7. **No redesign.** DESIGN.md tokens are exact. If a component is missing a spec, follow the prototype's class patterns, then propose an ADR.
8. **Don't drop scope.** All 5 tabs, 13 modals, 10 flows (NAVIGATION §4, §6) must exist. Feature parity is the contract; enhancement needs an issue first.
9. **Secrets never in code or git.** `.env` git-ignored; only `.env.example` committed.
10. **Don't skip tests.** A phase is done only when its TESTING.md section is green.

## 3. Coding Standards

- **Language:** TypeScript everywhere; components in `.tsx`; `"use client"` only where interactivity demands.
- **Structure:** pages thin (compose components); business logic in `lib/`; DB access only in route handlers/server actions — never in client components.
- **Styling:** Tailwind utilities with DESIGN.md token classes (`text-saffron`, `bg-divineBg`, `text-maroonText`, `bg-gold`). No inline `style` except dynamic transforms. No hex literals in components.
- **Hindi strings:** centralize reusable copy in `lib/constants.ts` (or component-local for one-offs). No hardcoding inside deeply nested JSX twice — extract if reused.
- **Forms:** react-hook-form + zod schema from `lib/validators.ts`; Hindi error messages; loading/disabled states; idempotent submit.
- **APIs:** zod-parse input → try/catch → typed JSON response; Hindi `error` strings; status codes per PRD §6.
- **DB:** Prisma only; no raw SQL; write migrations/`db:push` steps into your report; seed idempotent (`upsert`).
- **Accessibility:** per DESIGN.md §10 checklist — treat as part of "done", not polish.
- **Naming:** components `PascalCase`, files match component; hooks `useX`; stores `xStore`; DB fields `camelCase`.

## 4. Git Discipline

- Conventional commits: `feat(gau): स्मृति वृक्षारोपण form + API`, `fix(mala): timezone day key`, `docs: update PRD §8`.
- One logical unit per commit; a Phase may be several commits.
- Never commit: `node_modules`, `.env`, `dev.db`, build output, screenshots of saints (use approved assets only).
- Branch model: `main` = working app; feature branches `feat/<phase>-<slug>`; small PRs self-merge after tests pass (solo repo).

## 5. Self-Verification Loop (every phase)

```
code → npm run lint → npm run build → run this phase's TESTING.md cases
     → fix → repeat → git commit → append worklog note
```

Report format (final message of a phase):
| TESTING.md section | Cases | Result |
|---|---|---|
| §4 बुकिंग | TC-BK-01…08 | 8/8 PASS |
plus: files added/changed, new routes, schema changes, stubs introduced, open questions.

## 6. Ambiguity & Escalation

1. HTML prototype is the visual/content default.
2. If prototype and docs disagree → docs win; note the conflict in worklog + issue.
3. If truly undefined (new case) → implement the most conservative, respectful, minimal option; mark `// QUESTION:` comment + issue; never invent scope silently.

## 7. What "Done" Means (v1.0)

- [ ] All Phases 0–10 committed; app runs from clean clone: `npm i && npm run db:push && npm run db:seed && npm run dev`
- [ ] Every P0 case in TESTING.md PASS; P1 PASS or documented
- [ ] Playwright flows F1–F10 green
- [ ] Lighthouse budgets met (TECH_STACK §8)
- [ ] README quickstart accurate for a non-technical maintainer
- [ ] Zero known console errors on all 8 pages

## 8. Anti-Patterns Seen in Similar Builds (avoid)

- Copying the prototype's `onclick="openModal(...)"` string soup into React — use the modal store.
- `alert()` as confirmation — replace with sonner toasts in Hindi.
- Treating seeded Hindi data as test data and "cleaning" it — the seed IS the product content.
- English fallbacks slipping into UI ("Book Now") — Hindi only (proper nouns aside).
- Big-bang commit at phase end — commit per unit; recoverable history is required.
- Leaving `console.log` of user phone numbers — privacy rule (PRD §7.4).

## 9. Worklog Protocol

Append (never overwrite) `worklog/YYYY-MM-DD-phase.md` at phase end:
```markdown
# Phase X — <name> (<date>)
- Done: <bullets>
- Routes/Schema: <list>
- Tests: <sections passed>
- Stubs: <list or "none">
- Next: <first task of next phase>
```
Agents starting mid-project reconstruct state from `git log` + latest worklog — keep them truthful.
