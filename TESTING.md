# TESTING.md — Test Cases & Debug Playbook
## सनातन श्री निरंजनी Master App — QA Suite v1.0

> Convention: **TC-<module>-<nn>**. Priority: **P0** = release blocker, P1 = must-fix, P2 = nice-to-have.
> The building agent must self-run all P0 cases (manual or Playwright) and report PASS/FAIL per section before declaring done.

---

## 1. Global / Shell

| ID | P | Steps | Expected |
|---|---|---|---|
| TC-SH-01 | P0 | Open `/` on 375×667 viewport | Header (ॐ disc, title, bell+badge, avatar) + search bar + 5-tab nav all visible; content scrolls; nav stays fixed |
| TC-SH-02 | P0 | Tap each of the 5 bottom tabs | Correct page renders; active tab turns saffron+bold; previous scroll preserved per tab |
| TC-SH-03 | P0 | Open any modal → press Esc / click overlay / ✕ | Modal closes; focus returns to trigger; scroll unlocked |
| TC-SH-04 | P0 | Open modal A then trigger modal B | Only B visible; A closed; no stacked overlays |
| TC-SH-05 | P1 | Resize 320px → 1440px | No horizontal scroll at any width; <640px full-bleed + bottom bar; 640–1024px centered rounded app card; ≥1024px full-width app with left nav rail, bottom bar hidden |
| TC-SH-06 | P1 | Check every icon-only button | Has Hindi `aria-label` |
| TC-SH-07 | P2 | `prefers-reduced-motion: reduce` | LIVE pulse / bounce disabled |
| TC-SH-08 | P0 | Restart server, reload app | All previously created data (bookings, contributions, mala, orders) still present |

## 2. होम (Home)

| ID | P | Steps | Expected |
|---|---|---|---|
| TC-HM-01 | P0 | Load home | Panchang banner shows tithi/paksha/nakshatra, मुहूर्त chip, sunrise; giant ॐ watermark present |
| TC-HM-02 | P0 | Tap all 6 grid tiles | Each opens its modal/page per NAVIGATION §3.1; none dead |
| TC-HM-03 | P0 | Tap गाड़ी पूजन & नामकरण quick cards | Correct booking modals open |
| TC-HM-04 | P1 | Tap "अखाड़ा सूची" | AkharaDirectoryModal opens |
| TC-HM-05 | P1 | Tap "पूर्ण प्रोफ़ाइल देखें" / "संत दर्शन" | GoldenBabaModal / SouthSaintsModal open with correct content |
| TC-HM-06 | P1 | Toggle satsang player | Play↔pause icon swaps; audio state consistent (mock audio acceptable) |
| TC-HM-07 | P2 | Check Golden Baba card | "QR Verified" chip visible; केरल origin; 4kg note intact |

## 3. Search & Notifications

| ID | P | Steps | Expected |
|---|---|---|---|
| TC-SR-01 | P0 | Type `मंदिर` → Enter | NearbyModal opens with 3 seeded temples & distances |
| TC-SR-02 | P0 | Type `गाड़ी` | GadiPujaModal opens |
| TC-SR-03 | P0 | Type `नामकरण` | NamkaranModal opens |
| TC-SR-04 | P0 | Type `संत` | AkharaDirectoryModal opens |
| TC-SR-05 | P1 | Tap "पास के मंदिर" chip | NearbyModal opens |
| TC-SR-06 | P2 | Type gibberish | Nothing opens, no crash |
| TC-NT-01 | P0 | Bell shows badge 3 → open modal | 3 items listed; badge clears after open |
| TC-NT-02 | P1 | Close & reopen notifications | Items remain; badge stays 0 |

## 4. बुकिंग (All 3 types)

