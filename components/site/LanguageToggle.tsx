"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Languages } from "lucide-react";

import { t, type Locale } from "@/lib/i18n";

/**
 * Change locale with client navigation. next-intl updates NEXT_LOCALE and keeps
 * the current route, query and fragment without a document reload.
 */
export default function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const next: Locale = locale === "hi" ? "en" : "hi";

  function switchLanguage() {
    router.push(`${pathname}${window.location.search}${window.location.hash}`, { locale: next });
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
        {next === "hi" ? "HI" : "EN"}
      </span>
    </button>
  );
}
