# NAVIGATION.md — App Map, Routes & User Flows
## सनातन श्री निरंजनी Master App

> This file is the complete interaction map: 5 bottom tabs, 8 pages, 13 modals/sheets, and every named flow. The agent implements **all** of it; QA verifies against **all** of it.

---

## 1. Information Architecture (overview)

```
Root Layout (Header + SearchBar + BottomNav + ModalRoot)
├── होम (home)                        /
├── गौ-सेवा (gau)                     /gau-seva
├── ग्रंथ (granth)                    /granth
├── जिज्ञासा (jigyasu)                /jigyasu
├── मेनू (profile/menu)               /menu
├── पूजा स्टोर (from home grid)       /store
├── कुंभ 2027 (from home grid/modal)  /kumbh-2027
└── मेरी बुकिंग (from menu)           /bookings
```

## 2. Bottom Tab Bar (5 fixed items)

| # | Label (Hindi) | Route | Icon (lucide) | Leads to |
|---|---|---|---|---|
| 1 | होम | `/` | `House` | Home dashboard (M1) |
| 2 | गौ-सेवा | `/gau-seva` | `Beef`/`Leaf` | Gau & nature portal (M3) |
| 3 | ग्रंथ | `/granth` | `BookOpen` | Library + jap mala (M4) |
| 4 | जिज्ञासा | `/jigyasu` | `MessagesSquare` | Forum + AI chat (M5) |
| 5 | मेनू | `/menu` | `Settings` | Profile, ID, directory, volunteer (M7) |

Active state: `text-saffron font-bold`; tap anywhere re-navigates (no dead tabs). Back button on Android must not exit from a tab — it should return to `/` first (PWA history behavior).

## 3. Page → Element Map

### 3.1 होम `/`
| Element | Type | Destination / action |
|---|---|---|
| Panchang banner | card | static display (data from `/api/panchang`) |
| Suvichar strip + "अखाड़ा सूची" | card + button | opens `AkharaDirectoryModal` |
| Grid: लाइव दर्शन | tile | opens `LiveDarshanModal` |
| Grid: कुंभ 2027 | tile | navigates `/kumbh-2027` (v1 upgrade from modal) |
| Grid: AI जिज्ञासा | tile | opens `AiChatSheet` |
| Grid: गौ सेवा | tile | → `/gau-seva` |
| Grid: पूजा स्टोर | tile | → `/store` |
| Grid: संत बुकिंग | tile | opens `BookingModal (SANT)` |
| Quick: गाड़ी पूजन | card | opens `GadiPujaModal` |
| Quick: नामकरण संस्कार | card | opens `NamkaranModal` |
| Golden Baba card "पूर्ण प्रोफ़ाइल देखें" | card + CTA | opens `GoldenBabaModal` |
| स्मृति वृक्षारोपण highlight "गौ एवं प्रकृति पोर्टल पर जाएं" | card + CTA | → `/gau-seva` |
| South Saints card "संत दर्शन" | card + CTA | opens `SouthSaintsModal` |
| Satsang player band | player | toggle play/pause (audio hook) |

### 3.2 गौ-सेवा `/gau-seva`
| Element | Type | Action |
|---|---|---|
| Portal banner | hero | static |
| लाइव गौ-दर्शन (● LIVE) | row button | opens `LiveGauModal` |
| स्मृति वृक्षारोपण form | form | donor name + tree type (पीपल/बरगद/बेलपत्र/नीम-आंवला) → POST `/api/gau-seva` (₹501) |
| चारा सेवा: 1 दिन हरा चारा | tier row ₹510 | POST contribution `CHARA_DAILY` |
| चारा सेवा: गोवंश गोद (monthly) | tier row ₹2100 | POST contribution `CHARA_MONTHLY` |

### 3.3 ग्रंथ `/granth`
| Element | Action |
|---|---|
| Jap mala counter | tap (+1, persists), reset (confirm dialog), shows mantra label |
| Gita chapter list (18) | → verse list → verse detail (Hindi meaning) |
| Gita audio flag | disabled "शीघ्र" chip when `audioAvailable=false` |

### 3.4 जिज्ञासा `/jigyasu`
| Element | Action |
|---|---|
| Forum feed | scroll, tag chips, relative timestamps |
| "अपना नया प्रश्न पूछें" | opens `AiChatSheet` (and posts to forum in v2) |
| AI chat sheet | message list + input; POST `/api/chat`; typing indicator |

### 3.5 मेनू `/menu`
| Element | Action |
|---|---|
| Profile card | static |
| Digital ID card (SN-2027-9842, QR) | "QR Verified" chip; cert download → certificate view |
| अखाड़ा directory button | opens `AkharaDirectoryModal` |
| Volunteer registration | opens `VolunteerModal` |
| संकल्प ई-सर्टिफिकेट | certificate view/download stub |
| "मेरी बुकिंग" | → `/bookings` |

### 3.6 Store `/store`, Kumbh `/kumbh-2027`, Bookings `/bookings`
- Store: product grid → add to cart (badge on header/sheet), cart sheet (qty ±, total), checkout form (name+phone) → mock PAID order + success state.
- Kumbh: info, छावनी list, पेशवाई note, शाही स्नान dates (DB), countdown.
- Bookings: user's bookings table with status chips (प्रतीक्षारत/पुष्ट).

