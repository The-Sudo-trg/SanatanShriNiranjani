"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useFavoritesStore, isSaved, type FavKind } from "@/lib/favorites";

// Shared save-to-favorites control (brief §4.4/§6.5). Local-only (no account):
// state lives in localStorage via the favorites store. aria-pressed + toast
// feedback; SSR renders the un-saved state and hydrates after mount.
export default function FavoriteButton({
  kind,
  slug,
  titleHi,
  href,
  label = "सेव करें",
  className = "",
}: {
  kind: FavKind;
  slug: string;
  titleHi: string;
  href: string;
  label?: string;
  className?: string;
}) {
  const items = useFavoritesStore((s) => s.items);
  const hydrated = useFavoritesStore((s) => s.hydrated);
  const toggle = useFavoritesStore((s) => s.toggle);
  const saved = hydrated && isSaved(items, kind, slug);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `सेव से हटाएँ: ${titleHi}` : `${label}: ${titleHi}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ kind, slug, titleHi, href });
        toast.success(saved ? "सेव से हटा दिया गया" : "आपकी सूची में सेव हो गया");
      }}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        saved
          ? "border-saffron bg-saffronSoft text-charcoal"
          : "border-warmBorder bg-surface text-muted hover:border-saffron hover:text-charcoal"
      } ${className}`}
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-saffron text-saffron" : ""}`} aria-hidden />
      <span>{saved ? "सेव है" : label}</span>
    </button>
  );
}
