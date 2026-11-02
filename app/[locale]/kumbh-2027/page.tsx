import type { Metadata } from "next";
import { Landmark, MapPin, Route } from "lucide-react";
import Countdown from "@/components/kumbh/Countdown";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: localeCopy(locale, "महाकुम्भ 2027", "Maha Kumbh 2027 guide") };
}

// महाकुंभ 2027 नेविगेटर (M8) — dates from DB, never hardcoded in UI (PRD M8 acceptance)
export const dynamic = "force-dynamic";

export default async function KumbhPage() {
  const [events, locale] = await Promise.all([
    prisma.kumbhEvent.findMany({ orderBy: { date: "asc" } }),
    getLocale(),
  ]);
  const tx = (hi: string, en: string) => localeCopy(locale, hi, en);
  const firstSnan = events.find((e) => e.kind === "SHAHI_SNAN");

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-center text-white shadow-md">
        <Landmark className="mx-auto mb-1 h-7 w-7 text-gold" aria-hidden />
        <h2 className="text-base font-bold">{tx("महाकुंभ 2027 नेविगेटर", "Maha Kumbh 2027 guide")}</h2>
        <p className="mt-1 text-xs opacity-90">
          {tx(
            "उत्तराखंड महाकुंभ (हरिद्वार 2027) हेतु श्री पंचायती अखाड़ा निरंजनी की छावनी, पेशवाई मार्ग और शाही स्नान तिथियों की जानकारी। लाइव GPS मार्ग उपलब्ध नहीं है।",
            "Information about the Shri Panchayati Akhara Niranjani camp, procession route, and royal bathing dates for Haridwar 2027. Live GPS route tracking is unavailable."
          )}
        </p>
      </div>

      {firstSnan && <Countdown targetIso={firstSnan.date.toISOString()} locale={locale} />}

      {/* छावनी locations */}
      <div className="space-y-2 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
        <h3 className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
          <MapPin className="h-4 w-4 text-saffron" aria-hidden />
          {tx("अखाड़ा छावनी स्थान", "Akhara camp locations")}
        </h3>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs">
          <p className="font-bold text-gray-800">{tx("हरिद्वार छावनी (मुख्य)", "Haridwar camp (main)")}</p>
          <p className="text-[10px] text-gray-500">{tx("गंगा तट, हर की पौड़ी क्षेत्र — प्रशासन एवं संत निवास", "Ganga riverfront, Har Ki Pauri area — administration and saint residence")}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs">
          <p className="font-bold text-gray-800">{tx("प्रयागराज शाखा", "Prayagraj branch")}</p>
          <p className="text-[10px] text-gray-500">{tx("संगम तट — स्थायी आश्रम एवं छावनी", "Sangam riverfront — permanent ashram and camp")}</p>
        </div>
      </div>

      {/* पेशवाई route note */}
      <div className="space-y-2 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
        <h3 className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
          <Route className="h-4 w-4 text-saffron" aria-hidden />
          {tx("पेशवाई मार्ग सूचना", "Procession route information")}
        </h3>
        <p className="text-[11px] leading-relaxed text-gray-600">
          {tx("शाही स्नान दिवस पर निरंजनी पेशवाई निर्धारित मार्ग से निकलेगी। भीड़ प्रबंधन हेतु भक्तगण पुलिस बैरियर के निर्देशों का पालन करें। सटीक मार्ग एवं समय अखाड़ा प्रशासन द्वारा घोषित होगा।", "The Niranjani procession will follow its designated route on royal bathing days. Follow police and crowd-management instructions. The Akhara administration will announce the exact route and timing.")}
        </p>
      </div>

      {/* शाही स्नान dates from DB */}
      <div className="space-y-2 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-800">{tx("शाही स्नान तिथियाँ", "Royal bathing dates")}</h3>
        {events.length === 0 && (
          <p className="py-2 text-center text-xs text-gray-500">{tx("जल्द ही उपलब्ध होगा।", "Dates have not yet been published.")}</p>
        )}
        {events.map((e) => (
          <div key={e.id} className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-800">{locale === "en" ? "[English event title to be confirmed]" : e.titleHi}</p>
              <span className="rounded-full bg-saffron px-2 py-0.5 text-[10px] font-bold text-white">
                {                new Intl.DateTimeFormat(locale === "en" ? "en-IN" : "hi-IN", {
                  timeZone: "Asia/Kolkata",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(e.date)}
              </span>
            </div>
            {e.noteHi && <p className="mt-0.5 text-[10px] text-gray-500">{locale === "en" ? "[English event notes to be confirmed]" : e.noteHi}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
