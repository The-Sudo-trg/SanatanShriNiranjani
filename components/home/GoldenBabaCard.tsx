"use client";

import { useModalStore } from "@/stores/modals";
import { GOLDEN_BABA_PHOTO } from "@/lib/constants";

// Golden Baba profile card — QR Verified chip, केरल origin, 4kg note intact (TC-HM-07)
export default function GoldenBabaCard({
  nameHi,
  originHi,
  quoteHi,
}: {
  nameHi: string;
  originHi: string;
  quoteHi: string;
}) {
  const openModal = useModalStore((s) => s.open);

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 p-3.5 shadow-sm">
      <div className="relative">
        <img
          src={GOLDEN_BABA_PHOTO}
          alt={nameHi}
          className="h-16 w-16 rounded-full border-2 border-gold object-cover shadow-md"
        />
        <span className="absolute bottom-0 right-0 rounded-full bg-saffron px-1 text-[8px] font-bold text-white">
          QR Verified
        </span>
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-maroonText">{nameHi} प्रोफ़ाइल</h4>
        <p className="mt-0.5 text-[11px] text-gray-600">मूल निवास: {originHi} | श्री पंचायती अखाड़ा निरंजनी</p>
        <p className="mt-1 text-[10px] italic text-amber-800">{quoteHi}</p>
        <button
          type="button"
          onClick={() => openModal("GOLDEN_BABA")}
          className="mt-2 rounded-full bg-saffron px-3 py-1 text-[10px] font-medium text-white shadow transition hover:bg-deepSaffron"
        >
          पूर्ण प्रोफ़ाइल देखें
        </button>
      </div>
    </div>
  );
}
