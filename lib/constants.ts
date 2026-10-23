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

export const GOLDEN_BABA_PHOTO =
  "https://media.assettype.com/truescoopnews%2Fimport%2Fnews%2F1737719278207.webp?w=480&auto=format%2Ccompress&fit=max";
export const SOUTH_SAINTS_PHOTO =
  "https://keralaheritage.org/arable/images/Spiritual/SwamyChinmayanandaSaraswathy.jpg";

// Global search keyword routing (NAVIGATION §5 — first match wins, in this order)
export const SEARCH_ROUTES: Array<{ pattern: RegExp; modal: string }> = [
  { pattern: /मंदिर/, modal: "NEARBY" },
  { pattern: /गाड़ी/, modal: "GADI_PUJA" },
  { pattern: /नामकरण/, modal: "NAMKARAN" },
  { pattern: /संत|महामंडलेश्वर/, modal: "AKHARA_DIRECTORY" },
];
