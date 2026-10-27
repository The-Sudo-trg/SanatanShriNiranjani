// Sacred business data (AGENT.md §2.2) — exact, never mutated at runtime.
export const PRICES = {
  GADI_PUJA: 501,
  TREE_PLANTATION: 501,
  CHARA_DAILY: 510,
  CHARA_MONTHLY: 2100,
  GANGAJAL: 151,
  RUDRAKSH_MALA: 351,
} as const;

export const TREE_TYPES = ["पीपल (Peepal)", "बरगद (Banyan)", "बेलपत्र (Belpatra)", "नीम / आंवला"] as const;

export const BOOKING_TYPES = {
  GADI_PUJA: "GADI_PUJA",
  NAMKARAN: "NAMKARAN",
  SANT: "SANT",
} as const;

export const GAU_KINDS = {
  TREE: "TREE",
  CHARA_DAILY: "CHARA_DAILY",
  CHARA_MONTHLY: "CHARA_MONTHLY",
} as const;

// Digital Bhakt ID — v1 static per-device (PRD §9.2)
export const BHAKT_ID = "SN-2027-9842";

export const APP_NAME = "सनातन श्री निरंजनी";
export const APP_SUBTITLE = "श्री पंचायती अखाड़ा निरंजनी";

// NOTE: the old GOLDEN_BABA_PHOTO / SOUTH_SAINTS_PHOTO hotlinks pointed at news
// CDNs and Kerala-heritage pages with unclear reuse rights. They were removed for
// production (no unlicensed hotlinking). Verified free-licensed photographs now
// live in lib/data/sadhus.ts (Wikimedia Commons, with attribution + licence).

// Global search keyword routing (NAVIGATION §5 — first match wins, in this order)
export const SEARCH_ROUTES: Array<{ pattern: RegExp; modal: string }> = [
  { pattern: /मंदिर/, modal: "NEARBY" },
  { pattern: /गाड़ी/, modal: "GADI_PUJA" },
  { pattern: /नामकरण/, modal: "NAMKARAN" },
  { pattern: /संत|महामंडलेश्वर/, modal: "AKHARA_DIRECTORY" },
];
