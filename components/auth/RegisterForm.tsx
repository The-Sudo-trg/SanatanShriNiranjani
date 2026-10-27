"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t, type Locale, type MessageKey } from "@/lib/i18n";

// Self-registration roles — mirrors lib/validators.ts#SELF_REGISTER_ROLES.
// ADMIN is assigned by the administration and is never offered here.
type RegisterRole = "USER" | "SADHU" | "VOLUNTEER";

const ROLE_OPTIONS: ReadonlyArray<{
  value: RegisterRole;
  labelKey: MessageKey;
  descKey: MessageKey;
}> = [
  { value: "USER", labelKey: "auth.role.user", descKey: "auth.role.userDesc" },
  { value: "SADHU", labelKey: "auth.role.sadhu", descKey: "auth.role.sadhuDesc" },
  { value: "VOLUNTEER", labelKey: "auth.role.volunteer", descKey: "auth.role.volunteerDesc" },
];

type RegisterValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: RegisterRole;
};

// Mirrors lib/validators.ts#emailSchema (keep in sync if the server rule changes).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Mirrors lib/validators.ts#phoneSchema — only enforced when the field is filled.
const PHONE_PATTERN = /^[6-9]\d{9}$/;

/**
 * पंजीकरण form (client). Validation mirrors the server's zod schema but shows
 * locale-aware i18n messages; the server stays the source of truth and its Hindi
 * `{ error }` (e.g. duplicate e-mail) is displayed verbatim.
 */
export default function RegisterForm({
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
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "USER",
    },
  });

  // useWatch (not watch()) keeps the React Compiler able to memoise this form.
  const role = useWatch({ control, name: "role", defaultValue: "USER" });
  const loginHref = nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login";

  async function onSubmit(values: RegisterValues) {
    if (isSubmitting) return; // double-submit guard
    setServerError(null);

    const phone = values.phone.trim();
    const payload: {
      name: string;
      email: string;
      phone?: string;
      password: string;
      role: RegisterRole;
    } = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      role: values.role,
    };
    if (phone !== "") payload.phone = phone;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setServerError(data.error?.trim() || t(locale, "auth.error.generic"));
        return;
      }
      toast.success(t(locale, "auth.register.done"));
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
        <Label htmlFor="register-name">{t(locale, "auth.name")}</Label>
        <Input
          id="register-name"
          type="text"
          autoComplete="name"
          maxLength={80}
          placeholder={t(locale, "auth.namePlaceholder")}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "register-name-error" : undefined}
          suppressHydrationWarning
          className="min-h-11 bg-surface text-sm"
          {...register("name", {
            validate: (value) =>
              value.trim().length >= 2 || t(locale, "auth.error.name"),
          })}
        />
        {errors.name?.message ? (
          <p
            id="register-name-error"
            role="alert"
            aria-live="polite"
            className="mt-1 text-[11px] text-red-700"
          >
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="register-email">{t(locale, "auth.email")}</Label>
        <Input
          id="register-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          placeholder={t(locale, "auth.emailPlaceholder")}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          suppressHydrationWarning
          className="min-h-11 bg-surface text-sm"
          {...register("email", {
            required: t(locale, "auth.error.email"),
            pattern: { value: EMAIL_PATTERN, message: t(locale, "auth.error.email") },
          })}
        />
        {errors.email?.message ? (
          <p
            id="register-email-error"
            role="alert"
            aria-live="polite"
            className="mt-1 text-[11px] text-red-700"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="register-phone">{t(locale, "auth.phone")}</Label>
        <Input
          id="register-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={10}
          placeholder={t(locale, "auth.phonePlaceholder")}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "register-phone-error" : undefined}
          suppressHydrationWarning
          className="min-h-11 bg-surface text-sm"
          {...register("phone", {
            validate: (value) => {
              const phone = value.trim();
              if (phone === "") return true; // optional field
              return PHONE_PATTERN.test(phone) || t(locale, "auth.error.phone");
            },
          })}
        />
        {errors.phone?.message ? (
          <p
            id="register-phone-error"
            role="alert"
            aria-live="polite"
            className="mt-1 text-[11px] text-red-700"
          >
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="register-password">{t(locale, "auth.password")}</Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          maxLength={200}
          placeholder={t(locale, "auth.passwordPlaceholder")}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "register-password-error" : undefined}
          suppressHydrationWarning
          className="min-h-11 bg-surface text-sm"
          {...register("password", {
            validate: (value) =>
              value.length >= 8 || t(locale, "auth.error.password"),
          })}
        />
        {errors.password?.message ? (
          <p
            id="register-password-error"
            role="alert"
            aria-live="polite"
            className="mt-1 text-[11px] text-red-700"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-[11px] font-semibold text-gray-700">
          {t(locale, "auth.role.label")}
        </legend>
        <div className="space-y-2">
          {ROLE_OPTIONS.map((option) => {
            const selected = role === option.value;
            return (
              <label
                key={option.value}
                className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border p-3 transition ${
                  selected
                    ? "border-saffron bg-saffronSoft/60"
                    : "border-warmBorder bg-surface hover:bg-saffronSoft/30"
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  suppressHydrationWarning
                  className="mt-0.5 h-4 w-4 shrink-0 accent-saffron"
                  {...register("role")}
                />
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-charcoal">
                    {t(locale, option.labelKey)}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">
                    {t(locale, option.descKey)}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {role === "SADHU" ? (
        <p
          aria-live="polite"
          className="rounded-xl border border-warmBorder bg-saffronSoft/50 px-3 py-2 text-[11px] leading-relaxed text-charcoal"
        >
          {t(locale, "auth.sadhuNote")}
        </p>
      ) : null}

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
            <UserPlus className="h-4 w-4" aria-hidden />
            {t(locale, "auth.register.submit")}
          </>
        )}
      </Button>

      <p className="border-t border-warmBorder pt-4 text-center text-xs leading-relaxed text-muted">
        {t(locale, "auth.haveAccount")}{" "}
        <Link
          href={loginHref}
          className="font-bold text-saffronDeep underline-offset-2 hover:underline"
        >
          {t(locale, "auth.loginLink")}
        </Link>
      </p>
    </form>
  );
}
