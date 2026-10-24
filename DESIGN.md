# DESIGN.md — Design System & UI Specification
## सनातन श्री निरंजनी Master App — "Divine Saffron" system

> Source: visual prototype `om-sanata_shree_nirnjanee.html`. This file is the single styling contract. Tailwind config / CSS variables must mirror these tokens exactly.

---

## 1. Design Philosophy

The app is a **digital temple**, not a social network. Every screen should feel like stepping into a clean, sunlit mandir courtyard: warm saffron light, white marble surfaces, gold accents used sparingly like temple ornaments, deep maroon for scriptural text. Whitespace is reverence — never crowd the divine. Animations are gentle (hover glow, soft pulse on LIVE), never bouncy or gamified. Anything that would look at home in a shopping app (aggressive reds, countdown-pressure banners, sticky discount toasts) is forbidden.

## 2. Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `saffron` | `#FF6700` | Primary actions, active tab, header gradient start, live accents |
| `deepSaffron` | `#D95300` | Header gradient end, pressed states, gradient partner |
| `gold` | `#FFD700` | ॐ logo disc, borders on sacred items (ID card, memorial), LIVE dot on player, highlight text on dark bands |
| `divineBg` | `#FFF9F0` | App background everywhere (warm cream, NOT pure white) |
| `cardBg` | `#FFFFFF` | Cards, modals, sheets |
| `maroonText` | `#4A1500` | Headings on light, scripture text, modal titles |
| Support — amber-50/100/200 | Tailwind default | Card tints, input backgrounds, hairline borders |
| Support — emerald-600/700 | Tailwind default | प्रकृति/वृक्षारोपण module accents ONLY |
| Support — indigo-600/700 | Tailwind default | AI जिज्ञासा module accents ONLY |
| Support — red-600 | Tailwind default | LIVE badges only |
| Support — stone-900/950 | Tailwind default | Satsang player band, memorial (स्मृति खंड) blocks |
| Semantic | — | success `green-700`, warning `amber-600`, error `red-700`, info `indigo-600` |

**Gradient recipes:**
- Header: `linear-gradient(to-r, #FF6700, #D95300)`
- Panchang banner: `linear-gradient(to-r, amber-500, orange-600)` with 10%-opacity giant ॐ watermark top-right
- Gau portal banner: `linear-gradient(to-r, amber-600, emerald-700)`
- Granth banner: `linear-gradient(to-r, red-800, amber-800)`
- Jigyasu banner: `linear-gradient(to-r, indigo-700, blue-700)`
- Satsang band: `linear-gradient(to-r, stone-900, amber-950)`

**Contrast rule:** body text ≥ 4.5:1. `gray-800` on `divineBg` passes; never use `gray-400` or lighter for Devanagari body copy.

## 3. Typography

| Role | Stack | Size/Weight |
|---|---|---|
| Devanagari + UI | `"Noto Sans Devanagari", "Segoe UI", Tahoma, Verdana, sans-serif` (self-host first two weights 400/700, `display: swap`) | — |
| App title (header) | same | `text-base font-bold tracking-wide` |
| Section heading | same | `text-xs font-bold uppercase tracking-wider text-gray-700` |
| Card title | same | `text-xs font-bold` (gray-800 or maroon) |
| Body / meta | same | `text-[11px]–text-xs`, meta `text-[10px] text-gray-500` |
| Jap mala counter | same | `text-3xl font-bold text-saffron`, tabular numerals |
| Quote (suvichar) | same, italic | `text-xs italic text-maroonText` |

Rules: minimum readable size `text-[10px]`; never below. Devanagari line-height ≥ 1.5 (`leading-snug` minimum, `leading-relaxed` for paragraphs). No font mixing beyond the stack above.

## 4. Layout & Radius System

- **Responsive shell (3 tiers):**
  - **< 640px (mobile):** full-bleed fluid width, bottom 5-tab bar, internal `main` scroll.
  - **640–1024px (tablet):** centered rounded app card (`max-w-lg`, `sm:h-[900px]` cap, `sm:rounded-3xl`, `sm:border-amber-200`, `sm:shadow-2xl`) on the divine bg.
  - **≥ 1024px (desktop):** full-width app (`lg:max-w-none`, no border/shadow) with a left nav rail (`w-20`, icon+label, same 5 tabs) and content centered at `lg:max-w-6xl`; bottom bar hidden (`lg:hidden`).
- **Radii:** pill inputs/badges `rounded-full`; cards `rounded-2xl`; modals `rounded-3xl`; inner media blocks `rounded-xl`; icon tiles `rounded-xl`.
- **Spacing scale:** page gutter `p-4`; card padding `p-3.5–p-4`; grid gap `gap-3`; section gap `space-y-4`; nav height ~64px; header ~56px.
- **Scroll:** content area `overflow-y-auto` with hidden scrollbar (`.hide-scrollbar` pattern); bottom padding `pb-20` so content clears the nav.
- **Shadow:** cards `shadow-sm`; modals `shadow-2xl`; header `shadow-md`; nav `shadow-lg`. No neon glows.

