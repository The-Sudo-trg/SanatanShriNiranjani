"use client";

import Link from "next/link";
import { Baby, Car } from "lucide-react";
import { useModalStore } from "@/stores/modals";

// NAVIGATION §3.1 quick cards — गाड़ी पूजन & नामकरण (TC-HM-03)
export default function QuickCards() {
  const openModal = useModalStore((s) => s.open);

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => openModal("GADI_PUJA")}
        className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3 text-left shadow-sm transition hover:bg-amber-100"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-700">
          <Car className="h-4 w-4" aria-hidden />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-800">गाड़ी पूजन</h4>
          <p className="text-[9px] text-gray-500">ऑनलाइन बुकिंग</p>
        </div>
      </button>
      <button
        type="button"
        onClick={() => openModal("NAMKARAN")}
        className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3 text-left shadow-sm transition hover:bg-amber-100"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
          <Baby className="h-4 w-4" aria-hidden />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-800">नामकरण संस्कार</h4>
          <p className="text-[9px] text-gray-500">आचार्य मार्गदर्शन</p>
        </div>
      </button>
    </div>
  );
}

// Home highlight CTAs that navigate (स्मृति वृक्षारोपण) — kept beside QuickCards for cohesion
export function VriksharopanCta() {
  return (
    <Link
      href="/gau-seva"
      className="mt-2 inline-block rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-medium text-white shadow transition hover:bg-emerald-700"
    >
      गौ एवं प्रकृति पोर्टल पर जाएं
    </Link>
  );
}
