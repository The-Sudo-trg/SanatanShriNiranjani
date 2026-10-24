"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Heart, Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useModalStore } from "@/stores/modals";
import { useCartStore, selectCartBadge } from "@/stores/cart";
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";

// Site header v2 (brief §4.1): cream bar, brand, desktop nav, utility icons.
// Existing modals (notifications) and cart are preserved; profile → /menu.
const NAV_LINKS = [
  { href: "/daily-darshan", label: "दैनिक दर्शन" },
  { href: "/temples", label: "मंदिर" },
  { href: "/festivals", label: "पर्व" },
  { href: "/mantras", label: "मंत्र" },
  { href: "/granth", label: "ज्ञान" },
] as const;

export default function Header() {
  const openModal = useModalStore((s) => s.open);
  const cartBadge = useCartStore(selectCartBadge);
  const pathname = usePathname();
  const [unread, setUnread] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/api/notifications")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!cancelled && d) setUnread(d.unreadCount as number);
        })
        .catch(() => undefined);
    load();
    window.addEventListener("focus", load);
    // unread badge clears when the notification modal closes (marked read server-side)
    const unsub = useModalStore.subscribe((state) => {
      if (state.active === null) load();
    });
    return () => {
      cancelled = true;
      window.removeEventListener("focus", load);
      unsub();
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-warmBorder bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="मुख्य पृष्ठ">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron text-lg font-bold text-white shadow-sm"
          >
            ॐ
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-base font-bold text-charcoal sm:text-lg">
              {APP_NAME}
            </span>
            <span className="hidden text-[10px] tracking-wider text-muted sm:block">
              {APP_SUBTITLE}
            </span>
          </span>
        </Link>

        <nav aria-label="साइट पृष्ठ" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3 py-2 text-sm transition ${
                      active
                        ? "bg-saffronSoft font-bold text-charcoal"
                        : "text-muted hover:bg-saffronSoft/50 hover:text-charcoal"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="खोज पृष्ठ खोलें"
            className="rounded-full p-2.5 text-charcoal transition hover:bg-saffronSoft/50"
          >
            <Search className="h-5 w-5" aria-hidden />
          </Link>
          <Link
            href="/saved"
            aria-label="सेव किया हुआ"
            className="rounded-full p-2.5 text-charcoal transition hover:bg-saffronSoft/50"
          >
            <Heart className="h-5 w-5" aria-hidden />
          </Link>
          <button
            type="button"
            aria-label="सूचनाएँ"
            onClick={() => openModal("NOTIFICATION")}
            className="relative rounded-full p-2.5 text-charcoal transition hover:bg-saffronSoft/50"
          >
            <Bell className="h-5 w-5" aria-hidden />
            {unread !== null && unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-live text-[9px] font-bold text-white shadow">
                {unread}
              </span>
            )}
          </button>
          <Link
            href="/store"
            aria-label="पूजा स्टोर कार्ट"
            className="relative rounded-full p-2.5 text-charcoal transition hover:bg-saffronSoft/50"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden />
            {cartBadge > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-saffron text-[9px] font-bold text-white shadow">
                {cartBadge}
              </span>
            )}
          </Link>
          <Link
            href="/menu"
            aria-label="मेनू खोलें"
            className="rounded-full p-2.5 text-charcoal transition hover:bg-saffronSoft/50"
          >
            <span aria-hidden className="flex h-5 w-5 items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M4.5 20c1.5-3.5 4.2-5 7.5-5s6 1.5 7.5 5" strokeLinecap="round" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
