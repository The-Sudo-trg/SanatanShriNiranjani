"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useModalStore } from "@/stores/modals";
import type { SaintRow } from "@/lib/content";

// अखाड़ा directory (menu variant) — search filter, verified chip, स्मृति खंड (TC-DR-01..03)
export default function DirectorySection({ saints }: { saints: SaintRow[] }) {
  const [query, setQuery] = useState("");
  const openModal = useModalStore((s) => s.open);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return saints.filter((s) => !s.memorial);
    return saints.filter((s) => !s.memorial && (s.nameHi.includes(q) || s.pad.includes(q)));
  }, [saints, query]);

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="नाम या पद से खोजें... (जैसे: महामंडलेश्वर)"
        aria-label="पदाधिकारी खोजें"
        className="w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-saffron"
      />
      {filtered.length === 0 && (
        <p className="py-3 text-center text-xs text-gray-500">कोई पदाधिकारी नहीं मिला।</p>
      )}
      {filtered.map((s) => (
        <div key={s.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-bold text-maroonText">
              ॐ
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-xs font-bold text-gray-800">{s.nameHi}</h4>
              <p className="text-[10px] font-semibold text-saffron">पद: {s.pad}</p>
            </div>
          </div>
          {s.verified && (
            <div className="mt-2 border-t border-amber-200 pt-2">
              <Badge variant="verified">✔ Verified Digital ID (QR Code)</Badge>
            </div>
          )}
        </div>
      ))}

      {/* स्मृति खंड — memorial block (solemn) */}
      <div className="space-y-2 rounded-2xl border border-stone-300 bg-stone-100 p-3.5">
        <h4 className="text-xs font-bold text-stone-800">स्मृति खंड (Memorial Profile)</h4>
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
  );
}

// संकल्प ई-सर्टिफिकेट — clean UI now, PDF v2 (PRD §9.3)
export function CertificateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogTitle className="text-center text-sm font-bold text-maroonText">
          संकल्प ई-प्रमाण पत्र
        </DialogTitle>
        <div className="rounded-2xl border-2 border-gold bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center">
          <p className="text-2xl font-bold text-maroonText">ॐ</p>
          <p className="mt-1 text-xs text-gray-600">श्री पंचायती अखाड़ा निरंजनी</p>
          <p className="mt-3 text-[10px] uppercase tracking-wider text-gray-500">प्रमाणित किया जाता है कि</p>
          <p className="mt-1 text-sm font-bold text-maroonText">देश प्रेमी</p>
          <p className="mt-1 text-[11px] text-gray-600">
            भक्त एवं सेवा सहयोगी (आईडी: SN-2027-9842) ने सनातन सेवा हेतु अपना संकल्प प्रदान किया है।
          </p>
          <p className="mt-3 text-[9px] text-gray-500">डिजिटल प्रमाणपत्र • sanatanniranjani.in</p>
        </div>
        <Button
          variant="primary"
          className="w-full"
          onClick={() => toast.message("PDF डाउनलोड शीघ्र उपलब्ध होगा।")}
        >
          डाउनलोड करें
        </Button>
      </DialogContent>
    </Dialog>
  );
}
