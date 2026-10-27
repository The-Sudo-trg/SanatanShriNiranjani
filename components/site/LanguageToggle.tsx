"use client";

import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";

import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  t,
  type Locale,
} from "@/lib/i18n";

/**
 * Language toggle (top bar). Writes the first-party `sn_lang` cookie and
 * refreshes the Server Components so the whole shell re-renders in the chosen
 * language immediately — no flash, survives reload/navigation for one year.
 */
export default function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const next: Locale = locale === "hi" ? "en" : "hi";

  function switchLanguage() {
    document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={switchLanguage}
      aria-label={t(locale, "lang.switchTo")}
      title={t(locale, "lang.switchTo")}
      // Browser extensions can inject attributes (e.g. fdprocessedid) before React
      // hydrates; suppress the warning on this third-party-affected control only.
      suppressHydrationWarning
      className="flex h-11 min-w-11 items-center justify-center gap-1 rounded-full px-2 text-charcoal transition hover:bg-saffronSoft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
    >
      <Languages className="h-5 w-5" aria-hidden />
      <span className="text-[11px] font-bold" aria-hidden>
        {t(next, "lang.short")}
      </span>
    </button>
  );
}
