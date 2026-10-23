import MenuClient from "@/components/menu/MenuClient";
import { prisma } from "@/lib/db";
import type { SaintRow } from "@/lib/content";

// मेनू / Profile page (M7)
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const saints = await prisma.saint.findMany({ orderBy: { order: "asc" } });
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
      <MenuClient saints={saintRows} />
    </div>
  );
}
