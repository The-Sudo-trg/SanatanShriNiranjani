import type { Metadata } from "next";
import { redirect } from "@/i18n/navigation";

import LoginForm from "@/components/auth/LoginForm";
import { getSessionUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { safeNextPath } from "@/lib/next-path";

// Session-aware page: always rendered per-request so an authenticated visitor is
// redirected instead of being served a cached logged-out form.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "लॉग इन",
  description: "सनातन श्री निरंजनी खाते में लॉग इन करें — बुकिंग, सेवा एवं दान की जानकारी।",
};


export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const [user, locale, params] = await Promise.all([
    getSessionUser(),
    getLocale(),
    searchParams,
  ]);
  if (user) redirect({ href: "/profile", locale });
  const nextPath = safeNextPath(params.next, "/login");

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-6 sm:py-14">
      <div className="rounded-3xl border border-warmBorder bg-surface p-5 shadow-sm sm:p-7">
        <span
          aria-hidden
          className="flex h-11 w-11 items-center justify-center rounded-full bg-saffronSoft text-xl font-bold text-saffronDeep"
        >
          ॐ
        </span>
        <h1 className="mt-3 font-heading text-2xl font-bold leading-tight text-charcoal sm:text-3xl">
          {t(locale, "auth.login.title")}
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {t(locale, "auth.login.subtitle")}
        </p>
        <LoginForm locale={locale} nextPath={nextPath} />
      </div>
    </div>
  );
}
