"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { localeCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/i18n";

export default function ShareButton({
  title,
  locale,
}: {
  title: string;
  locale: Locale;
}) {
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(url);
      toast.success(c("लिंक कॉपी हो गया", "Link copied"));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error(c("लिंक साझा नहीं हो सका। कृपया फिर प्रयास करें।", "Could not share the link. Please try again."));
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-warmBorder bg-surface px-4 py-2 text-sm font-medium text-charcoal transition hover:border-saffron"
    >
      <Share2 className="h-4 w-4 text-teal" aria-hidden />
      {c("साझा करें", "Share")}
    </button>
  );
}
