// Daily content rotation helpers (brief §6.1/§6.2) — deterministic picks keyed
// on the Asia/Kolkata day, so server and client always agree.

import { kolkataDayKey } from "@/lib/dates";

export function todayKey(): string {
  return kolkataDayKey(0);
}

/** Format a YYYY-MM-DD day key in long Hindi form, e.g. "24 अक्टूबर 2026". */
const HI_MONTHS = [
  "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर",
];

export function formatDayKeyHi(dayKey: string): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  if (!y || !m || !d) return dayKey;
  return `${d} ${HI_MONTHS[m - 1]} ${y}`;
}

/** Pick a deterministic element of a list for the given day. */
export function pickForDay<T>(items: T[], dayKey: string): T {
  const [, month, day] = dayKey.split("-");
  const seed = Number(month) * 31 + Number(day);
  return items[seed % items.length];
}
