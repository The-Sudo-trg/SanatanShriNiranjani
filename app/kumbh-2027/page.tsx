import { Landmark, MapPin, Route } from "lucide-react";
import Countdown from "@/components/kumbh/Countdown";
import { prisma } from "@/lib/db";

// महाकुंभ 2027 नेविगेटर (M8) — dates from DB, never hardcoded in UI (PRD M8 acceptance)
export const dynamic = "force-dynamic";

export default async function KumbhPage() {
  const events = await prisma.kumbhEvent.findMany({ orderBy: { date: "asc" } });
  const firstSnan = events.find((e) => e.kind === "SHAHI_SNAN");

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-center text-white shadow-md">
        <Landmark className="mx-auto mb-1 h-7 w-7 text-gold" aria-hidden />
        <h2 className="text-base font-bold">महाकुंभ 2027 नेविगेटर</h2>
        <p className="mt-1 text-xs opacity-90">
          उत्तराखंड महाकुंभ (हरिद्वार 2027) हेतु श्री पंचायती अखाड़ा निरंजनी की छावनी, पेशवाई मार्ग और
          शाही स्नान तिथियों की लाइव GPS जानकारी।
        </p>
      </div>

      {firstSnan && <Countdown targetIso={firstSnan.date.toISOString()} />}

      {/* छावनी locations */}
      <div className="space-y-2 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
        <h3 className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
          <MapPin className="h-4 w-4 text-saffron" aria-hidden />
          अखाड़ा छावनी स्थान
        </h3>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs">
          <p className="font-bold text-gray-800">हरिद्वार छावनी (मुख्य)</p>
          <p className="text-[10px] text-gray-500">गंगा तट, हर की पौड़ी क्षेत्र — प्रशासन एवं संत निवास</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs">
          <p className="font-bold text-gray-800">प्रयागराज शाखा</p>
          <p className="text-[10px] text-gray-500">संगम तट — स्थायी आश्रम एवं छावनी</p>
        </div>
      </div>

      {/* पेशवाई route note */}
      <div className="space-y-2 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
        <h3 className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
          <Route className="h-4 w-4 text-saffron" aria-hidden />
          पेशवाई मार्ग सूचना
        </h3>
        <p className="text-[11px] leading-relaxed text-gray-600">
          शाही स्नान दिवस पर निरंजनी पेशवाई निर्धारित मार्ग से निकलेगी। भीड़ प्रबंधन हेतु भक्तगण
          पुलिस बैरियर के निर्देशों का पालन करें। सटीक मार्ग एवं समय अखाड़ा प्रशासन द्वारा घोषित
          होगा।
        </p>
      </div>

      {/* शाही स्नान dates from DB */}
      <div className="space-y-2 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-800">शाही स्नान तिथियाँ</h3>
        {events.length === 0 && (
          <p className="py-2 text-center text-xs text-gray-500">जल्द ही उपलब्ध होगा।</p>
        )}
        {events.map((e) => (
          <div key={e.id} className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-800">{e.titleHi}</p>
              <span className="rounded-full bg-saffron px-2 py-0.5 text-[10px] font-bold text-white">
                {new Intl.DateTimeFormat("hi-IN", {
                  timeZone: "Asia/Kolkata",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(e.date)}
              </span>
            </div>
            {e.noteHi && <p className="mt-0.5 text-[10px] text-gray-500">{e.noteHi}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
