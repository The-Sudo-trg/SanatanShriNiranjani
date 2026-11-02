import type { Metadata } from "next";
import { TreePine } from "lucide-react";
import LiveGauRow from "@/components/gau/LiveGauRow";
import TreePlantationForm from "@/components/gau/TreePlantationForm";
import CharaSevaCard from "@/components/gau/CharaSevaCard";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: localeCopy(locale, "गौ सेवा एवं प्रकृति कल्याण", "Gau seva and nature care") };
}

// गौ सेवा एवं प्रकृति कल्याण पोर्टल (M3)
export const dynamic = "force-dynamic";

export default async function GauSevaPage() {
  const [contributions, locale] = await Promise.all([
    prisma.gauContribution.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    getLocale(),
  ]);
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl bg-gradient-to-r from-amber-600 to-emerald-700 p-4 text-center text-white shadow-md">
        <TreePine className="mx-auto mb-1 h-7 w-7 text-gold" aria-hidden />
        <h2 className="text-base font-bold">{c("गौ सेवा एवं प्रकृति कल्याण पोर्टल", "Gau seva and nature care")}</h2>
        <p className="mt-1 text-xs opacity-90">
          {c("श्री पंचायती अखाड़ा निरंजनी पर्यावरण एवं गौ संरक्षण अभियान", "Environmental care and cow protection initiative of Shri Panchayati Akhara Niranjani")}
        </p>
      </div>

      <LiveGauRow locale={locale} />

      {/* seva forms — side by side on larger screens */}
      <div suppressHydrationWarning className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <TreePlantationForm locale={locale} />
        <CharaSevaCard locale={locale} />
      </div>

      {/* recent seva — quiet gratitude list, solemn tone */}
      {contributions.length > 0 && (
        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-700">
            {c("हाल की सेवा सूची", "Recent seva")}
          </h3>
          <ul className="space-y-1.5 text-[11px] text-gray-600">
            {contributions.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <span>
                  {c.donorName}
                  {c.treeType
                    ? ` — ${locale === "en"
                      ? ({ "पीपल (Peepal)": "Peepal", "बरगद (Banyan)": "Banyan", "बेलपत्र (Belpatra)": "Belpatra", "नीम / आंवला": "Neem / Amla" } as Record<string, string>)[c.treeType] ?? "[Tree name translation to be confirmed]"
                      : c.treeType}`
                    : ""}
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
