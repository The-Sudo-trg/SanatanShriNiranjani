import { TreePine } from "lucide-react";
import LiveGauRow from "@/components/gau/LiveGauRow";
import TreePlantationForm from "@/components/gau/TreePlantationForm";
import CharaSevaCard from "@/components/gau/CharaSevaCard";
import { prisma } from "@/lib/db";

// गौ सेवा एवं प्रकृति कल्याण पोर्टल (M3)
export const dynamic = "force-dynamic";

export default async function GauSevaPage() {
  const contributions = await prisma.gauContribution.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl bg-gradient-to-r from-amber-600 to-emerald-700 p-4 text-center text-white shadow-md">
        <TreePine className="mx-auto mb-1 h-7 w-7 text-gold" aria-hidden />
        <h2 className="text-base font-bold">गौ सेवा एवं प्रकृति कल्याण पोर्टल</h2>
        <p className="mt-1 text-xs opacity-90">
          श्री पंचायती अखाड़ा निरंजनी पर्यावरण एवं गौ संरक्षण अभियान
        </p>
      </div>

      <LiveGauRow />

      {/* seva forms — side by side on larger screens */}
      <div suppressHydrationWarning className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <TreePlantationForm />
        <CharaSevaCard />
      </div>

      {/* recent seva — quiet gratitude list, solemn tone */}
      {contributions.length > 0 && (
        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-700">
            हाल की सेवा सूची
          </h3>
          <ul className="space-y-1.5 text-[11px] text-gray-600">
            {contributions.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <span>
                  {c.donorName}
                  {c.treeType ? ` — ${c.treeType}` : ""}
                </span>
                <span className="font-bold text-saffron">₹{c.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
