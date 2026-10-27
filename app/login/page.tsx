import type { Metadata } from "next";
import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";
import { getSessionUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

// Session-aware page: always rendered per-request so an authenticated visitor is
// redirected instead of being served a cached logged-out form.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "लॉग इन",
  description: "सनातन श्री निरंजनी खाते में लॉग इन करें — बुकिंग, सेवा एवं दान की जानकारी।",
  alternates: { canonical: "/login" },
};

const MAX_NEXT_LENGTH = 512;

/**
 * Open-redirect guard: after a successful login we only ever navigate to a
 * same-origin relative path. Absolute URLs, protocol-relative ("//host"),
 * backslash/encoded-slash tricks, control characters and /login itself (loop)
 * are rejected, falling back to the default /profile.
 */
function safeNextPath(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  if (raw.length > MAX_NEXT_LENGTH) return undefined;
  if (!raw.startsWith("/") || raw.startsWith("//")) return undefined;
  if (raw.includes("\\")) return undefined;
  if (/[\u0000-\u001f\u007f]/.test(raw)) return undefined;
  if (/^\/%2f|^\/%5c/i.test(raw)) return undefined;
  if (raw === "/login" || raw.startsWith("/login?") || raw.startsWith("/login/")) return undefined;
  return raw;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const user = await getSessionUser();
  if (user) redirect("/profile");

  const [locale, params] = await Promise.all([getLocale(), searchParams]);
  const nextPath = safeNextPath(params.next);

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
