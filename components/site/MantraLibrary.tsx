"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Search, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import FavoriteButton from "@/components/site/FavoriteButton";
import { MANTRAS, type Mantra } from "@/lib/data/mantras";
import { TEMPLE_CATEGORIES } from "@/lib/data/temples";

// Mantra library (brief §6.3): searchable, adjustable text size, copy/share,
// traditional text clearly separated from editorial meaning. Audio is a
// documented v2 stub (no licensed recordings yet — shown as शीघ्र).
const CATEGORIES: Array<{ value: string; labelHi: string }> = [
  { value: "", labelHi: "सभी" },
  ...TEMPLE_CATEGORIES.filter((c) =>
    ["SHAIVA", "VAISHNAVA", "DEVI", "GANESHA", "HANUMAN", "VEDIC", "SHANTI", "GURU"].includes(c.value)
  ).map((c) => ({ value: c.value, labelHi: c.labelHi })),
];

function MantraCard({ mantra, textPx }: { mantra: Mantra; textPx: number }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  async function copy() {
    const payload = `${mantra.text}\n\n${mantra.meaningHi}\n\n— ${mantra.source}`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      toast.success("मंत्र कॉपी हो गया");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("कॉपी नहीं हो सका");
    }
  }

  return (
    <article className="rounded-2xl border border-warmBorder bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-charcoal">{mantra.titleHi}</h2>
          <p className="text-xs text-muted">
            {mantra.titleEn} • {mantra.deity}
          </p>
        </div>
        <FavoriteButton
          kind="mantra"
          slug={mantra.slug}
          titleHi={mantra.titleHi}
          href={`/mantras#${mantra.slug}`}
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
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-saffron">अर्थ</h3>
            <p className="mt-1 text-sm leading-relaxed text-charcoal">{mantra.meaningHi}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{mantra.meaningEn}</p>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-teal">स्रोत / परम्परा</h3>
            <p className="mt-1 text-xs text-charcoal">{mantra.source}</p>
          </div>
          <p className="rounded-xl bg-cream p-3 text-[11px] text-muted">
            मूल पाठ परम्परागत है; अर्थ-व्याख्या सम्पादकीय है — पाठ से अलग रूप में दी गई है।
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copy}
          aria-label="मंत्र कॉपी करें"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-warmBorder bg-cream px-3 py-1.5 text-xs font-medium text-charcoal transition hover:border-saffron"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          कॉपी
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex min-h-11 items-center rounded-full border border-warmBorder bg-cream px-3 py-1.5 text-xs font-medium text-charcoal transition hover:border-saffron"
        >
          {open ? "अर्थ छिपाएँ" : "अर्थ एवं स्रोत देखें"}
        </button>
        <span
          className="inline-flex min-h-11 items-center rounded-full bg-cream px-3 py-1.5 text-[11px] text-muted"
          title="लाइसेंस-प्राप्त रिकॉर्डिंग उपलब्ध होने पर जोड़ी जाएगी"
        >
          ऑडियो: शीघ्र (v2)
        </span>
      </div>
    </article>
  );
}

export default function MantraLibrary() {
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
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="मंत्र खोजें (हिन्दी या English)…"
            aria-label="मंत्र खोजें"
            className="w-full rounded-full border border-warmBorder bg-surface py-2.5 pl-9 pr-4 text-sm text-charcoal placeholder:text-muted focus:border-saffron focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="श्रेणी"
          className="rounded-full border border-warmBorder bg-surface px-4 py-2.5 text-sm text-charcoal focus:border-saffron focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.labelHi}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1.5" role="group" aria-label="पाठ आकार">
          <button
            type="button"
            onClick={() => setTextPx((p) => Math.max(16, p - 2))}
            aria-label="पाठ छोटा करें"
            className="min-h-11 min-w-11 rounded-full border border-warmBorder bg-surface p-2.5 text-charcoal transition hover:border-saffron"
          >
            <ZoomOut className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setTextPx((p) => Math.min(34, p + 2))}
            aria-label="पाठ बड़ा करें"
            className="min-h-11 min-w-11 rounded-full border border-warmBorder bg-surface p-2.5 text-charcoal transition hover:border-saffron"
          >
            <ZoomIn className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <p aria-live="polite" role="status" className="text-xs text-muted">
        {results.length} मंत्र
      </p>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-warmBorder bg-surface p-10 text-center">
          <p className="font-heading text-lg font-bold text-charcoal">कोई मंत्र नहीं मिला</p>
          <p className="mt-1 text-sm text-muted">दूसरा शब्द आज़माएँ या सभी श्रेणियाँ चुनें।</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((m) => (
            <MantraCard key={m.slug} mantra={m} textPx={textPx} />
          ))}
        </div>
      )}
    </div>
  );
}
