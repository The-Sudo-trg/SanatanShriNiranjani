# PRD.md — Product Requirements Document
## सनातन श्री निरंजनी (Sanatan Shri Niranjani) — Master App of श्री पंचायती अखाड़ा निरंजनी

| Field | Value |
|---|---|
| Product name | सनातन श्री निरंजनी Master App |
| Repo | `The-Sudo-trg/Om_sanatan_nirnjan` |
| Version | 1.0 (MVP) |
| Author | Product draft from HTML prototype `om-sanata_shree_nirnjanee.html` |
| Status | APPROVED for build |
| Platform | Mobile-first PWA (320px → desktop) |
| UI Language | Hindi (Devanagari), respectful devotional tone |

---

## 1. Vision & Problem Statement

Sanatan Dharma's institutional life — akhadas, saints, sanskars, gaushalas, Kumbh — is largely offline. Devotees have no single trusted digital doorway to: see live darshan, book a puja or an acharya visit, contribute to gau seva with proof, do daily jap with continuity, or navigate Mahakumbh 2027. Unofficial pages spread unverified information about saints (e.g. Golden Baba) and akhada customs.

**Vision:** one authoritative, dignified, devotional app owned by the akhada's digital presence — "सनातन धर्म का डिजिटल द्वार".

**Success looks like (v1):** a devotee can complete any of the 9 module journeys below in under 60 seconds on a ₹8,000 Android phone over 3G, with every submission persisted and acknowledged in Hindi.

## 2. Goals & Non-Goals

**Goals (v1):**
1. Digitize all 13 interaction surfaces of the prototype with real persistence.
2. Preserve exact sacred pricing: गाड़ी पूजन ₹501, स्मृति वृक्षारोपण ₹501, हरा चारा ₹510/day, गोवंश गोद ₹2100/month, गंगाजल ₹151, रुद्राक्ष माला ₹351.
3. AI जिज्ञासा answers in Hindi with scripture-grounded, guru-respectful guardrails.
4. QR-verified saint directory & memorial (स्मृति खंड) that fights misinformation.
5. Kumbh 2027 readiness: chhavni, पेशवाई route, शाही स्नान dates, countdown.

**Non-Goals (v1):** real payment capture (mocked), real live RTSP streams (placeholder player), user login/OAuth (single local user profile), push notifications (in-app center only), multi-language toggle (Hindi only).

## 3. Personas

