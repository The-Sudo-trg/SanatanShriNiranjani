"use client";

import Link from "@/i18n/navigation";
import { Heart, Trash2 } from "lucide-react";
import { useFavoritesStore, type FavItem } from "@/lib/favorites";
import { localeCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/i18n";
import { TEMPLES } from "@/lib/data/temples";
import { MANTRAS } from "@/lib/data/mantras";
import { FESTIVALS } from "@/lib/data/festivals";
import { WISDOM_ENTRIES } from "@/lib/data/wisdom";

// Saved content (brief §6.5) — anonymous localStorage favorites with a clear
// way to remove items and clear all data.
const KIND_LABEL: Record<FavItem["kind"], string> = {
  temple: "मन्दिर",
  mantra: "मंत्र",
  festival: "पर्व",
  wisdom: "प्रेरणा",
};

export default function SavedList({ locale }: { locale: Locale }) {
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  const items = useFavoritesStore((s) => s.items);
  const hydrated = useFavoritesStore((s) => s.hydrated);
  const remove = useFavoritesStore((s) => s.remove);
  const clearAll = useFavoritesStore((s) => s.clearAll);
  const itemTitle = (item: FavItem) => {
    if (locale === "hi") return item.titleHi;
    if (item.kind === "temple") return TEMPLES.find((record) => record.slug === item.slug)?.officialName ?? "[Title translation to be confirmed]";
    if (item.kind === "mantra") return MANTRAS.find((record) => record.slug === item.slug)?.titleEn ?? "[Title translation to be confirmed]";
    if (item.kind === "festival") return FESTIVALS.find((record) => record.slug === item.slug)?.nameEn ?? "[Title translation to be confirmed]";
    return WISDOM_ENTRIES.find((record) => record.key === item.slug)?.sourceEn ?? "[Title translation to be confirmed]";
  };

  if (!hydrated) {
    return <p className="text-sm text-muted">{c("सूची लोड हो रही है…", "Loading saved items…")}</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-warmBorder bg-surface p-10 text-center">
        <Heart className="mx-auto h-8 w-8 text-saffron/60" aria-hidden />
        <p className="mt-3 font-heading text-lg font-bold text-charcoal">{c("अभी कुछ सेव नहीं किया", "No saved items yet")}</p>
        <p className="mt-1 text-sm text-muted">
          {c("मन्दिर, मंत्र या पर्व पर \"सेव करें\" दबाकर यहाँ अपनी सूची बनाएँ। सूची केवल आपके उपकरण पर रहती है।", "Save a temple, mantra, or festival to build your list here. It stays on your device.")}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/temples" className="rounded-full bg-saffron px-4 py-2 text-xs font-bold text-white hover:bg-saffronDeep">
            {c("मंदिर देखें", "Browse temples")}
          </Link>
          <Link href="/mantras" className="rounded-full border border-warmBorder bg-cream px-4 py-2 text-xs font-medium text-charcoal hover:border-saffron">
            {c("मंत्र देखें", "Browse mantras")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{locale === "en" ? `${items.length} saved items` : `${items.length} चीज़ें सेव हैं`}</p>
        <button suppressHydrationWarning
          type="button"
          onClick={() => {
            if (confirm(c("सभी सेव किया हुआ हटाएँ? यह पूरी सूची मिटा देगा।", "Remove all saved items? This will clear the entire list."))) clearAll();
          }}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-warmBorder bg-cream px-3 py-1.5 text-xs font-medium text-live transition hover:border-live"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          {c("सब हटाएँ", "Clear all")}
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={`${item.kind}:${item.slug}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-warmBorder bg-surface p-4"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal">
                {locale === "en"
                  ? { temple: "Temple", mantra: "Mantra", festival: "Festival", wisdom: "Reflection" }[item.kind]
                  : KIND_LABEL[item.kind]}
              </p>
              <Link href={item.href} className="block truncate font-bold text-charcoal hover:text-saffron">
                {itemTitle(item)}
              </Link>
            </div>
            <button suppressHydrationWarning
              type="button"
              onClick={() => remove(item.kind, item.slug)}
              aria-label={`${c("हटाएँ", "Remove")}: ${itemTitle(item)}`}
              className="min-h-11 min-w-11 rounded-full p-2.5 text-muted transition hover:bg-saffronSoft hover:text-live"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