## 5. Core Components (specs)

### 5.1 Header
Gradient bar. Left: `w-9 h-9 rounded-full bg-gold` disc with maroon **ॐ** + two-line title block (name `text-base font-bold`, subtitle `text-[10px] opacity-90 tracking-wider` "श्री पंचायती अखाड़ा निरंजनी"). Right: bell icon with `bg-gold text-maroonText` count badge (top-right overlap), avatar button → मेनू tab. All icon buttons `aria-label` in Hindi.

### 5.2 Search + Quick Action Bar
`bg-amber-50`, hairline bottom border. Pill search input (`bg-white border-amber-200 focus:ring-2 focus:ring-saffron`, magnifier icon left) + fixed chip-button "पास के मंदिर" (`bg-saffron text-white rounded-full`).

### 5.3 Feature Grid Tile
White card `rounded-2xl border-amber-100 shadow-sm`, vertical: icon tile `w-11 h-11 rounded-xl` with module tint (orange-100/saffron, yellow-100/amber-600, indigo-100/indigo-600, amber-100/amber-700, red-100/red-600, blue-100/blue-600) + label `text-[11px] font-semibold`. Hover: bg `amber-50`, icon `scale-110`. Touch target ≥ 44px.

### 5.4 Saint / Profile Card
Horizontal: `w-16 h-16 rounded-full object-cover border-2 border-gold` avatar with absolute "QR Verified" chip (`bg-saffron text-white text-[8px] rounded-full`) + text column (maroon title, gray-600 meta, italic amber-800 quote) + pill CTA.

### 5.5 Modal (Dialog)
Overlay `bg-black/60 z-50`. Sheet `max-w-sm w-full rounded-3xl p-5 space-y-3/4 shadow-2xl`, close ✕ top-right (`gray-400 → gray-600`), scrollable variant adds `max-h-[85vh] overflow-y-auto`. Primary action = full-width saffron button. Radix Dialog for focus trap; Escape + overlay click close.

### 5.6 Buttons
| Variant | Style |
|---|---|
| Primary | `bg-saffron hover:bg-deepSaffron text-white text-xs font-bold rounded-xl py-2.5 shadow` |
| Secondary/indigo | same shape, `bg-indigo-600` (AI/volunteer actions) |
| Memorial | `bg-stone-800 hover:bg-stone-900` |
| Nature | `bg-emerald-600 hover:bg-emerald-700` |
| Ghost/quiet | `bg-gray-200 text-gray-700` |
| Price chip | `bg-saffron text-white rounded-lg font-bold px-2.5 py-1` (never animated) |

### 5.7 List Rows (nearby temples, directory)
`bg-amber-50 rounded-xl border-amber-200 p-2.5–3` rows with bold name + `text-[10px] gray-500` meta, gap-2 stack.

### 5.8 Live / Status Badges
LIVE: `bg-red-600 text-white text-[9px] rounded-full font-bold px-2 py-0.5 animate-pulse` + "●" prefix. Verified: `bg-green-100 text-green-700 font-bold rounded-full text-[9px–10px]`. Tag chip (प्रश्न): `bg-amber-50 text-saffron font-bold rounded-full`.

### 5.9 Audio Player Band
Dark gradient band, left pulsing `w-10 h-10 rounded-full bg-gold text-maroonText` music disc, two-line text (`text-[10px] text-gold tracking-wider` label + `text-xs font-bold` title), right `w-8 h-8 rounded-full bg-saffron` play/pause with icon swap.

### 5.10 Bottom Navigation
Fixed white bar, `border-t border-amber-200 shadow-lg`, 5 items (icon `text-base` + label `text-[10px]`): होम `house`, गौ-सेवा `cow`, ग्रंथ `book-open`, जिज्ञासा `comments`, मेनू `gear`. Active = `text-saffron font-bold`; inactive `text-gray-500 hover:text-saffron`. Lucide equivalents: `House`, `Beef`/`Leaf`, `BookOpen`, `MessagesSquare`, `Settings`.

## 6. Iconography
lucide-react only. Module mapping: लाइव दर्शन `Video`, कुंभ `Landmark`, AI `Bot`, गौ सेवा `Beef` or `Milk`, स्टोर `Store`, संत बुकिंग `HousePlug`→`Home`, गाड़ी पूजन `Car`, नामकरण `Baby`, वृक्षारोपण `TreePine`, चारा `Wheat`, सूचना `Bell`, स्मृति `Image`, स्थान `MapPin`, जप माला counter is text (no bead icon needed). **ॐ** is a glyph, rendered in text, never as an icon font.

