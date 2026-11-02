"use client";

import { TreePine } from "lucide-react";
import { localeCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/i18n";

// लाइव गौ-दर्शन row → LiveGauModal (TC-GS-05)
export default function LiveGauRow({ locale }: { locale: Locale }) {
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  return (
    <div role="status" className="flex w-full items-center justify-between rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 shadow-sm">
      <span className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow">
          <TreePine className="h-5 w-5" aria-hidden />
        </span>
        <span>
          <span className="block text-xs font-bold text-gray-800">{c("लाइव गौ-दर्शन", "Live gau darshan")}</span>
          <span className="block text-[10px] text-gray-500">{c("कैमरा स्ट्रीम कॉन्फ़िगर नहीं है; प्रसारण उपलब्ध नहीं।", "No camera stream is configured; live viewing is unavailable.")}</span>
        </span>
      </span>
      <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[10px] font-bold text-gray-700">{c("उपलब्ध नहीं", "Unavailable")}</span>
    </div>
  );
}
