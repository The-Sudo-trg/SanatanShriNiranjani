import type { Metadata } from "next";
import Link from "@/i18n/navigation";
import { redirect } from "@/i18n/navigation";
import { CalendarDays, TicketCheck, UserRound } from "lucide-react";

import LogoutButton from "@/components/auth/LogoutButton";
import DigitalId from "@/components/menu/DigitalId";
import { getSessionUser } from "@/lib/auth";
import { roleLabelKey, t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

// Per-user page: never cached, never indexed, always rendered from the session.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "मेरी प्रोफ़ाइल",
  description: "आपका खाता, भूमिका एवं सेवा-विवरण।",
  robots: { index: false, follow: false },
};

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

export default async function ProfilePage() {
  const [user, locale] = await Promise.all([getSessionUser(), getLocale()]);
  if (!user) {
    return redirect({
      href: { pathname: "/login", query: { next: "/profile" } },
      locale,
    });
  }

  // Locale is resolved from the URL on the server, so this date is
  // deterministic for a given request — no hydration mismatch is possible here.
  const memberSince = new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(user.createdAt);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-heading text-3xl font-bold leading-tight text-charcoal">
        {t(locale, "auth.profile.title")}
      </h1>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        {t(locale, "auth.profile.subtitle")}
      </p>

      <div className="mt-6 space-y-4">
        {/* identity */}
        <section className="rounded-2xl border border-warmBorder bg-surface p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span
              aria-hidden
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-saffronSoft text-xl font-bold text-saffronDeep"
            >
              {initialsOf(user.name)}
            </span>
            <div className="min-w-0">
              <h2 className="font-heading text-xl font-bold leading-tight text-charcoal">
                {user.name}
              </h2>
              <p className="mt-0.5 break-all text-sm text-muted">{user.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-saffronSoft px-2.5 py-1 text-[11px] font-bold text-charcoal">
                  {t(locale, roleLabelKey(user.role))}
                </span>
                {user.role === "SADHU" ? (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      user.sadhuVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {user.sadhuVerified
                      ? t(locale, "auth.status.verified")
                      : t(locale, "auth.status.pending")}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <dl className="mt-4 flex items-center gap-2 border-t border-warmBorder pt-4 text-sm text-charcoal">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted" aria-hidden />
            <div>
              <dt className="text-[11px] font-bold text-muted">
                {t(locale, "auth.profile.member")}
              </dt>
              <dd>
                <time dateTime={user.createdAt.toISOString()}>{memberSince}</time>
              </dd>
            </div>
          </dl>
        </section>

        {/* डिजिटल परिचय पत्र — reuse the menu card (QR placeholder is a v1 stub) */}
        <section
          aria-labelledby="profile-digital-id"
          className="rounded-2xl border border-warmBorder bg-surface p-5 shadow-sm"
        >
          <h2
            id="profile-digital-id"
            className="text-xs font-bold uppercase tracking-wider text-muted"
          >
            {t(locale, "auth.profile.digitalId")}
          </h2>
          <div className="mt-3">
            <DigitalId locale={locale} user={user} />
          </div>
        </section>

        {/* account actions */}
        <section aria-label={t(locale, "auth.profile.manage")} className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href="/bookings"
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-saffron px-4 text-xs font-bold text-white shadow-sm transition hover:bg-saffronDeep"
            >
              <TicketCheck className="h-4 w-4" aria-hidden />
              {t(locale, "auth.profile.myBookings")}
            </Link>
            <Link
              href="/menu"
              className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-warmBorder bg-surface px-4 text-xs font-bold text-charcoal shadow-sm transition hover:bg-saffronSoft/60"
            >
              <UserRound className="h-4 w-4" aria-hidden />
              {t(locale, "auth.profile.manage")}
            </Link>
          </div>
          <LogoutButton locale={locale} className="w-full" />
        </section>
      </div>
    </div>
  );
}
