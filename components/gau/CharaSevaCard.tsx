"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Wheat } from "lucide-react";
import { PRICES } from "@/lib/constants";

const TIERS = [
  {
    kind: "CHARA_DAILY" as const,
    title: "1 दिन का हरा चारा दान",
    meta: "गौ माता के लिए पौष्टिक आहार सहयोग",
    amount: PRICES.CHARA_DAILY,
  },
  {
    kind: "CHARA_MONTHLY" as const,
    title: "गोवंश गोद लें (Monthly Adoption)",
    meta: "1 माह तक एक गोवंश के चारे का संपूर्ण खर्च",
    amount: PRICES.CHARA_MONTHLY,
  },
];

// गौशाला चारा सेवा एवं गोवंश गोद — F3 (₹510 / ₹2100, TC-GS-06: exact prices only)
export default function CharaSevaCard() {
  const [pending, setPending] = useState<string | null>(null);

  async function contribute(kind: string, title: string, amount: number) {
    if (pending) return;
    setPending(kind);
    try {
      const res = await fetch("/api/gau-seva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।");
      toast.success(`${title} (₹${amount}) हेतु आपका सहयोग सफलतापूर्वक प्राप्त हो गया है।`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
      <h3 className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
        <Wheat className="h-4 w-4 text-amber-600" aria-hidden />
        गौशाला चारा सेवा एवं गोवंश गोद लें
      </h3>
      <div className="space-y-2">
        {TIERS.map((tier) => (
          <button
            key={tier.kind}
            type="button"
            onClick={() => void contribute(tier.kind, tier.title, tier.amount)}
            disabled={pending !== null}
            className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3 text-left transition hover:bg-amber-100 disabled:opacity-60"
          >
            <div>
              <p className="text-xs font-bold text-gray-800">{tier.title}</p>
              <p className="text-[10px] text-gray-500">{tier.meta}</p>
            </div>
            <span className="rounded-lg bg-saffron px-2.5 py-1 text-xs font-bold text-white">
              {pending === tier.kind ? "…" : `₹${tier.amount}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
