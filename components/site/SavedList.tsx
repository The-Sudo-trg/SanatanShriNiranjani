"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useFavoritesStore, type FavItem } from "@/lib/favorites";

// Saved content (brief §6.5) — anonymous localStorage favorites with a clear
// way to remove items and clear all data.
const KIND_LABEL: Record<FavItem["kind"], string> = {
  temple: "मन्दिर",
  mantra: "मंत्र",
  festival: "पर्व",
  wisdom: "प्रेरणा",
};

export default function SavedList() {
  const items = useFavoritesStore((s) => s.items);
  const hydrated = useFavoritesStore((s) => s.hydrated);
  const remove = useFavoritesStore((s) => s.remove);
  const clearAll = useFavoritesStore((s) => s.clearAll);

  if (!hydrated) {
    return <p className="text-sm text-muted">सूची लोड हो रही है…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-warmBorder bg-surface p-10 text-center">
        <Heart className="mx-auto h-8 w-8 text-saffron/60" aria-hidden />
        <p className="mt-3 font-heading text-lg font-bold text-charcoal">अभी कुछ सेव नहीं किया</p>
        <p className="mt-1 text-sm text-muted">
          मन्दिर, मंत्र या पर्व पर &quot;सेव करें&quot; दबाकर यहाँ अपनी सूची बनाएँ। सूची केवल आपके
          उपकरण पर रहती है।
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/temples" className="rounded-full bg-saffron px-4 py-2 text-xs font-bold text-white hover:bg-saffronDeep">
            मंदिर देखें
          </Link>
          <Link href="/mantras" className="rounded-full border border-warmBorder bg-cream px-4 py-2 text-xs font-medium text-charcoal hover:border-saffron">
            मंत्र देखें
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{items.length} चीज़ें सेव हैं</p>
        <button
          type="button"
          onClick={() => {
            if (confirm("सभी सेव किया हुआ हटाएँ? यह पूरी सूची मिटा देगा।")) clearAll();
          }}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-warmBorder bg-cream px-3 py-1.5 text-xs font-medium text-live transition hover:border-live"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          सब हटाएँ
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
                {KIND_LABEL[item.kind]}
              </p>
              <Link href={item.href} className="block truncate font-bold text-charcoal hover:text-saffron">
                {item.titleHi}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => remove(item.kind, item.slug)}
              aria-label={`हटाएँ: ${item.titleHi}`}
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
