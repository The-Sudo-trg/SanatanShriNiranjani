"use client";

import { Sparkles } from "lucide-react";
import { useModalStore } from "@/stores/modals";

// Suvichar strip + अखाड़ा सूची shortcut (TC-HM-04)
export function SuvicharStrip({ text, source }: { text: string; source: string }) {
  const openModal = useModalStore((s) => s.open);
  return (
    <div className="flex items-center justify-between rounded-r-xl border-l-4 border-saffron bg-amber-50 p-3 shadow-sm">
      <p className="flex items-center gap-1 text-xs font-medium italic text-maroonText">
        <Sparkles className="h-3 w-3 shrink-0 text-saffron" aria-hidden />
        &quot;{text}&quot; ({source})
      </p>
      <button
        type="button"
        onClick={() => openModal("AKHARA_DIRECTORY")}
        className="ml-2 whitespace-nowrap rounded-lg bg-saffron px-2.5 py-1 text-[10px] font-bold text-white shadow"
      >
        अखाड़ा सूची
      </button>
    </div>
  );
}
