"use client";

import { useMemo, useState } from "react";
import { Landmark } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useModalStore } from "@/stores/modals";
import type { SaintRow } from "@/lib/content";

// अखाड़ा directory — search + verified chips + स्मृति खंड (F7)
export function AkharaDirectoryModal({ saints }: { saints: SaintRow[] }) {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  const openModal = useModalStore((s) => s.open);
  const [query, setQuery] = useState("");
  const open = active === "AKHARA_DIRECTORY";

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return saints.filter((s) => !s.memorial);
    return saints.filter((s) => !s.memorial && (s.nameHi.includes(q) || s.pad.includes(q)));
  }, [saints, query]);

  // STUB(v2): ashram detail pages — respectful placeholder for now
  function contactStub() {
    toast.message("आश्रम विवरण शीघ्र उपलब्ध होगा।");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          close();
          setQuery("");
        }
      }}
    >
      <DialogContent scrollable className="space-y-4">
        <DialogTitle className="flex items-center gap-2 border-b border-amber-100 pb-2 text-sm font-bold text-maroonText">
          <Landmark className="h-4 w-4 text-saffron" aria-hidden />
          श्री पंचायती अखाड़ा निरंजनी (पदाधिकारी सूची)
        </DialogTitle>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="नाम या पद से खोजें... (जैसे: महामंडलेश्वर)"
          aria-label="पदाधिकारी खोजें"
          className="w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-saffron"
        />
        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="py-3 text-center text-xs text-gray-500">कोई पदाधिकारी नहीं मिला।</p>
          )}
          {filtered.map((s) => (
            <div key={s.id} className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-lg font-bold text-maroonText">
                  ॐ
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{s.nameHi}</h4>
                  <p className="text-[10px] font-semibold text-saffron">पद: {s.pad}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-amber-200 pt-1 text-[10px]">
                {s.verified && <Badge variant="verified">✔ Verified Digital ID (QR Code)</Badge>}
                <button
                  type="button"
                  onClick={contactStub}
                  className="font-bold text-saffron hover:underline"
                >
                  संपर्क / आश्रम विवरण
                </button>
              </div>
            </div>
          ))}

          {/* स्मृति खंड — solemn, stone palette, no playful animation (DESIGN §8) */}
          <div className="space-y-2 rounded-2xl border border-stone-300 bg-stone-100 p-3.5">
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <span aria-hidden>स्मृति खंड (Memorial Profile)</span>
            </h4>
            <p className="text-xs font-bold text-gray-800">ब्रह्मलीन श्री गोल्डन बाबा जी</p>
            <Button
              variant="memorial"
              className="w-full py-1.5 text-[11px]"
              onClick={() => openModal("GOLDEN_BABA")}
            >
              जीवन गाथा एवं संस्मरण देखें
            </Button>
          </div>
        </div>
        <Button variant="primary" size="lg" className="w-full" onClick={close}>
          बंद करें
        </Button>
      </DialogContent>
    </Dialog>
  );
}
