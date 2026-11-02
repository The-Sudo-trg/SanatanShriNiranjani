"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { TREE_TYPES, PRICES } from "@/lib/constants";
import { localeCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/i18n";

// स्मृति वृक्षारोपण — F2 (₹501, GPS tag + e-certificate promise)
export default function TreePlantationForm({ locale }: { locale: Locale }) {
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  const treeLabels: Record<string, string> = {
    "पीपल (Peepal)": "Peepal",
    "बरगद (Banyan)": "Banyan",
    "बेलपत्र (Belpatra)": "Belpatra",
    "नीम / आंवला": "Neem / Amla",
  };
  const [donorName, setDonorName] = useState("");
  const [treeType, setTreeType] = useState<string>(TREE_TYPES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [lastDonor, setLastDonor] = useState<string | null>(null);
  const treeLabel = locale === "en" ? treeLabels[treeType] ?? "[Tree name translation to be confirmed]" : treeType;

  async function submit() {
    if (submitting) return; // double-submit guard (NAVIGATION §7.5)
    setSubmitting(true);
    const name = donorName.trim();
    try {
      const res = await fetch("/api/gau-seva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorName: name || undefined, kind: "TREE", treeType }),
      });
      const data = (await res.json()) as { donorName?: string; certificateNo?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? c("कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।", "Something went wrong. Please try again."));
      // TC-GS-01/02: thank-you names the donor + tree type
      toast.success(
        c(
          `धन्यवाद ${data.donorName}! ${treeType} का स्मृति वृक्षारोपण अनुरोध स्वीकार कर लिया गया है। GPS टैग और ई-सर्टिफिकेट (प्रमाणांक ${data.certificateNo}) जल्द जारी होगा।`,
          `Thank you, ${data.donorName}! Your memorial tree-planting request for ${treeLabel} has been received. GPS tagging and the e-certificate (reference ${data.certificateNo}) will follow.`
        )
      );
      setLastDonor(data.donorName ?? null);
      setDonorName("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : c("कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।", "Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
        <TreePine className="h-4 w-4 text-emerald-600" aria-hidden />
        <div>
          <h3 className="text-xs font-bold text-emerald-800">{c("स्मृति वृक्षारोपण", "Memorial tree planting")}</h3>
          <p className="text-[10px] text-gray-500">{c("\"अपनों की पवित्र स्मृति में एक पेड़ लगाएं\"", "\"Plant a tree in loving memory of someone dear.\"")}</p>
        </div>
      </div>
      <form
        className="space-y-2 text-xs"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        noValidate
      >
        <div>
          <Label htmlFor="tree-donor">{c("प्रियजन का नाम लिखें:", "Name of the person being remembered:")}</Label>
          <Input suppressHydrationWarning
            id="tree-donor"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder={c("जैसे: स्व. श्री रामप्रसाद जी", "For example: Ram Prasad")}
          />
        </div>
        <div>
          <Label htmlFor="tree-type">{c("पौधे का प्रकार चुनें:", "Choose a tree type:")}</Label>
          <Select id="tree-type" value={treeType} onChange={(e) => setTreeType(e.target.value)}>
            {TREE_TYPES.map((t) => (
              <option key={t} value={t}>
                {locale === "en" ? treeLabels[t] ?? "[Translation to be confirmed]" : t}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" variant="nature" className="w-full py-2.5" disabled={submitting} suppressHydrationWarning>
          {submitting
            ? c("भेजा जा रहा है…", "Submitting…")
            : `${c("वृक्षारोपण हेतु सहयोग दें", "Contribute to tree planting")} (₹${PRICES.TREE_PLANTATION})`}
        </Button>
        {lastDonor && (
          <p className="text-[10px] text-emerald-700">
            {c(`आपका सहयोग दर्ज हो गया है, ${lastDonor}। जय श्री राम।`, `Your contribution has been recorded, ${lastDonor}.`)}
          </p>
        )}
      </form>
    </div>
  );
}
