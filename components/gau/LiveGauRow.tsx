"use client";

import { TreePine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useModalStore } from "@/stores/modals";

// लाइव गौ-दर्शन row → LiveGauModal (TC-GS-05)
export default function LiveGauRow() {
  const openModal = useModalStore((s) => s.open);
  return (
    <button
      type="button"
      onClick={() => openModal("LIVE_GAU")}
      className="flex w-full items-center justify-between rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 shadow-sm transition hover:bg-amber-100"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow">
          <TreePine className="h-5 w-5" aria-hidden />
        </span>
        <span>
          <span className="block text-xs font-bold text-gray-800">लाइव गौ-दर्शन (कैमरा चालू)</span>
          <span className="block text-[10px] text-gray-500">गौशाला प्रांगण से सीधा प्रसारण देखें</span>
        </span>
      </span>
      <Badge variant="live">● LIVE</Badge>
    </button>
  );
}
