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

// डेस्कटॉप nav rail (≥lg) — same 5 tabs as BottomNav (NAVIGATION §2), rendered as
// an <aside> (NOT a second <nav> landmark). Hidden below lg; bottom bar takes over.
export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="मुख्य नेविगेशन (डेस्कटॉप)"
      className="hidden w-20 shrink-0 flex-col items-center gap-1 border-r border-amber-100 bg-amber-50/60 py-4 shadow-inner lg:flex"
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            suppressHydrationWarning
            className={`flex w-16 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 transition hover:bg-amber-100 ${
              active
                ? "bg-white font-bold text-saffron shadow-sm ring-1 ring-amber-200"
                : "text-gray-500 hover:text-saffron"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden />
            <span className="text-center text-[10px] leading-tight">{label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
