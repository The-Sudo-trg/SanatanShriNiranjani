"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Search, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import FavoriteButton from "@/components/site/FavoriteButton";
import { MANTRAS, type Mantra } from "@/lib/data/mantras";
import { TEMPLE_CATEGORIES } from "@/lib/data/temples";
import { localeCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/i18n";

// Mantra library (brief §6.3): searchable, adjustable text size, copy/share,
// traditional text clearly separated from editorial meaning. Audio is a
// documented v2 stub (no licensed recordings yet — shown as शीघ्र).
const CATEGORY_NAMES: Record<string, string> = {
  SHAIVA: "Shaiva (Shiva)",
  VAISHNAVA: "Vaishnava (Vishnu/Krishna)",
  DEVI: "Devi",
  GANESHA: "Ganesha",
  HANUMAN: "Hanuman",
  VEDIC: "Vedic",
  SHANTI: "Peace",
  GURU: "Guru",
};
const DEITY_NAMES_EN: Record<string, string> = {
  "सर्व देवता / All": "All deities",
  "सविता (सूर्य देव)": "Savita (solar deity)",
  "शिव": "Shiva",
  "कृष्ण / हरि": "Krishna / Hari",
  "विष्णु / वासुदेव": "Vishnu / Vasudeva",
};
const CATEGORIES: Array<{ value: string; labelHi: string; labelEn: string }> = [
  { value: "", labelHi: "सभी", labelEn: "All" },
  ...TEMPLE_CATEGORIES.filter((c) =>
    ["SHAIVA", "VAISHNAVA", "DEVI", "GANESHA", "HANUMAN", "VEDIC", "SHANTI", "GURU"].includes(c.value)
  ).map((c) => ({ value: c.value, labelHi: c.labelHi, labelEn: CATEGORY_NAMES[c.value] ?? c.labelEn })),
];

function MantraCard({ mantra, textPx, locale }: { mantra: Mantra; textPx: number; locale: Locale }) {
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  async function copy() {
    const payload = `${mantra.text}\n\n${locale === "en" ? mantra.meaningEn : mantra.meaningHi}\n\n— ${mantra.source}`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      toast.success(c("मंत्र कॉपी हो गया", "Mantra copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(c("कॉपी नहीं हो सका", "Could not copy"));
    }
  }

  return (
    <article className="rounded-2xl border border-warmBorder bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-charcoal">{locale === "en" ? mantra.titleEn : mantra.titleHi}</h2>
          <p className="text-xs text-muted">
            {locale === "en" ? DEITY_NAMES_EN[mantra.deity] ?? "[Deity name translation to be confirmed]" : mantra.titleEn}
          </p>
        </div>
        <FavoriteButton
          kind="mantra"
          slug={mantra.slug}
          titleHi={mantra.titleHi}
          href={`/mantras#${mantra.slug}`}
          locale={locale}
        />
      </div>

      <p
        id={`mantra-text-${mantra.slug}`}
        lang="sa"
        className="mt-4 font-heading leading-loose text-charcoal"
        style={{ fontSize: `${textPx}px` }}
      >
        {mantra.text}
      </p>
      <p className="mt-2 text-xs italic text-muted">{mantra.transliteration}</p>

      {open && (
        <div className="mt-4 space-y-3 border-t border-warmBorder pt-4">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-saffron">{c("अर्थ", "Meaning")}</h3>
            <p className="mt-1 text-sm leading-relaxed text-charcoal">{locale === "en" ? mantra.meaningEn : mantra.meaningHi}</p>
            {locale === "hi" && <p className="mt-2 text-xs leading-relaxed text-muted">{mantra.meaningEn}</p>}
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal">{c("स्रोत / परम्परा", "Source / tradition")}</h3>
            <p className="mt-1 text-xs text-charcoal">{mantra.source}</p>
          </div>
          <p className="rounded-xl bg-cream p-3 text-[11px] text-muted">
            {c("मूल पाठ परम्परागत है; अर्थ-व्याख्या सम्पादकीय है — पाठ से अलग रूप में दी गई है.", "The original text is traditional; the meaning is an editorial interpretation shown separately.")}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button suppressHydrationWarning
          type="button"
          onClick={copy}
          aria-label={c("मंत्र कॉपी करें", "Copy mantra")}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-warmBorder bg-cream px-3 py-1.5 text-xs font-medium text-charcoal transition hover:border-saffron"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          {c("कॉपी", "Copy")}
        </button>
        <button suppressHydrationWarning
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex min-h-11 items-center rounded-full border border-warmBorder bg-cream px-3 py-1.5 text-xs font-medium text-charcoal transition hover:border-saffron"
        >
          {open ? c("अर्थ छिपाएँ", "Hide meaning") : c("अर्थ एवं स्रोत देखें", "View meaning and source")}
        </button>
        <span
          className="inline-flex min-h-11 items-center rounded-full bg-cream px-3 py-1.5 text-[11px] text-muted"
          title={c("लाइसेंस-प्राप्त रिकॉर्डिंग उपलब्ध होने पर जोड़ी जाएगी", "Audio will be added when licensed recordings are available")}
        >
          {c("ऑडियो: शीघ्र (v2)", "Audio: coming soon (v2)")}
        </span>
      </div>
    </article>
  );
}

export default function MantraLibrary({ locale }: { locale: Locale }) {
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState("");
  const [textPx, setTextPx] = useState(20);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(query.trim().toLowerCase()), 250);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  const results = useMemo(() => {
    let list = MANTRAS;
    if (category) list = list.filter((m) => m.category === category);
    if (debounced) {
      list = list.filter((m) =>
        [m.titleHi, m.titleEn, m.deity, m.text, m.transliteration, m.source]
          .join(" ")
          .toLowerCase()
          .includes(debounced)
      );
    }
    return list;
  }, [category, debounced]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input suppressHydrationWarning
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={c("मंत्र खोजें (हिन्दी या English)…", "Search mantras in Hindi or English…")}
            aria-label={c("मंत्र खोजें", "Search mantras")}
            className="w-full rounded-full border border-warmBorder bg-surface py-2.5 pl-9 pr-4 text-sm text-charcoal placeholder:text-muted focus:border-saffron focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label={c("श्रेणी", "Category")}
          className="rounded-full border border-warmBorder bg-surface px-4 py-2.5 text-sm text-charcoal focus:border-saffron focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {locale === "en" ? c.labelEn : c.labelHi}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1.5" role="group" aria-label={c("पाठ आकार", "Text size")}>
          <button suppressHydrationWarning
            type="button"
            onClick={() => setTextPx((p) => Math.max(16, p - 2))}
            aria-label={c("पाठ छोटा करें", "Decrease text size")}
            className="min-h-11 min-w-11 rounded-full border border-warmBorder bg-surface p-2.5 text-charcoal transition hover:border-saffron"
          >
            <ZoomOut className="h-4 w-4" aria-hidden />
          </button>
          <button suppressHydrationWarning
            type="button"
            onClick={() => setTextPx((p) => Math.min(34, p + 2))}
            aria-label={c("पाठ बड़ा करें", "Increase text size")}
            className="min-h-11 min-w-11 rounded-full border border-warmBorder bg-surface p-2.5 text-charcoal transition hover:border-saffron"
          >
            <ZoomIn className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <p aria-live="polite" role="status" className="text-xs text-muted">
        {locale === "en" ? `${results.length} mantras` : `${results.length} मंत्र`}
      </p>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-warmBorder bg-surface p-10 text-center">
          <p className="font-heading text-lg font-bold text-charcoal">{c("कोई मंत्र नहीं मिला", "No mantras found")}</p>
          <p className="mt-1 text-sm text-muted">{c("दूसरा शब्द आज़माएँ या सभी श्रेणियाँ चुनें।", "Try another search or select all categories.")}</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((m) => (
            <MantraCard key={m.slug} mantra={m} textPx={textPx} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
