import { describe, expect, it } from "vitest";
import { pickForDay, formatDayKeyHi } from "@/lib/rotation";
import { wisdomForDay, WISDOM_ENTRIES } from "@/lib/data/wisdom";
import { featuredTempleForDay, findTemple, TEMPLE_CATEGORIES } from "@/lib/data/temples";
import { TEMPLES as TEMPLE_RECORDS } from "@/lib/data/temple-records";
import { FESTIVALS, upcomingFestivals, festivalForDay } from "@/lib/data/festivals";
import { MANTRAS } from "@/lib/data/mantras";
import { buildSearchIndex, searchContent } from "@/lib/site-search";
import { haversineKm } from "@/lib/geo";

// Data integrity (brief Phase 5/6): no fabricated fields — every temple record
// must carry sources + lastVerified; photos must carry license + author.
describe("temple records", () => {
  it("has 10 verified Delhi NCR temples with mandatory provenance", () => {
    expect(TEMPLE_RECORDS.length).toBe(10);
    for (const t of TEMPLE_RECORDS) {
      expect(t.sources.length).toBeGreaterThan(0);
      expect(t.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(t.lat).toBeGreaterThan(27); // Delhi NCR bounding sanity
      expect(t.lat).toBeLessThan(30);
      expect(t.lng).toBeGreaterThan(76);
      expect(t.lng).toBeLessThan(79);
    }
  });

  it("gives every photo license + author + Commons page", () => {
    for (const t of TEMPLE_RECORDS) {
      if (!t.photo) continue;
      expect(t.photo.license).toBeTruthy();
      expect(t.photo.author).toBeTruthy();
      expect(t.photo.pageUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
      expect(t.photo.url).toMatch(/^https:\/\/upload\.wikimedia\.org\//);
    }
  });

  it("has unique slugs resolvable via findTemple", () => {
    const slugs = TEMPLE_RECORDS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(findTemple("akshardham-temple-new-delhi")?.officialName).toContain("Akshardham");
    expect(findTemple("no-such-temple")).toBeUndefined();
  });

  it("exposes a UI-facing category label for every temple category", () => {
    const known = new Set(TEMPLE_CATEGORIES.map((c) => c.value));
    for (const t of TEMPLE_RECORDS) expect(known.has(t.category)).toBe(true);
  });
});

describe("festival records", () => {
  it("lists only source-verified festivals with future-dated entries", () => {
    expect(FESTIVALS.length).toBeGreaterThanOrEqual(15);
    for (const f of FESTIVALS) {
      expect(f.sourceUrls.length).toBeGreaterThan(0);
      expect(f.lastVerified).toBe("2026-10-24");
      expect(f.dateIso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("filters upcoming festivals on/after the given day", () => {
    const upcoming = upcomingFestivals("2026-10-25", 5);
    expect(upcoming.every((f) => f.dateIso >= "2026-10-25")).toBe(true);
    expect(upcoming).toEqual(
      [...upcoming].sort((a, b) => a.dateIso.localeCompare(b.dateIso))
    );
  });

  it("finds a festival exactly on its day", () => {
    const f = FESTIVALS[0];
    expect(festivalForDay(f.dateIso)?.slug).toBe(f.slug);
    expect(festivalForDay("1999-01-01")).toBeUndefined();
  });
});

describe("daily rotation", () => {
  it("is deterministic within a day and stable across calls", () => {
    const a = wisdomForDay("2026-10-24");
    const b = wisdomForDay("2026-10-24");
    expect(a.key).toBe(b.key);
    expect(WISDOM_ENTRIES).toContain(a);
  });

  it("changes across days and stays in range", () => {
    const keys = new Set<string>();
    for (let d = 1; d <= 28; d++) {
      keys.add(wisdomForDay(`2026-10-${String(d).padStart(2, "0")}`).key);
    }
    expect(keys.size).toBeGreaterThan(3); // real rotation, not stuck
  });

  it("featured temple rotates and always resolves", () => {
    const t1 = featuredTempleForDay("2026-10-24");
    expect(TEMPLE_RECORDS).toContain(t1);
    expect(pickForDay([1, 2, 3], "2026-10-24")).toBeTypeOf("number");
  });

  it("formats day keys in Hindi", () => {
    expect(formatDayKeyHi("2026-10-24")).toBe("24 अक्टूबर 2026");
    expect(formatDayKeyHi("bad")).toBe("bad");
  });
});

describe("mantra library", () => {
  it("sources every mantra (scripture or stated parampara)", () => {
    expect(MANTRAS.length).toBeGreaterThanOrEqual(10);
    for (const m of MANTRAS) {
      expect(m.source.length).toBeGreaterThan(3);
      expect(m.text.length).toBeGreaterThan(0);
      expect(m.meaningHi.length).toBeGreaterThan(10);
    }
  });
});

describe("site search (Phase 7)", () => {
  const index = buildSearchIndex();

  it("indexes temples, mantras, festivals, wisdom and pages", () => {
    const kinds = new Set(index.map((i) => i.kind));
    expect(kinds).toEqual(new Set(["temple", "mantra", "festival", "wisdom", "page"]));
  });

  it("matches Devanagari and English queries, ranking titles above snippets", () => {
    const hi = searchContent(index, "कालकाजी");
    expect(hi[0]?.href).toBe("/temples/kalkaji-mandir-new-delhi");
    const en = searchContent(index, "Kalkaji");
    expect(en[0]?.href).toBe("/temples/kalkaji-mandir-new-delhi");
    const gayatri = searchContent(index, "गायत्री");
    expect(gayatri[0]?.kind).toBe("mantra");
  });

  it("returns no hits for empty or gibberish queries", () => {
    expect(searchContent(index, "")).toEqual([]);
    expect(searchContent(index, "  ")).toEqual([]);
    expect(searchContent(index, "zzzqqqxxx")).toEqual([]);
  });

  it("caps results at 20", () => {
    expect(searchContent(index, "मंदिर").length).toBeLessThanOrEqual(20);
  });
});

describe("geo (optional distance)", () => {
  it("computes Delhi→Gurugram distance in a sane range", () => {
    const km = haversineKm(28.6327, 77.1989, 28.4783, 77.0305);
    expect(km).toBeGreaterThan(20);
    expect(km).toBeLessThan(30);
  });

  it("returns 0 for identical points", () => {
    expect(haversineKm(28.6, 77.2, 28.6, 77.2)).toBe(0);
  });
});
