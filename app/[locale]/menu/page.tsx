import MenuClient from "@/components/menu/MenuClient";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { SaintRow } from "@/lib/content";
import { getLocale } from "@/lib/i18n-server";

// मेनू / Profile page (M7) — session-aware account card + seva shortcuts.
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [saints, user, locale] = await Promise.all([
    prisma.saint.findMany({ orderBy: { order: "asc" } }),
    getSessionUser(),
    getLocale(),
  ]);

  const saintRows: SaintRow[] = saints.map((s) => ({
    id: s.id,
    nameHi: s.nameHi,
    pad: s.pad,
    bioHi: s.bioHi,
    originHi: s.originHi,
    memorial: s.memorial,
    verified: s.verified,
    order: s.order,
  }));

  return (
    <div className="p-4">
      <MenuClient saints={saintRows} user={user} locale={locale} />
    </div>
  );
}