| ID | P | Steps | Expected |
|---|---|---|---|
| TC-BK-01 | P0 | गाड़ी पूजन: fill owner, `UP-16-AB-1234`, valid date → submit | Success toast in Hindi; modal closes; row in DB status प्रतीक्षारत |
| TC-BK-02 | P0 | गाड़ी पूजन: vehicle `abc123` → submit | Inline Hindi error; no DB row |
| TC-BK-03 | P0 | Any booking: empty date → submit | Blocked with Hindi validation; no DB row |
| TC-BK-04 | P0 | नामकरण: parents' name + date → submit | Success; row `type=NAMKARAN` |
| TC-BK-05 | P0 | संत बुकिंग: name+phone+date → submit | Success; row `type=SANT` |
| TC-BK-06 | P0 | Double-click submit rapidly | Only ONE row created (button disabled during flight) |
| TC-BK-07 | P1 | मेनू → मेरी बुकिंग | All created bookings listed with type, date, status chip |
| TC-BK-08 | P1 | Phone field with <10 digits (sant booking) | Rejected with Hindi message |

## 5. गौ सेवा

| ID | P | Steps | Expected |
|---|---|---|---|
| TC-GS-01 | P0 | Tree form: name "रामप्रसाद", type बेलपत्र → Book Now ₹501 | Toast thanks donor by name + tree type; row `{kind:TREE, amount:501}`; certificateNo generated |
| TC-GS-02 | P0 | Tree form: empty name → submit | Defaults "श्रद्धालु" (per spec) and succeeds |
| TC-GS-03 | P0 | ₹510 daily chara tier → confirm | Row `CHARA_DAILY 510`; Hindi success |
| TC-GS-04 | P0 | ₹2100 monthly गोद → confirm | Row `CHARA_MONTHLY 2100` |
| TC-GS-05 | P1 | Tap लाइव गौ-दर्शन row | LiveGauModal with ● LIVE FEED badge |
| TC-GS-06 | P2 | Prices on screen | Exactly ₹501 / ₹510 / ₹2100 — no other values |

## 6. ग्रंथ & जप माला

| ID | P | Steps | Expected |
|---|---|---|---|
| TC-ML-01 | P0 | Tap counter 5× | Count = 5; bead animation each tap |
| TC-ML-02 | P0 | Refresh page | Count still 5 (persisted by day) |
| TC-ML-03 | P0 | Reset → confirm dialog → accept | Count 0; persisted |
| TC-ML-04 | P1 | Reset → cancel | Count unchanged |
| TC-GR-01 | P0 | Open granth | 18 chapters listed |
| TC-GR-02 | P0 | Open chapter → open verse | Hindi text + meaning render; no tofu glyphs |
| TC-GR-03 | P1 | Navigate all 18 chapters | None 404/empty-crash |

## 7. जिज्ञासा + AI

| ID | P | Steps | Expected |
|---|---|---|---|
| TC-AI-01 | P0 | Open AI sheet | Intro bubble includes respectful greeting + guru disclaimer |
| TC-AI-02 | P0 | Ask "महाकुंभ में स्नान का महत्व क्या है?" | Typing state ≤ 10s, then Hindi answer; message + reply persisted |
| TC-AI-03 | P0 | Ask non-dharmic question (e.g. coding help) | Polite Hindi refusal back to dharma topics |
| TC-AI-04 | P1 | AI route down / SDK error | Hindi error toast; chat usable after retry |
| TC-FO-01 | P0 | Forum feed loads | Seeded पेशवाई Q&A visible with tag chip + timestamp |
| TC-FO-02 | P1 | "अपना नया प्रश्न पूछें" | Opens AI sheet |

## 8. स्टोर & Cart

| ID | P | Steps | Expected |
|---|---|---|---|
| TC-ST-01 | P0 | Store grid loads | ≥ 6 products; गंगाजल ₹151, रुद्राक्ष माला ₹351 correct; "अखाड़े द्वारा प्रमाणित" badge |
| TC-ST-02 | P0 | Add both to cart | Badge = 2; cart total ₹502 |
| TC-ST-03 | P0 | Qty + / − / remove | Totals recompute; empty-cart state in Hindi |
| TC-ST-04 | P0 | Checkout without name/phone | Blocked with Hindi validation |
| TC-ST-05 | P0 | Valid checkout | Order row (mock PAID); cart clears; success UI |
| TC-ST-06 | P1 | Refresh after add-to-cart | Cart survives |
| TC-ST-07 | P2 | No real payment call ever | Network tab shows zero external payment requests |

## 9. मेनू / Directory / Volunteer

