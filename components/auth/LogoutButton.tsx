"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { t, type Locale } from "@/lib/i18n";

// लॉग आउट — POST /api/auth/logout expires the HttpOnly `__Host-sn_session`
// cookie, then a client navigation home so every Server Component re-reads the
// session (header profile state, menu card, /profile guard).
export default function LogoutButton({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function logout() {
    if (submitting) return; // double-submit guard (NAVIGATION §7.5)
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("logout failed");
      toast.success(t(locale, "auth.profile.logoutDone"));
      router.push("/");
      router.refresh();
    } catch {
      toast.error(t(locale, "auth.error.offline"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => void logout()}
      disabled={submitting}
      aria-busy={submitting}
      className={
        "min-h-11 rounded-full border border-warmBorder bg-surface text-charcoal hover:bg-saffronSoft/60 " +
        (className ?? "")
      }
    >
      <LogOut className="h-4 w-4" aria-hidden />
      {submitting ? t(locale, "auth.submitting") : t(locale, "auth.profile.logout")}
    </Button>
  );
}
