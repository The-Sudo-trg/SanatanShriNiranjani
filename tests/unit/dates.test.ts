import { describe, expect, it } from "vitest";
import { kolkataDayKey, daysUntil, relativeTimeHi } from "@/lib/dates";

// TESTING.md §13.4/§13.7 — Asia/Kolkata day keys, non-negative countdown
describe("kolkataDayKey", () => {
  it("returns YYYY-MM-DD in Asia/Kolkata", () => {
    expect(kolkataDayKey(0)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("shifts by offset days", () => {
    const a = new Date(kolkataDayKey(0));
    const b = new Date(kolkataDayKey(-1));
    expect(b.getTime()).toBeLessThanOrEqual(a.getTime());
  });
});

describe("daysUntil", () => {
  it("never returns negative for past dates", () => {
    expect(daysUntil("2000-01-01")).toBe(0);
  });

  it("never returns NaN for garbage", () => {
    expect(daysUntil("not-a-date")).toBe(0);
  });

  it("counts forward to a future date", () => {
    const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
    expect(daysUntil(future)).toBeGreaterThanOrEqual(9);
  });
});

describe("relativeTimeHi", () => {
  it("uses Hindi relative units", () => {
    expect(relativeTimeHi(new Date(Date.now() - 30_000))).toBe("अभी-अभी");
    expect(relativeTimeHi(new Date(Date.now() - 5 * 60_000))).toBe("5 मिनट पूर्व");
    expect(relativeTimeHi(new Date(Date.now() - 3 * 3600_000))).toBe("3 घंटे पूर्व");
    expect(relativeTimeHi(new Date(Date.now() - 2 * 24 * 3600_000))).toBe("2 दिन पूर्व");
  });
});
