"use client";

import { useState } from "react";
import Link from "@/i18n/navigation";
import {
  HeartHandshake,
  LogIn,
  ScrollText,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";

import LogoutButton from "@/components/auth/LogoutButton";
import DigitalId from "./DigitalId";
import DirectorySection, { CertificateDialog } from "./DirectorySection";
import { useModalStore } from "@/stores/modals";
import { roleLabelKey, t, type Locale } from "@/lib/i18n";
import type { PublicUser } from "@/lib/auth";
import type { SaintRow } from "@/lib/content";

/**
 * Avatar initials without an external image (no third-party request, no CLS).
 * Skips punctuation-only words (e.g. "(ADMIN)") and keeps at most two initials.
 */
function initialsOf(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => Array.from(word)[0] ?? "")
    .filter((char) => /\p{L}/u.test(char))
    .slice(0, 2)
    .join("");
  return initials.toUpperCase() || "ॐ";
}

// मेनू / Profile page body (M7) — TC-MN-01 checklist.
// The account card is session-aware: real user details + logout when signed in,
// a respectful login/register invitation when signed out. The seva sections
// (digital ID, directory, volunteer registration, certificate, bookings) are
// kept as-is from the Day-1 menu.
export default function MenuClient({
  saints,
  user,
  locale,
}: {
  saints: SaintRow[];
  user: PublicUser | null;
  locale: Locale;
}) {
  const [certOpen, setCertOpen] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const openModal = useModalStore((s) => s.open);

  return (
    <div className="space-y-4">
      {/* account card — real session, never a placeholder identity */}
      {user ? (
        <section
          aria-labelledby="menu-account-heading"
          className="overflow-hidden rounded-2xl border border-warmBorder bg-surface shadow-sm"
        >
          <div className="bg-gradient-to-r from-saffron to-saffronDeep px-4 py-5 text-center text-white">
            <span
              aria-hidden
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-surface bg-surface text-xl font-bold text-saffronDeep"
            >
              {initialsOf(user.name)}
            </span>
            <h2
              id="menu-account-heading"
              className="mt-2 font-heading text-lg font-bold leading-tight"
            >
              {user.name}
            </h2>
            <p className="mt-0.5 break-all text-[11px] opacity-90">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white">
                {t(locale, roleLabelKey(user.role))}
              </span>
              {user.role === "SADHU" ? (
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white">
                  {user.sadhuVerified
                    ? t(locale, "auth.status.verified")
                    : t(locale, "auth.status.pending")}
                </span>
              ) : null}
            </div>
          </div>
          <div className="grid gap-2 p-3 sm:grid-cols-2">
            <Link
              href="/profile"
              className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-warmBorder bg-surface px-4 text-xs font-bold text-charcoal transition hover:bg-saffronSoft/60"
            >
              <UserRound className="h-4 w-4" aria-hidden />
              {t(locale, "auth.profile.manage")}
            </Link>
            <LogoutButton locale={locale} className="w-full" />
          </div>
        </section>
      ) : (
        <section
          aria-labelledby="menu-account-heading"
          className="rounded-2xl border border-warmBorder bg-surface p-5 text-center shadow-sm"
        >
          <span
            aria-hidden
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-saffronSoft text-saffronDeep"
          >
            <UserRound className="h-8 w-8" aria-hidden />
          </span>
          <h2
            id="menu-account-heading"
            className="font-heading text-lg font-bold text-charcoal"
          >
            {t(locale, "auth.profile.title")}
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted">
            {t(locale, "auth.login.subtitle")}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link
              href="/login?next=/menu"
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-saffron px-4 text-xs font-bold text-white shadow-sm transition hover:bg-saffronDeep"
            >
              <LogIn className="h-4 w-4" aria-hidden />
              {t(locale, "header.login")}
            </Link>
            <Link
              href="/register?next=/menu"
              className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-warmBorder bg-surface px-4 text-xs font-bold text-charcoal shadow-sm transition hover:bg-saffronSoft/60"
            >
              <UserPlus className="h-4 w-4" aria-hidden />
              {t(locale, "header.register")}
            </Link>
          </div>
        </section>
      )}

      {/* digital ID + actions */}
      <div className="space-y-3 rounded-2xl border border-warmBorder bg-surface p-4 shadow-sm">
        <h3 className="text-xs font-bold text-muted">{t(locale, "menu.digitalId")}</h3>
        <DigitalId locale={locale} user={user} />
        <button
          type="button"
          onClick={() => setShowDirectory((v) => !v)}
          suppressHydrationWarning
          className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-amber-600 py-2 text-xs font-bold text-white shadow transition hover:bg-amber-700"
        >
          <Users className="h-4 w-4" aria-hidden />
          श्री पंचायती अखाड़ा निरंजनी (पदाधिकारी सूची)
        </button>
        {showDirectory && <DirectorySection saints={saints} />}
        <Link
          href="/bookings"
          className="flex min-h-11 w-full items-center justify-center rounded-xl bg-stone-800 py-2 text-xs font-bold text-white shadow transition hover:bg-stone-900"
        >
          {t(locale, "auth.profile.myBookings")}
        </Link>
      </div>

      {/* volunteer + certificate */}
      <div className="space-y-3 rounded-2xl border border-warmBorder bg-surface p-4 shadow-sm">
        <h3 className="text-xs font-bold text-muted">सेवा एवं संकल्प</h3>
        {user?.role === "VOLUNTEER" ? (
          // Day 3 — the pass lives in the account: volunteers see it active here
          <div
            aria-live="polite"
            className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-green-100 py-2 text-xs font-bold text-green-800"
          >
            <HeartHandshake className="h-4 w-4" aria-hidden />
            {t(locale, "menu.volunteerActive")}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openModal("VOLUNTEER")}
            suppressHydrationWarning
            className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white shadow transition hover:bg-indigo-700"
          >
            <HeartHandshake className="h-4 w-4" aria-hidden />
            {`निरंजनी युवा सेवा दल (${t(locale, "auth.role.volunteer")}) पंजीकरण`}
          </button>
        )}
        <button
          type="button"
          onClick={() => setCertOpen(true)}
          suppressHydrationWarning
          className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-saffron py-2 text-xs font-bold text-white shadow transition hover:bg-deepSaffron"
        >
          <ScrollText className="h-4 w-4" aria-hidden />
          संकल्प ई-सर्टिफिकेट डाउनलोड करें
        </button>
      </div>

      <CertificateDialog open={certOpen} onClose={() => setCertOpen(false)} />
    </div>
  );
}
