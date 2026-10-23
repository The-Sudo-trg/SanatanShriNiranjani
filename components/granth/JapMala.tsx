"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useMalaStore } from "@/stores/mala";

// डिजिटल जप माला — F4 (persisted per day, TC-ML-01..04)
export default function JapMala() {
  const { count, streak, hydrate, increment, reset } = useMalaStore();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  function onReset() {
    if (window.confirm("क्या आप वाकई काउंट रीसेट करना चाहते हैं?")) {
      reset();
      toast.success("जप काउंट रीसेट कर दिया गया है।");
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center shadow-sm">
      <h3 className="text-xs font-bold text-maroonText">डिजिटल जप माला काउंटर</h3>
      {/* tabular numerals, saffron 3xl (DESIGN §3) */}
      <div className="text-3xl font-bold text-saffron tabular-nums" aria-live="polite">
        {count}
      </div>
      <p className="text-[10px] text-gray-500">
        ओम नमः शिवाय / महामृत्युंजय मंत्र जप • दैनिक स्ट्रीक: {streak} दिन
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={increment}
          suppressHydrationWarning
          className="flex-1 rounded-xl bg-saffron py-2.5 text-xs font-bold text-white shadow transition hover:bg-deepSaffron active:scale-[0.98]"
        >
          मंत्र जप करें (+1)
        </button>
        <button
          type="button"
          onClick={onReset}
          suppressHydrationWarning
          className="rounded-xl bg-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-300"
        >
          रीसेट
        </button>
      </div>
    </div>
  );
}
