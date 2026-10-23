"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Beef, BookOpen, House, MessagesSquare, Settings } from "lucide-react";

const TABS = [
  { href: "/", label: "होम", Icon: House },
  { href: "/gau-seva", label: "गौ-सेवा", Icon: Beef },
  { href: "/granth", label: "ग्रंथ", Icon: BookOpen },
  { href: "/jigyasu", label: "जिज्ञासा", Icon: MessagesSquare },
  { href: "/menu", label: "मेनू", Icon: Settings },
] as const;

// DESIGN.md §5.10 — fixed 5-tab bar, active saffron bold, ≥44px targets
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      suppressHydrationWarning
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-amber-200 bg-white px-3 py-2 shadow-lg lg:hidden"
      aria-label="मुख्य नेविगेशन"
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            suppressHydrationWarning
            className={`flex min-h-11 min-w-11 flex-col items-center justify-center px-2 transition ${
              active ? "text-saffron font-bold" : "text-gray-500 hover:text-saffron"
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
