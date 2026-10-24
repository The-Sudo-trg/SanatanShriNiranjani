"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import TempleCard from "@/components/site/TempleCard";
import { TEMPLE_CATEGORIES, type Temple } from "@/lib/data/temples";
import { currentPosition, haversineKm } from "@/lib/geo";

// Temple directory client (brief §5): debounced search by name/locality/city,
// category filter, name sort or distance sort with optional permission.
type SortMode = "name" | "distance";

export default function TempleDirectory({
  temples,
  initialCategory,
}: {
  temples: Temple[];
  initialCategory?: string;
}) {
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
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="मन्दिर, स्थान या शहर खोजें…"
            aria-label="मन्दिर खोजें"
            className="w-full rounded-full border border-warmBorder bg-surface py-2.5 pl-9 pr-9 text-sm text-charcoal placeholder:text-muted focus:border-saffron focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="खोज साफ़ करें"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted hover:text-charcoal"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="श्रेणी से छानें"
          className="rounded-full border border-warmBorder bg-surface px-4 py-2.5 text-sm text-charcoal focus:border-saffron focus:outline-none"
        >
          <option value="">सभी श्रेणियाँ</option>
          {TEMPLE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.labelHi}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          aria-label="क्रम"
          className="rounded-full border border-warmBorder bg-surface px-4 py-2.5 text-sm text-charcoal focus:border-saffron focus:outline-none"
        >
          <option value="name">नाम से</option>
          <option value="distance" disabled={!distances}>
            दूरी से
          </option>
        </select>
        {distances === null && (
          <button
            type="button"
            onClick={locate}
            disabled={geoState === "asking"}
            className="min-h-11 rounded-full border border-warmBorder bg-cream px-4 py-2.5 text-xs font-medium text-teal transition hover:border-teal disabled:opacity-60"
          >
            {geoState === "asking" ? "स्थान प्राप्त कर रहे हैं…" : "नज़दीकी क्रम हेतु स्थान"}
          </button>
        )}
      </div>

      {geoState === "denied" && (
        <p role="status" className="rounded-xl border border-warmBorder bg-cream p-3 text-xs text-muted">
          स्थान की अनुमति नहीं मिली — बिना दूरी के भी पूरी सूची उपलब्ध है।
        </p>
      )}

      <p aria-live="polite" role="status" className="text-xs text-muted">
        {results.length} मन्दिर मिले
      </p>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-warmBorder bg-surface p-10 text-center">
          <p className="font-heading text-lg font-bold text-charcoal">कोई मन्दिर नहीं मिला</p>
          <p className="mt-1 text-sm text-muted">खोज बदलकर देखें या सभी श्रेणियाँ चुनें।</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <TempleCard key={t.slug} temple={t} distanceKm={distances?.[t.slug] ?? null} />
          ))}
        </div>
      )}
    </div>
  );
}
