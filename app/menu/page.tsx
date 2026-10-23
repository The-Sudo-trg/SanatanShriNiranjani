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
    <main className="min-h-full bg-[#FFF8F2] p-4">
      <div className="mb-4 rounded-[1.5rem] bg-gradient-to-br from-[#292524] via-[#44403C] to-[#0F766E] p-5 text-white shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FDE68A]">Your spiritual companion</p>
        <h2 className="mt-2 text-xl font-bold">सतांतनी मेनू</h2>
        <p className="mt-1 text-xs text-white/70">सेवाएँ, संत परिचय और आपकी डिजिटल पहचान।</p>
      </div>
      <MenuClient saints={saintRows} />
    </main>
  );
}