| Persona | Context | Primary needs |
|---|---|---|
| **भक्त / Devotee (Ramesh, 42, Kanpur)** | Daily app user, festival-driven | Panchang, jap mala, live darshan, store, gau seva |
| **श्रद्धालु / Pilgrim (Sunita, 35, Nashik)** | Visits for sanskars & Kumbh | Book gadi puja / namkaran / sant visit; Kumbh navigator |
| **पदाधिकारी / Akhada admin (Mahant ji's office)** | Manages listings | Directory accuracy, volunteer onboarding, request inbox (v2) |
| **सेवादार / Volunteer (Arjun, 22)** | Youth wing member | Register, receive सेवा दल pass, stay notified |

## 4. Modules & Requirements (9 modules)

### M1 — होम (Home)
Daily devotional dashboard. Contents: (a) **Panchang banner** — tithi/paksha/nakshatra, शुभ मुहूर्त chip, sunrise, special note; (b) **Suvichar strip** — quote of the day (e.g. "धर्मो रक्षति रक्षितः…") + अखाड़ा सूची shortcut; (c) **Feature grid (6)** — लाइव दर्शन, कुंभ 2027, AI जिज्ञासा, गौ सेवा, पूजा स्टोर, संत बुकिंग; (d) **Quick cards (2)** — गाड़ी पूजन, नामकरण संस्कार; (e) **Golden Baba profile card** (QR-verified badge, केरल origin, 4kg स्वर्ण as साधना symbol); (f) **स्मृति वृक्षारोपण highlight**; (g) **दक्षिण भारत के संत** card; (h) **Live satsang player bar** (महामृत्युंजय मंत्र podcast) with play/pause.
**User stories:** *As a devotee opening the app at 6 AM, I see today's panchang and one-tap paths to every seva, so my morning sadhana starts in one place.*

### M2 — बुकिंग (Bookings: गाड़ी पूजन ₹501 / नामकरण / संत बुकिंग)
Form fields per type: गाड़ी पूजन → owner name, vehicle number (format hint `UP-16-XX-0000`), date, ₹501; नामकरण → parents' name, date; संत बुकिंग → name + phone, date. All submissions create a `Booking` row, show Hindi confirmation ("आपका अनुरोध … प्रशासन को भेज दिया गया है"), and appear in **मेरी बुकिंग** list with status chips (प्रतीक्षारत → पुष्ट).
**Acceptance:** zod validation; invalid vehicle number rejected with Hindi error; empty date rejected; success closes modal + toast + list refresh.

### M3 — गौ सेवा एवं प्रकृति कल्याण पोर्टल
(a) **लाइव गौ-दर्शन** tile with LIVE badge → camera placeholder; (b) **स्मृति वृक्षारोपण** — donor name, tree type select (पीपल, बरगद, बेलपत्र, नीम/आंवला), ₹501 contribution, promise of GPS tag + e-certificate; (c) **चारा सेवा** — ₹510 1-day green fodder, ₹2100 monthly गोवंश गोद. All contributions persisted with donor, amount, type, timestamp.
**Acceptance:** empty donor name falls back to "श्रद्धालु" with confirm; every tier writes a `GauContribution` row; thank-you toast names the donor and tree type.

### M4 — ग्रंथ + जप माला
(a) **Digital jap mala** — big counter, tap +1 (persisted per day), reset with confirm, mantra label (ओम नमः शिवाय / महामृत्युंजय), subtle bead animation on tap; (b) **Gita reader** — 18 chapters seeded, chapter → verses list with Hindi meaning (seeded subset in v1, full text v2), audio flag placeholder.
**Acceptance:** count survives refresh & restart; reset asks "क्या आप वाकई काउंट रीसेट करना चाहते हैं?"; chapter navigation never 404s.

### M5 — जिज्ञासा (Community Q&A + AI सहायक)
(a) Forum feed of questions with tag chips (प्रश्न/उत्तर), relative time, akhada answers (seed: पेशवाई significance); (b) "अपना नया प्रश्न पूछें" opens AI chat; (c) **AI आध्यात्मिक सहायक** — chat UI, server route calls z-ai-web-dev-sdk, system prompt: answer in respectful Hindi, ground in scriptures/itihasa, never invent tithi/muhurat, add disclaimer "बड़े निर्णय हेतु अपने गुरु/आचार्य से परामर्श लें", refuse non-dharmic topics politely.
**Acceptance:** chat streams/renders answer ≤ 10s with typing state; history persists per session; disclaimer always visible in intro bubble.

### M6 — पूजा स्टोर
Grid of certified products (seed 6): पवित्र गंगाजल 1L ₹151, पाँच मुखी रुद्राक्ष माला ₹351, + 4 more (हवन सामग्री, अखंड ज्योत बाती, काले तिल, पूजा थाली set — prices in seed). Cart sheet (badge count), quantity edit, mock checkout → `Order` (PENDING → PAID mock), "अखाड़े द्वारा प्रमाणित" trust badge.
**Acceptance:** cart survives refresh; totals correct in ₹; checkout requires name+phone; Razorpay left as documented stub.

### M7 — मेनू / Profile / Digital ID
(a) Profile card (avatar, name, "पंजीकृत सनातन भक्त"); (b) **Digital ID card** — ID `SN-2027-9842` format `SN-YYYY-XXXX`, QR placeholder, "QR Verified" chip, संकल्प e-certificate download button (v1: styled certificate view); (c) **अखाड़ा directory** — searchable पदाधिकारी list (name, पद, verified chip, contact/ashram button) + **स्मृति खंड** memorial block (ब्रह्मलीन श्री गोल्डन बाबा जी → जीवन गाथा); (d) **Volunteer registration** — name + WhatsApp number → saved, pass promise toast.

### M8 — कुंभ 2027 नेविगेटर
Info page: Haridwar 2027 context, akhada छावनी locations (हरिद्वार/प्रयागराज शाखा), पेशवाई route summary, **शाही स्नान dates** (seeded list), live countdown component to first स्नान, GPS note (v2: map).
**Acceptance:** countdown computes from real clock, no negative days bug; dates stored in DB not hardcoded in UI.

### M9 — Notifications & Search
(a) **Notification center** — bell with unread badge (seed 3), items like "एकादशी विशेष व्रत कथा", mark-read on open; (b) **Global search** — keyword routing per prototype: `मंदिर`→nearby temples modal, `गाड़ी`→gadi puja, `नामकरण`→namkaran, `महामंडलेश्वर|संत`→directory; "पास के मंदिर" chip → nearby list (श्री सनातन शिव मंदिर ~90 मीटर, पंचमुखी हनुमान मंदिर ~2.3 किमी, अखाड़ा शाखा).

## 5. Data Model (Prisma, provider-agnostic)

```prisma
model Panchang      { id String @id @default(cuid()); date DateTime @unique; tithi String; paksha String; nakshatra String; muhurat String; sunrise String; note String? }
model Suvichar      { id String @id @default(cuid()); text String; source String?; day Int @default(1) }
model Booking       { id String @id @default(cuid()); type String /* GADI_PUJA|NAMKARAN|SANT */; personName String; phone String?; vehicleNo String?; date DateTime; amount Int?; status String @default("PENDING"); createdAt DateTime @default(now()) }
model GauContribution { id String @id @default(cuid()); donorName String; kind String /* TREE|CHARA_DAILY|CHARA_MONTHLY */; treeType String?; amount Int; certificateNo String?; createdAt DateTime @default(now()) }
model MalaCount     { id String @id @default(cuid()); userKey String @default("local"); day String; count Int; @@unique([userKey, day]) }
model GitaChapter   { id String @id @default(cuid()); number Int @unique; titleHi String; verseCount Int; audioAvailable Boolean @default(false) }
model GitaVerse     { id String @id @default(cuid()); chapterNumber Int; number Int; textHi String; meaningHi String }
model ForumPost     { id String @id @default(cuid()); authorName String; kind String /* QUESTION|ANSWER */; body String; parentId String?; createdAt DateTime @default(now()) }
model ChatMessage   { id String @id @default(cuid()); sessionKey String; role String /* user|assistant */; content String; createdAt DateTime @default(now()) }
model Product       { id String @id @default(cuid()); nameHi String; price Int; unit String?; icon String; certified Boolean @default(true); active Boolean @default(true) }
model CartLine      { id String @id @default(cuid()); productId String; qty Int }
model Order         { id String @id @default(cuid()); buyerName String; phone String; total Int; status String @default("PENDING"); lines Json; createdAt DateTime @default(now()) }
model Saint         { id String @id @default(cuid()); nameHi String; pad String; bioHi String; originHi String?; memorial Boolean @default(false); verified Boolean @default(true); order Int @default(0) }
model Volunteer     { id String @id @default(cuid()); name String; whatsapp String; createdAt DateTime @default(now()) }
model Notification  { id String @id @default(cuid()); titleHi String; bodyHi String; read Boolean @default(false); createdAt DateTime @default(now()) }
model Temple        { id String @id @default(cuid()); nameHi String; distanceText String; isAkhadaBranch Boolean @default(false); lat Float?; lng Float? }
model KumbhEvent    { id String @id @default(cuid()); titleHi String; date DateTime; kind String /* SHAHI_SNAN|OTHER */; noteHi String? }
```

## 6. API Contract (App Router route handlers)

| Route | Method | Body → Response | Errors |
|---|---|---|---|
| `/api/panchang` | GET | — → today's Panchang (fallback seed) | 200/404 |
| `/api/bookings` | GET/POST | POST `{type,personName,phone?,vehicleNo?,date}` → `Booking` | 400 zod, Hindi `error` |
| `/api/gau-seva` | GET/POST | POST `{donorName,kind,treeType?}` → contribution + certificateNo | 400 |
| `/api/mala` | GET/POST | GET today count; POST `{delta}` → updated | 400 |
| `/api/forum` | GET/POST | GET feed; POST `{authorName,kind,body,parentId?}` | 400 |
| `/api/chat` | POST | `{sessionId,content}` → `{reply}` via z-ai-web-dev-sdk | 429/500 Hindi msg |
| `/api/cart` | GET/POST/PATCH/DELETE | add/update/remove lines | 400/404 |
| `/api/orders` | POST | `{buyerName,phone}` → order (mock PAID) | 400 empty cart |
| `/api/volunteers` | POST | `{name,whatsapp}` → ok | 400 |
| `/api/notifications` | GET/POST | GET list+unreadCount; POST markRead | — |

**Validation rule:** every POST validated by zod in `lib/validators.ts`; error responses `{ error: string }` in Hindi.

## 7. Non-Functional Requirements

1. **Performance:** 3G-first; LCP < 2.5s on Moto G-class device; images lazy; fonts `display: swap`.
2. **Resilience:** every list has empty state in Hindi ("जल्द ही उपलब्ध होगा 🙏" — no emoji in UI icons; text-only courtesy allowed where prototype used it).
3. **Security:** server-only AI keys; zod on all inputs; no raw HTML injection in forum/chat (escape/serialize).
4. **Privacy:** phone/WhatsApp numbers stored for seva coordination only; no third-party trackers in v1.
5. **Dharma guardrails:** no ads, no sensational notifications, memorial content solemn, saint imagery only from approved assets.
6. **Offline (PWA):** app shell + ग्रंथ texts cached; jap mala works offline and syncs on reconnect.
7. **A11y:** WCAG AA body text; all icon buttons labeled in Hindi (`aria-label="सूचनाएँ"` etc.).

## 8. Release Plan

| Phase | Scope | Gate |
|---|---|---|
| v0.1 | Phases 0–2 (shell + home) | TESTING.md §2–3 pass |
| v0.2 | M2 bookings + M3 gau seva | §4–5 pass |
| v0.3 | M4 granth/mala + M5 jigyasu+AI | §6–7 pass |
| v0.4 | M6 store + M7 menu/directory | §8–9 pass |
| v0.9 | M8 kumbh + M9 notifications/search | §10–11 pass |
| v1.0 | PWA + polish + Lighthouse | full TESTING.md pass, deploy guide run |

## 9. Open Questions (tracked, not blockers)

1. Official शाही स्नान dates for Haridwar 2027 — seed with placeholders, admin-updatable later.
2. Digital ID issuance flow — v1 static per-device; v2 OTP-based verification.
3. Certificate PDF generation — v1 UI preview; v2 server PDF.
4. Razorpay KYC on akhada trust account — before real payments unlock.
