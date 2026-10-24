// Temple directory — Delhi NCR. Data model per brief Phase 5: every factual
// field carries its verification state. Fields that could not be verified are
// omitted or null and must render as "Not verified" (सत्यापित नहीं) in the UI.
// `sources` + `lastVerified` are mandatory for every record.
import { TEMPLES } from "./temple-records";

// Convenience re-export (records live in temple-records.ts to keep this file
// focused on types + helpers).
export { TEMPLES };

export interface TemplePhoto {
  url: string;
  /** Commons / source page URL for attribution. */
  pageUrl: string;
  license: string;
  author: string;
  alt: string;
}

export interface Temple {
  slug: string;
  officialName: string;
  altName?: string | null;
  nameHi: string;
  deity: string;
  category: "SHAIVA" | "VAISHNAVA" | "SHAKTA" | "SWAMINARAYAN" | "GAUDIYA" | "OTHER";
  address: string;
  city: "New Delhi" | "Noida" | "Gurugram" | "Ghaziabad" | "Faridabad" | "Delhi";
  locality: string;
  lat: number;
  lng: number;
  website?: string | null;
  /** Verified visiting hours, or null → show "सत्यापित नहीं". */
  hours: string | null;
  weeklyClosure: string | null;
  photography: string | null;
  metro: string | null;
  parking: string | null;
  descriptionEn: string;
  descriptionHi: string;
  sources: string[];
  photo: TemplePhoto | null;
  lastVerified: string;
}

export const TEMPLE_CATEGORIES: Array<{ value: Temple["category"]; labelHi: string; labelEn: string }> = [
  { value: "SHAIVA", labelHi: "शैव (शिव)", labelEn: "Shiva" },
  { value: "VAISHNAVA", labelHi: "वैष्णव (विष्णु/कृष्ण)", labelEn: "Vishnu / Krishna" },
  { value: "SHAKTA", labelHi: "शाक्त (देवी)", labelEn: "Devi" },
  { value: "SWAMINARAYAN", labelHi: "स्वामिनारायण", labelEn: "Swaminarayan" },
  { value: "GAUDIYA", labelHi: "गौड़ीय (हरे कृष्ण)", labelEn: "Gaudiya (ISKCON)" },
  { value: "OTHER", labelHi: "अन्य / समन्वय", labelEn: "Other" },
];

export function findTemple(slug: string): Temple | undefined {
  return TEMPLES.find((t) => t.slug === slug);
}

export function templesByCategory(category: Temple["category"]): Temple[] {
  return TEMPLES.filter((t) => t.category === category);
}

/** Deterministic daily featured temple (daily darshan) by Asia/Kolkata day key. */
export function featuredTempleForDay(dayKey: string): Temple {
  const [, month, day] = dayKey.split("-");
  const seed = Number(month) * 31 + Number(day);
  return TEMPLES[seed % TEMPLES.length];
}
