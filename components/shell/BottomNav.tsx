"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Landmark, ScrollText, Settings, Sunrise } from "lucide-react";

import { t, type Locale, type MessageKey } from "@/lib/i18n";

// Tab set v2 (brief §3 IA): होम, दैनिक दर्शन, मंदिर, मंत्र, मेनू.
// Labels follow the locale cookie; content pages stay Hindi.
const TABS: ReadonlyArray<{ href: string; key: MessageKey; Icon: typeof House }> = [
  { href: "/", key: "bottom.home", Icon: House },
  { href: "/daily-darshan", key: "bottom.darshan", Icon: Sunrise },
  { href: "/temples", key: "bottom.temples", Icon: Landmark },
  { href: "/mantras", key: "bottom.mantras", Icon: ScrollText },
  { href: "/menu", key: "bottom.menu", Icon: Settings },
];

// Fixed 5-tab bar, active saffron bold, ≥44px targets; fixed (not absolute)
// since the v2 shell is a normal document flow site, not an app window.
export default function BottomNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-warmBorder bg-surface px-3 py-2 shadow-[0_-4px_12px_rgba(31,27,24,0.06)] lg:hidden"
      aria-label={t(locale, "bottom.aria")}
    >
      {TABS.map(({ href, key, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            suppressHydrationWarning
            className={`flex min-h-11 min-w-11 flex-col items-center justify-center px-2 transition ${
              active ? "font-bold text-saffron" : "text-muted hover:text-saffron"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className="mt-0.5 text-[10px]">{t(locale, key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
