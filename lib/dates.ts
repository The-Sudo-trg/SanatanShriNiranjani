// Asia/Kolkata anchored date helpers (TESTING.md §13.4 / §13.7)
export function kolkataDayKey(offsetDays = 0): string {
  const now = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// Whole days from now until target (never negative / NaN) — Kumbh countdown
export function daysUntil(target: Date | string): number {
  const t = target instanceof Date ? target : new Date(target);
  if (Number.isNaN(t.getTime())) return 0;
  const ms = t.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

// Relative Hindi timestamp for forum/chat feeds
export function relativeTimeHi(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  const mins = Math.max(0, Math.floor((Date.now() - d.getTime()) / 60000));
  if (mins < 1) return "अभी-अभी";
  if (mins < 60) return `${mins} मिनट पूर्व`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} घंटे पूर्व`;
  const days = Math.round(hours / 24);
  return `${days} दिन पूर्व`;
}
