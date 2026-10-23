"use client";

import { useEffect, useState } from "react";

// Kumbh countdown — real clock, Asia/Kolkata anchored, never negative/NaN (TC-KB-02)
export default function Countdown({ targetIso }: { targetIso: string }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    function compute() {
      const target = new Date(targetIso).getTime();
      if (Number.isNaN(target)) {
        setDays(0);
        return;
      }
      setDays(Math.max(0, Math.ceil((target - Date.now()) / (24 * 60 * 60 * 1000))));
    }
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [targetIso]);

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center shadow-sm">
      <p className="text-[10px] uppercase tracking-wider text-gray-500">
        प्रथम शाही स्नान तक शेष दिन
      </p>
      <p className="mt-1 text-3xl font-bold text-saffron tabular-nums">
        {days === null ? "…" : days}
      </p>
      <p className="text-[10px] text-gray-500">हरिद्वार महाकुंभ 2027</p>
    </div>
  );
}