| ID | P | Steps | Expected |
|---|---|---|---|
| TC-MN-01 | P0 | Menu page | Profile, Digital ID (SN-2027-9842 + QR block + verified chip), directory btn, volunteer btn, certificate btn, मेरी बुकिंग |
| TC-DR-01 | P0 | Open directory | Search input; saint card with verified chip; स्मृति खंड block |
| TC-DR-02 | P1 | Search "महामंडलेश्वर" | Matching पद filter works; empty state if none |
| TC-DR-03 | P0 | Memorial → जीवन गाथा | GoldenBabaModal opens; stone/somber styling, no playful animation |
| TC-VL-01 | P0 | Volunteer: name + 10-digit WhatsApp → submit | Success toast; row persisted |
| TC-VL-02 | P1 | WhatsApp `123` | Hindi validation error |
| TC-CE-01 | P2 | Sankalp certificate button | Certificate view renders name + ID |

## 10. कुंभ 2027

| ID | P | Steps | Expected |
|---|---|---|---|
| TC-KB-01 | P0 | Open from home tile | Page (not dead modal): छावनी info, पेशवाई note, शाही स्नान dates from DB |
| TC-KB-02 | P0 | Check countdown | Positive correct day count to first स्नान; no NaN/negative |
| TC-KB-03 | P1 | Direct URL `/kumbh-2027` | Standalone render (deep-link safe) |

## 11. Cross-cutting / NFR

| ID | P | Steps | Expected |
|---|---|---|---|
| TC-XC-01 | P0 | `npm run build` | Zero TS/ESLint errors |
| TC-XC-02 | P0 | Devanagari sweep | Zero tofu (□); matras render (निरंजनी, जिज्ञासा) |
| TC-XC-03 | P0 | Sacred numbers audit | 501/510/2100/151/351 appear exactly; no mutations |
| TC-XC-04 | P0 | Playwright F1–F10 (NAVIGATION §6) | All flows green |
| TC-XC-05 | P1 | Lighthouse mobile | Perf ≥ 90, A11y ≥ 90, BP ≥ 95, SEO ≥ 90 |
| TC-XC-06 | P1 | All lists empty-state check | Hindi empty states, no blank boxes |
| TC-XC-07 | P1 | 3G throttle cold load | LCP < 2.5s, skeletons visible |
| TC-XC-08 | P2 | Respect-content sweep | No ads, no sensational copy, memorial solemn, no disrespectful icon usage |

## 12. Bug Report Template (`.github/ISSUE_TEMPLATE/bug_report.md`)

```markdown
### शीर्षक (Title)
[Module] one-line summary

### Environment
- URL / build: 
- Device / viewport: 
- Browser: 

### Steps to Reproduce
1. 
2. 
3. 

### Expected (per which doc & TC-ID)
Doc: PRD/NAVIGATION/DESIGN — section — Expected: 

### Actual
Screenshot / console log

### Severity
P0 blocker / P1 major / P2 minor
```

## 13. Debug Playbook (agent + human)

**Symptom → first checks:**

1. **Modal won't open / double overlay** → one open at a time violated; check ModalRoot state machine; ensure Radix Dialog (not raw divs) for focus trap.
2. **Data lost on refresh** → API not called on submit (prototype used `alert`); verify route handler + `db:push` + Prisma singleton (`lib/db.ts`), no client-only state pretending to persist.
3. **Hindi shows □ boxes** → font not loaded / wrong `lang` attribute; check `layout.tsx` sets `lang="hi"` and Noto Sans Devanagari self-hosted; no `tracking-*` classes on Devanagari text.
4. **Jap count resets** → `@@unique([userKey, day])` violated or day key timezone bug — use `Asia/Kolkata` day string, upsert not insert.
5. **AI answers in English / hallucinated tithi** → system prompt in `lib/ai.ts` missing guardrails; add "answer only in respectful Hindi; never invent panchang/muhurat data; add guru disclaimer".
6. **Cart total wrong** → price stored as paise? Standardize: **rupees as integer** everywhere; single `cartTotal()` selector; unit-test it.
7. **Countdown negative/NaN** → seeded date parsed as string; store `DateTime`, compute in `Intl` with `Asia/Kolkata`.
8. **Double bookings** → submit not disabled during flight; add `isPending` guard + idempotency key on POST.
9. **Mobile horizontal scroll** → culprit usually long vehicle-number input or table; add `min-w-0`, `break-words`, viewport meta check.
10. **Vercel build fails on Prisma** → missing `prisma generate` in build script; ensure `postinstall: prisma generate`.