## 7. Motion
Durations 150–300ms, `transition` default easing. Allowed: hover bg shifts, `scale-110` icon tiles, `animate-pulse` on LIVE/music disc only, gentle `animate-bounce` on the darshan play glyph. Forbidden: confetti, spinners on sacred imagery, parallax, shake, marquee.

## 8. Imagery Rules
Only approved saint photos (prototype URLs for Golden Baba & Swami Chinmayananda are seeded references). No AI-generated deity faces. Store product tiles use icon tiles (`bg-amber-50` block + module icon) until real photography is supplied. Memorial section: never decorative, stone palette, no hover animations.

## 9. Empty / Loading / Error States (Hindi, per pattern)
- Loading: skeleton `animate-pulse bg-amber-50` blocks, never spinners over sacred content.
- Empty: centered `text-xs text-gray-500` with respectful line, e.g. "जल्द ही उपलब्ध होगा।" + retry ghost button.
- Error: `red-700` inline text under field (forms) or toast (actions): "कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।"

## 10. Accessibility Checklist (per PR)
- [ ] Every icon-only button has Hindi `aria-label`
- [ ] Modal traps focus, closes on Esc, returns focus to opener
- [ ] Touch targets ≥ 44px (grid tiles, nav items, list rows)
- [ ] Body text contrast ≥ 4.5:1 (check `text-[10px]` grays)
- [ ] Devanagari shaping intact — no letter-spacing on Devanagari (breaks matras); tracking only on Latin/labels where safe
- [ ] `prefers-reduced-motion` disables pulse/bounce
- [ ] Form errors announced (`aria-live="polite"`)

## 11. Tailwind v4 Token Bridge (globals.css)

```css
:root {
  --color-saffron: #FF6700;
  --color-deep-saffron: #D95300;
  --color-gold: #FFD700;
  --color-divine-bg: #FFF9F0;
  --color-card: #FFFFFF;
  --color-maroon: #4A1500;
}
@theme inline {
  --color-saffron: var(--color-saffron);
  --color-deepSaffron: var(--color-deep-saffron);
  --color-gold: var(--color-gold);
  --color-divineBg: var(--color-divine-bg);
  --color-cardBg: var(--color-card);
  --color-maroonText: var(--color-maroon);
}
body { background: var(--color-divine-bg); }
```

Class names in code (`text-maroonText`, `bg-divineBg`, `text-saffron`, `bg-gold`) must compile against these tokens so every doc/design reference stays truthful.

---

## 12. Design System v2 — "Warm Cream / Sacred Saffron" (2026-10-24, brief Phase 2)

> v2 supersedes the v1 hex values (ADR-003). Token **names** of v1 remain valid
> aliases; new components should prefer the v2 token names below.

### 12.1 Color tokens (brief-exact)

| Token | Hex | Usage |
|---|---|---|
| `cream` | `#FFF8F2` | Main background (60% visual weight with `surface`) |
| `surface` | `#FFFDF9` | Cards, panels, inputs |
| `charcoal` | `#1F1B18` | Primary text, footer background, structural elements |
| `muted` | `#6B625C` | Secondary text |
| `saffron` | `#FF7722` | Primary accent / important actions (~10% weight) |
| `saffronDeep` | `#D95300` | Hover / pressed states |
| `saffronSoft` | `#FFE4D1` | Soft tint chips, active nav pill (~5% with teal) |
| `teal` / `tealSoft` | `#0F766E` / `#E4F2F0` | Secondary accent, source links, nature module |
| `warmBorder` | `#F0E2D8` | Card borders |
| `footerBg` | `#1F1B18` | Footer band |
| `success` | `#157F3D` | Success / verification |
| `live` | `#E5484D` | Live indicator only |

### 12.2 Typography

- Headings: Playfair Display (`font-heading`), falls back to Noto Sans Devanagari for Devanagari text.
- Body: Inter (`font-body`) + Noto Sans Devanagari for Hindi.
- Hindi/Sanskrit scripture: `font-heading` + `lang="sa"` attribute.
- Minimum body size stays `text-xs` (12px) for UI copy; scripture quotes may go larger.

### 12.3 Component vocabulary

- Buttons: `rounded-full`, `min-h-11` (44px targets), saffron solid / bordered ghost.
- Cards: `rounded-2xl border-warmBorder bg-surface shadow-sm` (+ `hover:shadow-md`).
- Chips/badges: `rounded-full bg-saffronSoft` or `bg-tealSoft`.
- Focus: global `:focus-visible` 2px saffron outline (WCAG 2.2).
- Motion: hover lift/scale ≤1.03, 300ms; `prefers-reduced-motion` disables all.
- Unverified data: literal text "सत्यापित नहीं" in `text-muted` — never styled as fact.
