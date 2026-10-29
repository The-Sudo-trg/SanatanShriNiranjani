"use client";

import { useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { MapPin, Search } from "lucide-react";
import { useModalStore } from "@/stores/modals";
import { matchSearchKeyword } from "@/lib/search";
import { t, type Locale } from "@/lib/i18n";

// NAVIGATION §5 — keyword routing: Enter + debounce(300ms), first match wins, clear-on-open,
// no match → silent. Extended page keywords (§5 note): कुंभ/गौ/गीता/स्टोर.
const PAGE_ROUTES: Array<{ pattern: RegExp; path: string }> = [
  { pattern: /कुंभ/, path: "/kumbh-2027" },
  { pattern: /गौ/, path: "/gau-seva" },
  { pattern: /गीता/, path: "/granth" },
  { pattern: /स्टोर|पूजा सामग्री/, path: "/store" },
];

export default function SearchBar({ locale }: { locale: Locale }) {
  const [value, setValue] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openModal = useModalStore((s) => s.open);
  const router = useRouter();

  function evaluate(q: string) {
    const modal = matchSearchKeyword(q);
    if (modal) {
      openModal(modal);
      setValue("");
      return;
    }
    for (const route of PAGE_ROUTES) {
      if (route.pattern.test(q)) {
        router.push(route.path);
        setValue("");
        return;
      }
    }
  }

  function onChange(v: string) {
    setValue(v);
    if (timer.current) clearTimeout(timer.current);
    if (!v.trim()) return;
    timer.current = setTimeout(() => evaluate(v), 300);
  }

  return (
    <div className="flex items-center gap-2 border-b border-warmBorder bg-cream px-4 py-2">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") evaluate(value);
          }}
          placeholder={t(locale, "search.placeholder")}
          aria-label={t(locale, "search.label")}
          suppressHydrationWarning
          className="w-full rounded-full border border-warmBorder bg-surface py-2 pl-9 pr-4 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-saffron"
        />
      </div>
      <button
        type="button"
        onClick={() => openModal("NEARBY")}
        suppressHydrationWarning
        className="whitespace-nowrap rounded-full bg-saffron px-3 py-2 text-xs font-medium text-white shadow transition hover:bg-saffronDeep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
      >
        <MapPin className="mr-1 inline h-3 w-3" aria-hidden />
        {t(locale, "search.nearby")}
      </button>
    </div>
  );
}