**Escalation order for ambiguity:** HTML prototype → NAVIGATION.md → PRD.md → open issue tagged `question`.

## 14. Auth (Day 1 — `/api/auth/*`)

Automated in `tests/unit/auth.test.ts` against a real throwaway SQLite DB (`prisma/test.db`); `npm run test` must stay green. Curl walkthrough in `worklog/2026-10-27-day1-auth-backend.md`.

| TC | Case | Expected |
|---|---|---|
| TC-AT-01 | register valid भक्त | 201; DB row `role=USER`; scrypt `passwordHash`; session cookie (`HttpOnly`, `SameSite=Lax`, `Secure`, `Max-Age=604800`) |
| TC-AT-02 | register duplicate email | 409 + Hindi "पहले से पंजीकृत" |
| TC-AT-03 | register weak / missing password | 400 + Hindi; no user row created |
| TC-AT-04 | register SADHU | `role=SADHU`, `sadhuVerified=false` |
| TC-AT-04b | register with `role=ADMIN`/`VOLUNTEER` | 400 (self-assignment rejected) |
| TC-AT-05 | login correct password | 200 + valid 7-day JWT session cookie |
| TC-AT-06 | login wrong password | 401 generic Hindi "ईमेल या पासवर्ड गलत है।"; timing-safe; no crash |
| TC-AT-07 | login unknown email | identical status + body to TC-AT-06 (no user enumeration) |
| TC-AT-08 | `/api/auth/me` with cookie | 200 current user; never `passwordHash` |
| TC-AT-09 | `/api/auth/me` without cookie | 401 |
| TC-AT-10 | `/api/auth/me` tampered / expired JWT | 401 |
| TC-AT-11 | `requireRole("ADMIN")` as USER | 403 (missing session → 401) |
| TC-AT-12 | logout → `/api/auth/me` | cookie `Max-Age=0`; next call 401 |
| TC-AT-13 | POST `/api/feedback` | 201 row (blank optionals → NULL); invalid → 400 Hindi |

## 15. Auth UI, language toggle & saint showcase (Day 2)

Automated in `tests/e2e/auth.spec.ts` plus updated `flows.spec.ts` / `site.spec.ts`.

| TC | Case | Expected |
|---|---|---|
| TC-AT-14 | `/register` empty/invalid submit | Hindi client errors, no request; role picker only भक्त/संत/स्वयंसेवक (no ADMIN) |
| TC-AT-15 | register (भक्त) | 201 → `/profile` shows real name/email/role; session cookie set |
| TC-AT-16 | register duplicate e-mail | server Hindi 409 alert, stays on `/register` |
| TC-AT-17 | login wrong password | generic Hindi "ईमेल या पासवर्ड गलत है।", stays on `/login` |
| TC-AT-18 | guest `/profile` | redirect → `/login?next=/profile` |
| TC-AT-19 | logout → `/profile` | cookie cleared → redirect to login |
| TC-AT-20 | header session state | logged-out: लॉग इन + पंजीकरण; logged-in: name/avatar + लॉग आउट |
| TC-AT-21 | unsafe `?next=` | open redirect impossible; only same-origin relative paths honoured |
| TC-LN-01 | language toggle | हिंदी default; toggle writes `sn_lang`, `<html lang>` switches, survives reload |
| TC-LN-02 | localized chrome | nav/footer/bottom-nav/auth labels switch; sacred content stays Hindi |
| TC-SD-01 | home saint showcase | verified cards with photo/credit/स्रोत; scroll-reveal; no placeholder names |
| TC-SD-02 | saint data | living vs दिवंगत flags correct; memorial list matches verified data |
| TC-SH-03 | hydration console | no app-caused hydration mismatch (extension-injected attrs suppressed) |
