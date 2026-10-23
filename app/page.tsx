import Link from "next/link";
import { TreePine } from "lucide-react";
import FeatureGrid from "@/components/home/FeatureGrid";
import QuickCards from "@/components/home/QuickCards";
import GoldenBabaCard from "@/components/home/GoldenBabaCard";
import SatsangPlayer from "@/components/home/SatsangPlayer";
import { prisma } from "@/lib/db";
import { kolkataDayKey } from "@/lib/dates";
import { SOUTH_SAINTS_PHOTO } from "@/lib/constants";
import { SuvicharStrip } from "@/components/home/SuvicharStrip";
import SouthSaintsButton from "@/components/home/SouthSaintsButton";

// होम dashboard (M1) — server-fetched panchang/suvichar/saints (DB, PRD §4)
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const todayKey = kolkataDayKey(0);
  const todayDate = new Date(`${todayKey}T00:00:00.000Z`);

  const [panchang, suvichar, baba] = await Promise.all([
    prisma.panchang.findUnique({ where: { date: todayDate } }).catch(() => null) ??
      prisma.panchang.findFirst({ orderBy: { date: "desc" } }),
    prisma.suvichar.findFirst({ orderBy: { day: "asc" } }),
    prisma.saint.findFirst({ where: { memorial: true } }),
  ]);

  return (
    <div className="space-y-4 p-4">
      {/* Panchang banner — amber gradient + giant ॐ watermark (TC-HM-01) */}
      {panchang && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-3.5 text-white shadow-md">
          <div className="absolute -translate-y-2 translate-x-4 opacity-10" aria-hidden>
            <span className="text-7xl font-bold">ॐ</span>
          </div>
          <div className="mb-1 flex items-center justify-between text-xs font-medium opacity-95">
            <span>आज का पंचांग</span>
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px]">
              शुभ मुहूर्त: {panchang.muhurat}
            </span>
          </div>
          <h2 className="text-sm font-bold leading-snug">
            {panchang.tithi} • नक्षत्र: {panchang.nakshatra}
          </h2>
          <p className="mt-0.5 text-[11px] opacity-90">
            सूर्योदय: {panchang.sunrise} | {panchang.note}
          </p>
        </div>
      )}

      {/* Suvichar strip + अखाड़ा सूची */}
      <SuvicharStrip text={suvichar?.text ?? "धर्मो रक्षति रक्षितः..."} source={suvichar?.source ?? "निरंजनी वाणी"} />

      <FeatureGrid />
      <QuickCards />

      {/* विशेष आकर्षण */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
          विशेष आकर्षण एवं संतों की पावन झलक
        </h3>

        {baba && (
          <GoldenBabaCard
            nameHi={baba.nameHi}
            originHi={baba.originHi ?? "केरल"}
            quoteHi={'"4 किग्रा स्वर्ण आभूषण साधना व सनातन सेवा के प्रतीक।"'}
          />
        )}

        {/* स्मृति वृक्षारोपण highlight */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-amber-100 bg-white p-3.5 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-inner">
            <TreePine className="h-6 w-6" aria-hidden />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-800">स्मृति वृक्षारोपण (अपनों की याद में पेड़)</h4>
            <p className="mt-0.5 text-[11px] text-gray-600">
              अखाड़े के परिसरों में GPS टैगिंग के साथ पौधा लगवाएं और ई-प्रमाण पत्र पाएं
            </p>
            <Link
              href="/gau-seva"
              className="mt-2 inline-block rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-medium text-white shadow transition hover:bg-emerald-700"
            >
              गौ एवं प्रकृति पोर्टल पर जाएं
            </Link>
          </div>
        </div>

        {/* दक्षिण भारत के संत card */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-amber-100 bg-white p-3.5 shadow-sm">
          <img
            src={SOUTH_SAINTS_PHOTO}
            alt="दक्षिण भारत के संत"
            className="h-14 w-14 rounded-full border border-amber-200 object-cover shadow-sm"
          />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-800">दक्षिण भारत के संत एवं आचार्य दर्शन</h4>
            <p className="mt-0.5 text-[11px] text-gray-600">
              स्वामी चिन्मयानंद सरस्वती, श्री नारायण गुरु एवं अन्य महान संत
            </p>
            <SouthSaintsButton />
          </div>
        </div>
      </div>

      <SatsangPlayer />
    </div>
  );
}
