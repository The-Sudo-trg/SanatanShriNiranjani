"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Heart, LogOut, Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useModalStore } from "@/stores/modals";
import { useCartStore, selectCartBadge } from "@/stores/cart";
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";
import { t, type Locale } from "@/lib/i18n";
import LanguageToggle from "./LanguageToggle";

export interface HeaderUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Site header v3: cream bar, brand, desktop nav, language toggle, account state.
// - Top nav keeps दैनिक दर्शन / मंदिर / पर्व / मंत्र (ज्ञान removed by owner request;
//   the /granth page stays reachable from home tiles and the footer).
// - Auth: logged out → लॉग इन / पंजीकरण; logged in → profile + logout.
// - Mobile: brand truncates, search/heart move into the section nav & menu page,
//   language toggle + bell + cart + account always visible (≥44px targets).
// suppressHydrationWarning on controls: browser extensions add attributes like
// `fdprocessedid` before hydration (the reported console error).
const NAV_KEYS = ["nav.daily", "nav.temples", "nav.festivals", "nav.mantras"] as const;
const NAV_HREFS = ["/daily-darshan", "/temples", "/festivals", "/mantras"] as const;

export default function Header({ locale, user }: { locale: Locale; user: HeaderUser | null }) {
  const openModal = useModalStore((s) => s.open);
  const cartBadge = useCartStore(selectCartBadge);
  const pathname = usePathname();
  const router = useRouter();
  const [unread, setUnread] = useState<number | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

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

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "";
  const initial = user?.name?.trim()?.[0] ?? "ॐ";

  return (
    <header className="sticky top-0 z-30 border-b border-warmBorder bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2" aria-label={APP_NAME}>
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-saffron text-lg font-bold text-white shadow-sm"
          >
            ॐ
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-heading text-sm font-bold text-charcoal sm:text-lg">
              {APP_NAME}
            </span>
            <span className="hidden text-[10px] tracking-wider text-muted sm:block">
              {APP_SUBTITLE}
            </span>
          </span>
        </Link>

        <nav aria-label={t(locale, "header.navAria")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_HREFS.map((href, i) => {
              const active = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-full px-3 text-sm transition ${
                      active
                        ? "bg-saffronSoft font-bold text-charcoal"
                        : "text-muted hover:bg-saffronSoft/50 hover:text-charcoal"
                    }`}
                  >
                    {t(locale, NAV_KEYS[i])}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <LanguageToggle locale={locale} />
          <Link
            href="/search"
            aria-label={t(locale, "header.search")}
            suppressHydrationWarning
            className="hidden h-11 w-11 items-center justify-center rounded-full text-charcoal transition hover:bg-saffronSoft/50 sm:flex"
          >
            <Search className="h-5 w-5" aria-hidden />
          </Link>
          <Link
            href="/saved"
            aria-label={t(locale, "header.saved")}
            suppressHydrationWarning
            className="hidden h-11 w-11 items-center justify-center rounded-full text-charcoal transition hover:bg-saffronSoft/50 md:flex"
          >
            <Heart className="h-5 w-5" aria-hidden />
          </Link>
          <button
            type="button"
            aria-label={t(locale, "header.notifications")}
            onClick={() => openModal("NOTIFICATION")}
            suppressHydrationWarning
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition hover:bg-saffronSoft/50"
          >
            <Bell className="h-5 w-5" aria-hidden />
            {unread !== null && unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-live text-[9px] font-bold text-white shadow">
                {unread}
              </span>
            )}
          </button>
          <Link
            href="/store"
            aria-label={t(locale, "header.cart")}
            suppressHydrationWarning
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition hover:bg-saffronSoft/50"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden />
            {cartBadge > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-saffron text-[9px] font-bold text-white shadow">
                {cartBadge}
              </span>
            )}
          </Link>
          <Link
            href={user ? "/profile" : "/login"}
            aria-label={user ? t(locale, "header.profile") : t(locale, "header.login")}
            suppressHydrationWarning
            className={`flex h-11 items-center justify-center rounded-full text-charcoal transition hover:bg-saffronSoft/50 lg:hidden ${
              user ? "w-11" : "min-w-11 bg-saffronSoft px-3 text-xs font-bold"
            }`}
          >
            {user ? (
              <span
                aria-hidden
                className="flex h-7 w-7 items-center justify-center rounded-full bg-saffronSoft text-xs font-bold text-maroonText"
              >
                {initial}
              </span>
            ) : (
              <span>{t(locale, "header.login")}</span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-1 lg:flex">
              <Link
                href="/profile"
                className="flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold text-charcoal transition hover:bg-saffronSoft/50"
              >
                <span
                  aria-hidden
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-saffronSoft text-xs font-bold text-maroonText"
                >
                  {initial}
                </span>
                <span className="max-w-32 truncate">{firstName}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                disabled={loggingOut}
                aria-label={t(locale, "header.logout")}
                title={t(locale, "header.logout")}
                suppressHydrationWarning
                className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:bg-saffronSoft/50 hover:text-charcoal disabled:opacity-50"
              >
                <LogOut className="h-5 w-5" aria-hidden />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/login"
                className="flex min-h-11 items-center rounded-full px-3 text-sm font-bold text-charcoal transition hover:bg-saffronSoft/50"
              >
                {t(locale, "header.login")}
              </Link>
              <Link
                href="/register"
                className="flex min-h-11 items-center rounded-full bg-saffron px-4 text-sm font-bold text-white shadow-sm transition hover:bg-saffronDeep"
              >
                {t(locale, "header.register")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