## 4. Modal Inventory (13 — all must exist)

| ID | Title (Hindi) | Trigger(s) | Key contents |
|---|---|---|---|
| `AkharaDirectoryModal` | श्री पंचायती अखाड़ा निरंजनी (पदाधिकारी सूची) | suvichar "अखाड़ा सूची", menu button, search `संत/महामंडलेश्वर` | search input, saint card (verified chip, संपर्क/आश्रम button), स्मृति खंड block → `GoldenBabaModal` |
| `GoldenBabaModal` | महामंडलेश्वर एस.के. नारायण गिरि (गोल्डन बाबा) | directory memorial, home card | photo, origin केरल, 4kg स्वर्ण साधना note, योगदान |
| `GadiPujaModal` | वाहन (गाड़ी) पूजन बुकिंग | home quick card, search `गाड़ी` | owner name, vehicle no, date, ₹501 CTA |
| `NamkaranModal` | नामकरण संस्कार बुकिंग | home quick card, search `नामकरण` | parents' name, date, CTA |
| `NearbyModal` | पास के मंदिर एवं अखाड़ा केंद्र | search bar chip, search `मंदिर` | 3 seeded temples with distances |
| `LiveDarshanModal` | अखाड़ा मंदिर लाइव दर्शन | home grid | player placeholder + LIVE badge |
| `LiveGauModal` | श्री निरंजनी गौशाला लाइव कैमरा | gau tab row | player placeholder + LIVE FEED |
| `KumbhModal`→page | महाकुंभ 2027 नेविगेटर | home grid | v1: page with dates + countdown |
| `AiChatSheet` | AI आध्यात्मिक सहायक | home grid, jigyasu CTA | intro bubble + disclaimer, chat |
| `BookingModal` | घर पर संत एवं आचार्य बुकिंग | home grid | name+phone, date, request CTA |
| `SouthSaintsModal` | दक्षिण भारत के संत एवं आचार्य दर्शन | home card | bio summary (चिन्मयानंद, नारायण गुरु) |
| `VolunteerModal` | निरंजनी युवा सेवा दल | menu button | name + WhatsApp → POST |
| `NotificationModal` | सूचनाएँ एवं शुभ मुहूर्त अलर्ट | header bell | list, unread badge resets |

## 5. Global Search Keyword Routing

| Typed keyword contains | Opens |
|---|---|
| `मंदिर` | `NearbyModal` |
| `गाड़ी` | `GadiPujaModal` |
| `नामकरण` | `NamkaranModal` |
| `संत` or `महामंडलेश्वर` | `AkharaDirectoryModal` |

Rules: evaluate on Enter and on debounce(300ms); first match wins, in the order above; clear-on-open; no results → silent (do not open anything). Additional keywords (कुंभ, गौ, गीता, स्टोर) may navigate to pages — add to table before implementing.

## 6. Named User Flows (must be E2E testable)

**F1 गाड़ी पूजन booking:** होम → गाड़ी पूजन card → fill owner + `UP-16-XX-0000` + date → "पूजन बुक करें (₹501)" → POST → success toast (Hindi) → modal closes → मेनू → मेरी बुकिंग shows row (प्रतीक्षारत).
**F2 स्मृति वृक्षारोपण:** /gau-seva → enter donor name → pick बेलपत्र → Book Now ₹501 → confirmation names donor + tree → row persisted.
**F3 चारा दान:** /gau-seva → ₹510 tier → confirm → success → DB row `CHARA_DAILY`.
**F4 जप:** /granth → tap ×5 → refresh → count still 5 → reset → confirm → 0.
**F5 AI जिज्ञासा:** home grid → AI sheet → ask "महाकुंभ में स्नान का महत्व?" → typing state → Hindi answer + guru disclaimer visible.
**F6 Store order:** /store → add गंगाजल ₹151 + रुद्राक्ष माला ₹351 → cart shows ₹502 total → checkout name+phone → success (mock PAID).
**F7 Directory:** होम → अखाड़ा सूची → search "महामंडलेश्वर" → filtered card → स्मृति खंड → GoldenBabaModal.
**F8 Volunteer:** मेनू → volunteer → name + 10-digit WhatsApp → submit → toast "सेवा दल पास…" → row saved.
**F9 Notifications:** header bell (badge 3) → open list → badge clears → items remain readable.
**F10 Search routing:** type `मंदिर` → NearbyModal opens; type `गाड़ी` → GadiPujaModal opens.

## 7. State & Behavior Rules

1. Modals: only one open at a time; opening B closes A; overlay click + Esc close; scroll locked behind overlay.
2. Navigation from a modal CTA (e.g. कुंभ tile) closes the modal before routing.
3. Tab switches preserve each page's scroll position (PWA feel); refetch on focus only for panchang/notifications.
4. Cart badge is global (header) and updates on every add/remove across pages.
5. All POST actions show: idle → loading (disabled button + "भेजा जा रहा है…") → success toast OR inline Hindi error. Double-submit guarded.
6. Unread notification count comes from API; opening the modal marks all read.
7. Deep links: `/kumbh-2027`, `/store`, `/bookings` must render standalone (shareable to WhatsApp).
8. Back navigation from `/store|/kumbh-2027|/bookings` returns to previous tab.
