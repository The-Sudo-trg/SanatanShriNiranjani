// Site-wide content index for /search (brief Phase 7). Local, database-free,
// no external dependency — sufficient at this content size. English and
// Devanagari both searchable via lowercase includes on all fields.

import { MANTRAS } from "@/lib/data/mantras";
import { WISDOM_ENTRIES } from "@/lib/data/wisdom";
import { FESTIVALS } from "@/lib/data/festivals";
import { TEMPLES } from "@/lib/data/temple-records";

export interface SearchItem {
  kind: "temple" | "mantra" | "festival" | "wisdom" | "page";
  slug: string;
  titleHi: string;
  titleEn?: string;
  /** extra searchable context (locality, deity, source, keywords) */
  meta: string;
  href: string;
  snippet: string;
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const t of TEMPLES) {
    items.push({
      kind: "temple",
      slug: t.slug,
      titleHi: t.nameHi,
      titleEn: t.officialName,
      meta: `${t.locality} ${t.city} ${t.deity}`,
      href: `/temples/${t.slug}`,
      snippet: t.descriptionHi,
    });
  }
  for (const m of MANTRAS) {
    items.push({
      kind: "mantra",
      slug: m.slug,
      titleHi: m.titleHi,
      titleEn: m.titleEn,
      meta: `${m.deity} ${m.transliteration} ${m.source}`,
      href: `/mantras#${m.slug}`,
      snippet: m.text,
    });
  }
  for (const f of FESTIVALS) {
    items.push({
      kind: "festival",
      slug: f.slug,
      titleHi: f.nameHi,
      titleEn: f.nameEn,
      meta: `${f.dateIso} ${f.tithi}`,
      href: `/festivals#${f.slug}`,
      snippet: f.significanceHi,
    });
  }
  for (const w of WISDOM_ENTRIES) {
    items.push({
      kind: "wisdom",
      slug: w.key,
      titleHi: w.sourceHi,
      titleEn: w.sourceEn,
      meta: w.meaningHi,
      href: "/daily-darshan",
      snippet: w.textHi,
    });
  }
  // static pages
  const pages: Array<[string, string, string]> = [
    ["/daily-darshan", "दैनिक दर्शन", "आज का मन्दिर दर्शन, प्रेरणा, पंचांग और आगामी पर्व"],
    ["/temples", "मंदिर सूची", "दिल्ली NCR के सत्यापित मन्दिर — पता, समय, मार्ग"],
    ["/festivals", "पर्व", "हिन्दू पर्वों की सत्यापित तिथियाँ एवं मार्गदर्शिका"],
    ["/mantras", "मंत्र", "मंत्र-स्तोत्र संग्रह — पाठ, उच्चारण, अर्थ"],
    ["/granth", "ग्रंथ", "श्रीमद्भगवद्गीता पाठ एवं डिजिटल जप माला"],
    ["/gau-seva", "गौ सेवा", "गौ-दर्शन, चारा सेवा, स्मृति वृक्षारोपण"],
    ["/store", "पूजा स्टोर", "पूजा सामग्री — गंगाजल, रुद्राक्ष माला"],
    ["/kumbh-2027", "महाकुम्भ 2027", "कुम्भ-नेविगेटर — तिथि, स्नान, मार्गदर्शन"],
    ["/about", "परिचय", "सनातन श्री निरंजनी — श्री पंचायती अखाड़ा निरंजनी"],
  ];
  for (const [href, titleHi, snippet] of pages) {
    items.push({ kind: "page", slug: href, titleHi, meta: href, href, snippet });
  }

  return items;
}

export interface SearchHit extends SearchItem {
  score: number;
}

/** Score results: title match > meta match > snippet match. */
export function searchContent(index: SearchItem[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const hits: SearchHit[] = [];
  for (const item of index) {
    const title = `${item.titleHi} ${item.titleEn ?? ""}`.toLowerCase();
    const meta = item.meta.toLowerCase();
    const snippet = item.snippet.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (title.includes(term)) score += 10;
      if (meta.includes(term)) score += 4;
      if (snippet.includes(term)) score += 2;
    }
    if (score > 0) hits.push({ ...item, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 20);
}
