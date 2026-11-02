"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import TempleCard from "@/components/site/TempleCard";
import { TEMPLE_CATEGORIES, type Temple } from "@/lib/data/temples";
import { currentPosition, haversineKm } from "@/lib/geo";
import { localeCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/i18n";

// Temple directory client (brief §5): debounced search by name/locality/city,
// category filter, name sort or distance sort with optional permission.
type SortMode = "name" | "distance";

export default function TempleDirectory({
  temples,
  initialCategory,
  locale,
}: {
  temples: Temple[];
  initialCategory?: string;
  locale: Locale;
}) {
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [sort, setSort] = useState<SortMode>("name");
  const [distances, setDistances] = useState<Record<string, number> | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "asking" | "ok" | "denied">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(query.trim().toLowerCase()), 250);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  async function locate() {
    setGeoState("asking");
    const pos = await currentPosition();
    if (!pos) {
      setGeoState("denied");
      return;
    }
    const next: Record<string, number> = {};
    for (const t of temples) {
      next[t.slug] = haversineKm(pos.coords.latitude, pos.coords.longitude, t.lat, t.lng);
    }
    setDistances(next);
    setSort("distance");
    setGeoState("ok");
  }

  const results = useMemo(() => {
    let list = temples;
    if (category) list = list.filter((t) => t.category === category);
    if (debounced) {
      list = list.filter((t) =>
        [t.officialName, t.nameHi, t.altName ?? "", t.locality, t.city, t.deity]
          .join(" ")
          .toLowerCase()
          .includes(debounced)
      );
    }
    if (sort === "distance" && distances) {
      list = [...list].sort((a, b) => (distances[a.slug] ?? 9e9) - (distances[b.slug] ?? 9e9));
    } else {
      list = [...list].sort((a, b) => a.officialName.localeCompare(b.officialName));
    }
    return list;
  }, [temples, category, debounced, sort, distances]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input suppressHydrationWarning
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={c("मन्दिर, स्थान या शहर खोजें…", "Search temples, locality, or city…")}
            aria-label={c("मन्दिर खोजें", "Search temples")}
            className="w-full rounded-full border border-warmBorder bg-surface py-2.5 pl-9 pr-9 text-sm text-charcoal placeholder:text-muted focus:border-saffron focus:outline-none"
          />
          {query && (
            <button suppressHydrationWarning
              type="button"
              onClick={() => setQuery("")}
              aria-label={c("खोज साफ़ करें", "Clear search")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted hover:text-charcoal"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label={c("श्रेणी से छानें", "Filter by category")}
          className="rounded-full border border-warmBorder bg-surface px-4 py-2.5 text-sm text-charcoal focus:border-saffron focus:outline-none"
        >
          <option value="">{c("सभी श्रेणियाँ", "All categories")}</option>
          {TEMPLE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {locale === "en" ? c.labelEn : c.labelHi}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          aria-label={c("क्रम", "Sort")}
          className="rounded-full border border-warmBorder bg-surface px-4 py-2.5 text-sm text-charcoal focus:border-saffron focus:outline-none"
        >
          <option value="name">{c("नाम से", "By name")}</option>
          <option value="distance" disabled={!distances}>
            {c("दूरी से", "By distance")}
          </option>
        </select>
        {distances === null && (
          <button suppressHydrationWarning
            type="button"
            onClick={locate}
            disabled={geoState === "asking"}
            className="min-h-11 rounded-full border border-warmBorder bg-cream px-4 py-2.5 text-xs font-medium text-teal transition hover:border-teal disabled:opacity-60"
          >
            {geoState === "asking"
              ? c("स्थान प्राप्त कर रहे हैं…", "Getting your location…")
              : c("नज़दीकी क्रम हेतु स्थान", "Use location to sort nearby")}
          </button>
        )}
      </div>

      {geoState === "denied" && (
        <p role="status" className="rounded-xl border border-warmBorder bg-cream p-3 text-xs text-muted">
          {c("स्थान की अनुमति नहीं मिली — बिना दूरी के भी पूरी सूची उपलब्ध है।", "Location permission was not granted. The full directory is still available without distance sorting.")}
        </p>
      )}

      <p aria-live="polite" role="status" className="text-xs text-muted">
        {locale === "en" ? `${results.length} temples found` : `${results.length} मन्दिर मिले`}
      </p>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-warmBorder bg-surface p-10 text-center">
          <p className="font-heading text-lg font-bold text-charcoal">{c("कोई मन्दिर नहीं मिला", "No temples found")}</p>
          <p className="mt-1 text-sm text-muted">{c("खोज बदलकर देखें या सभी श्रेणियाँ चुनें।", "Change your search or select all categories.")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <TempleCard key={t.slug} temple={t} distanceKm={distances?.[t.slug] ?? null} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
