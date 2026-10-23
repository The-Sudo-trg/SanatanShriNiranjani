"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ShoppingCart, UserRound } from "lucide-react";
import { useModalStore } from "@/stores/modals";
import { useCartStore, selectCartBadge } from "@/stores/cart";
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";

// DESIGN.md §5.1 — gradient header, ॐ gold disc, bell + unread badge, avatar → मेनू, global cart badge (NAV §7.4)
export default function Header() {
  const openModal = useModalStore((s) => s.open);
  const cartBadge = useCartStore(selectCartBadge);
  const router = useRouter();
  const [unread, setUnread] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d) setUnread(d.unreadCount as number);
      })
      .catch(() => undefined);
    const onFocus = () => {
      fetch("/api/notifications")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!cancelled && d) setUnread(d.unreadCount as number);
        })
        .catch(() => undefined);
    };
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // bell badge clears when the notification modal closes (marked read server-side)
  useEffect(() => {
    const unsub = useModalStore.subscribe((state) => {
      if (state.active === null) {
        fetch("/api/notifications")
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (d) setUnread(d.unreadCount as number);
          })
          .catch(() => undefined);
      }
    });
    return unsub;
  }, []);

  return (
    <header suppressHydrationWarning className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F0E2D8] bg-[#FFF8F2]/90 px-4 py-3 text-[#1F1B18] shadow-sm backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE4D1] text-lg font-bold text-[#E85F0C] shadow-inner sm:h-10 sm:w-10 sm:text-xl">
          ॐ
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight tracking-wide sm:text-lg">{APP_NAME}</h1>
          <p className="text-[10px] opacity-90 tracking-wider">{APP_SUBTITLE}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="सूचनाएँ"
          onClick={() => openModal("NOTIFICATION")}
          suppressHydrationWarning
          className="relative transition hover:text-gold"
        >
          <Bell className="h-5 w-5" />
          {unread !== null && unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-maroonText shadow">
              {unread}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label="पूजा स्टोर कार्ट"
          onClick={() => router.push("/store")}
          suppressHydrationWarning
          className="relative transition hover:text-gold"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartBadge > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-maroonText shadow">
              {cartBadge}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label="मेनू खोलें"
          onClick={() => router.push("/menu")}
          suppressHydrationWarning
          className="transition hover:text-gold"
        >
          <UserRound className="h-6 w-6" aria-hidden />
        </button>
      </div>
    </header>
  );
}
