"use client";

import { useModalStore } from "@/stores/modals";

// Golden Baba (महामंडलेश्वर एस.के. नारायण गिरि) profile card — living sadhu.
// No free-licensed photograph exists for him (researched 2026-10-27), so the card
// uses a dignified ॐ medallion instead of a copyright-risky hotlinked news image.
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
    <div
      suppressHydrationWarning
      className="flex items-center gap-3.5 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 p-3.5 shadow-sm sm:items-start sm:gap-4 sm:p-4"
    >
      <div className="relative">
        <div
          aria-hidden
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-surface font-heading text-3xl text-saffron shadow-md sm:h-24 sm:w-24 sm:text-4xl"
        >
          ॐ
        </div>
        <span className="absolute bottom-0 right-0 rounded-full bg-saffron px-1 text-[8px] font-bold text-white">
          क्यूआर सत्यापित
        </span>
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-maroonText sm:text-sm">{nameHi} प्रोफ़ाइल</h4>
        <p className="mt-0.5 text-[11px] text-gray-600">
          मूल निवास: {originHi} | श्री पंचायती अखाड़ा निरंजनी
        </p>
        <p className="mt-1 text-[10px] italic text-amber-800">{quoteHi}</p>
        <button
          type="button"
          onClick={() => openModal("GOLDEN_BABA")}
          suppressHydrationWarning
          className="mt-2 rounded-full bg-saffron px-3 py-1 text-[10px] font-medium text-white shadow transition hover:bg-deepSaffron sm:text-[11px]"
        >
          पूर्ण प्रोफ़ाइल देखें
        </button>
      </div>
    </div>
  );
}
