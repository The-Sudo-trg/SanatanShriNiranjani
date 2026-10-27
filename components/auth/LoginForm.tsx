"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t, type Locale } from "@/lib/i18n";

type LoginValues = { email: string; password: string };

// Mirrors lib/validators.ts#emailSchema closely enough for instant feedback; the
// server remains the source of truth (its Hindi `{ error }` is shown verbatim).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * लॉग इन form (client). POST /api/auth/login keeps the HttpOnly session cookie,
 * then we navigate to the sanitised `next` path (default /profile) and refresh
 * so Server Components re-read the session.
 */
export default function LoginForm({
  locale,
  nextPath,
}: {
  locale: Locale;
  nextPath?: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const registerHref = nextPath
    ? `/register?next=${encodeURIComponent(nextPath)}`
    : "/register";

  async function onSubmit(values: LoginValues) {
    if (isSubmitting) return; // double-submit guard
    setServerError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        // Server errors are contractual Hindi strings — display them as-is.
        setServerError(data.error?.trim() || t(locale, "auth.error.generic"));
        return;
      }
      toast.success(t(locale, "auth.login.done"));
      router.push(nextPath ?? "/profile");
      router.refresh();
    } catch {
      setServerError(t(locale, "auth.error.offline"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
      {serverError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] leading-relaxed text-red-700"
        >
          {serverError}
        </div>
      ) : null}

      <div>
        <Label htmlFor="login-email">{t(locale, "auth.email")}</Label>
        <Input
          id="login-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t(locale, "auth.emailPlaceholder")}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          suppressHydrationWarning
          className="min-h-11 bg-surface text-sm"
          {...register("email", {
            required: t(locale, "auth.error.email"),
            pattern: { value: EMAIL_PATTERN, message: t(locale, "auth.error.email") },
          })}
        />
        {errors.email?.message ? (
          <p
            id="login-email-error"
            role="alert"
            aria-live="polite"
            className="mt-1 text-[11px] text-red-700"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="login-password">{t(locale, "auth.password")}</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder={t(locale, "auth.passwordPlaceholder")}
          suppressHydrationWarning
          className="min-h-11 bg-surface text-sm"
          {...register("password")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        suppressHydrationWarning
        className="min-h-11 gap-2 rounded-full text-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {t(locale, "auth.submitting")}
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" aria-hidden />
            {t(locale, "auth.login.submit")}
          </>
        )}
      </Button>

      <p className="border-t border-warmBorder pt-4 text-center text-xs leading-relaxed text-muted">
        {t(locale, "auth.noAccount")}{" "}
        <Link
          href={registerHref}
          className="font-bold text-saffronDeep underline-offset-2 hover:underline"
        >
          {t(locale, "auth.registerLink")}
        </Link>
      </p>
    </form>
  );
}
