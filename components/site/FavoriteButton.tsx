"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useFavoritesStore, isSaved, type FavKind } from "@/lib/favorites";
import { localeCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/i18n";

// Shared save-to-favorites control (brief §4.4/§6.5). Local-only (no account):
// state lives in localStorage via the favorites store. aria-pressed + toast
// feedback; SSR renders the un-saved state and hydrates after mount.
export default function FavoriteButton({
  kind,
  slug,
  titleHi,
  href,
  label = "सेव करें",
  locale = "hi",
  className = "",
}: {
  kind: FavKind;
  slug: string;
  titleHi: string;
  href: string;
  label?: string;
  locale?: Locale;
  className?: string;
}) {
  const items = useFavoritesStore((s) => s.items);
  const hydrated = useFavoritesStore((s) => s.hydrated);
  const toggle = useFavoritesStore((s) => s.toggle);
  const saved = hydrated && isSaved(items, kind, slug);
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);

  return (
    <button suppressHydrationWarning
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `${c("सेव से हटाएँ", "Remove from saved")}: ${titleHi}` : `${locale === "en" && label === "सेव करें" ? "Save" : label}: ${titleHi}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ kind, slug, titleHi, href });
        toast.success(saved ? c("सेव से हटा दिया गया", "Removed from saved items") : c("आपकी सूची में सेव हो गया", "Added to your saved items"));
      }}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        saved
          ? "border-saffron bg-saffronSoft text-charcoal"
          : "border-warmBorder bg-surface text-muted hover:border-saffron hover:text-charcoal"
      } ${className}`}
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-saffron text-saffron" : ""}`} aria-hidden />
      <span>{saved ? c("सेव है", "Saved") : locale === "en" && label === "सेव करें" ? "Save" : label}</span>
    </button>
  );
}
