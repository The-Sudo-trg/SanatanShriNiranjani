"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Landmark, ScrollText, Settings, Sunrise } from "lucide-react";

// Tab set v2 (brief §3 IA): होम, दैनिक दर्शन, मंदिर, मंत्र, मेनू.
// गौ-सेवा / जिज्ञासा / ग्रंथ / स्टोर remain reachable from home cards, the
// desktop header, the menu page and the footer (no scope dropped).
const TABS = [
  { href: "/", label: "होम", Icon: House },
  { href: "/daily-darshan", label: "दर्शन", Icon: Sunrise },
  { href: "/temples", label: "मंदिर", Icon: Landmark },
  { href: "/mantras", label: "मंत्र", Icon: ScrollText },
  { href: "/menu", label: "मेनू", Icon: Settings },
] as const;

// Fixed 5-tab bar, active saffron bold, ≥44px targets; fixed (not absolute)
// since the v2 shell is a normal document flow site, not an app window.
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-warmBorder bg-surface px-3 py-2 shadow-[0_-4px_12px_rgba(31,27,24,0.06)] lg:hidden"
      aria-label="मुख्य नेविगेशन"
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 min-w-11 flex-col items-center justify-center px-2 transition ${
              active ? "font-bold text-saffron" : "text-muted hover:text-saffron"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className="mt-0.5 text-[10px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
