"use client";

import { useEffect, useState } from "react";
import { Bell, Image as ImageIcon, MapPin, PlayCircle } from "lucide-react";
import CowIcon from "@/components/icons/CowIcon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useModalStore } from "@/stores/modals";
import { GOLDEN_BABA_PHOTO } from "@/lib/constants";
import type { SaintRow, TempleRow } from "@/lib/content";

// पास के मंदिर एवं अखाड़ा केंद्र (seeded Temple rows)
export function NearbyModal({ temples }: { temples: TempleRow[] }) {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  return (
    <Dialog open={active === "NEARBY"} onOpenChange={(o) => !o && close()}>
      <DialogContent scrollable>
        <DialogTitle className="flex items-center gap-2 text-sm font-bold text-maroonText">
          <MapPin className="h-4 w-4 text-saffron" aria-hidden />
          पास के मंदिर एवं अखाड़ा केंद्र
        </DialogTitle>
        <div className="space-y-2 text-xs">
          {temples.map((t, i) => (
            <div key={t.id} className="rounded-xl border border-amber-200 bg-amber-50 p-2.5">
              <p className="font-bold text-gray-800">
                {i + 1}. {t.nameHi}
              </p>
              <p className="text-[10px] text-gray-500">{t.distanceText}</p>
            </div>
          ))}
        </div>
        <Button variant="primary" size="lg" className="w-full" onClick={close}>
          बंद करें
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// अखाड़ा मंदिर लाइव दर्शन
// STUB(v2): real stream — replace placeholder with YouTube Live/HLS (TECH_STACK §7.4)
export function LiveDarshanModal() {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  return (
    <Dialog open={active === "LIVE_DARSHAN"} onOpenChange={(o) => !o && close()}>
      <DialogContent className="text-center">
        <DialogTitle className="text-sm font-bold text-maroonText">अखाड़ा मंदिर लाइव दर्शन</DialogTitle>
        <div className="relative flex h-40 w-full items-center justify-center rounded-2xl bg-stone-900 text-white">
          <PlayCircle className="h-10 w-10 animate-bounce text-gold" aria-hidden />
          <span className="absolute left-2 top-2">
            <Badge variant="live">● LIVE</Badge>
          </span>
        </div>
        <p className="text-[11px] text-gray-600">श्री पंचायती अखाड़ा निरंजनी मुख्य मंदिर से सीधा प्रसारण</p>
        <Button variant="primary" size="lg" className="w-full" onClick={close}>
          बंद करें
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// श्री निरंजनी गौशाला लाइव कैमरा
// STUB(v2): real camera feed
export function LiveGauModal() {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  return (
    <Dialog open={active === "LIVE_GAU"} onOpenChange={(o) => !o && close()}>
      <DialogContent className="text-center">
        <DialogTitle className="text-sm font-bold text-maroonText">
          श्री निरंजनी गौशाला लाइव कैमरा
        </DialogTitle>
        <div className="relative flex h-40 w-full items-center justify-center rounded-2xl bg-amber-900 text-white">
          <CowIcon className="h-10 w-10 animate-pulse text-gold" aria-hidden />
          <span className="absolute left-2 top-2">
            <Badge variant="live">● LIVE FEED</Badge>
          </span>
        </div>
        <p className="text-[11px] text-gray-600">गौशाला प्रांगण से सीधा प्रसारण चल रहा है।</p>
        <Button variant="primary" size="lg" className="w-full" onClick={close}>
          बंद करें
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// दक्षिण भारत के संत एवं आचार्य दर्शन
export function SouthSaintsModal({ saints }: { saints: SaintRow[] }) {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  const southMasters = saints.filter((s) => !s.memorial && s.order >= 3);
  return (
    <Dialog open={active === "SOUTH_SAINTS"} onOpenChange={(o) => !o && close()}>
      <DialogContent scrollable>
        <DialogTitle className="text-sm font-bold text-maroonText">
          दक्षिण भारत के संत एवं आचार्य दर्शन
        </DialogTitle>
        <p className="text-xs leading-relaxed text-gray-600">
          स्वामी चिन्मयानंद सरस्वती, श्री नारायण गुरु और दक्षिण भारत के अन्य महान संतों की पावन जीवनी व
          दर्शन जो सनातन संस्कृति को अलौकिक ऊर्जा प्रदान करते हैं।
        </p>
        <div className="space-y-2">
          {southMasters.map((s) => (
            <div key={s.id} className="rounded-xl border border-amber-200 bg-amber-50 p-2.5">
              <p className="text-xs font-bold text-gray-800">{s.nameHi}</p>
              <p className="text-[10px] text-gray-500">{s.originHi}</p>
              <p className="mt-1 text-[11px] text-gray-600">{s.bioHi}</p>
            </div>
          ))}
        </div>
        <Button variant="primary" size="lg" className="w-full" onClick={close}>
          बंद करें
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// गोल्डन बाबा जीवन गाथा — memorial stays solemn (DESIGN §8)
export function GoldenBabaModal({ saints }: { saints: SaintRow[] }) {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  const baba = saints.find((s) => s.memorial);
  return (
    <Dialog open={active === "GOLDEN_BABA"} onOpenChange={(o) => !o && close()}>
      <DialogContent scrollable>
        <div className="text-center">
          <img
            src={GOLDEN_BABA_PHOTO}
            alt="ब्रह्मलीन श्री गोल्डन बाबा जी"
            className="mx-auto mb-2 h-24 w-24 rounded-full border-4 border-gold object-cover shadow-md"
          />
          <DialogTitle className="text-sm font-bold text-maroonText">
            {baba?.nameHi ?? "महामंडलेश्वर एस.के. नारायण गिरि (गोल्डन बाबा)"}
          </DialogTitle>
          <p className="text-xs font-semibold text-saffron">श्री पंचायती अखाड़ा निरंजनी</p>
        </div>
        <div className="space-y-2 text-xs leading-relaxed text-gray-600">
          <p>
            <strong>मूल निवास:</strong> केरल (दक्षिण भारत), वर्तमान में दिल्ली व हरिद्वार।
          </p>
          <p>
            <strong>साधना एवं आभूषण:</strong> महाकुंभ मेलों में लगभग 4 किलोग्राम स्वर्ण आभूषण धारण
            करने वाले प्रसिद्ध संत। यह रूप बाहरी दिखावे के लिए नहीं, बल्कि कठोर साधना और गुरु भक्ति का
            प्रतीक है।
          </p>
          <p>
            <strong>योगदान:</strong> सनातन धर्म के प्रचार-प्रसार और शिक्षा के क्षेत्र में सक्रिय
            योगदान।
          </p>
        </div>
        <Button variant="primary" size="lg" className="w-full" onClick={close}>
          बंद करें
        </Button>
      </DialogContent>
    </Dialog>
  );
}

interface NotificationItem {
  id: string;
  titleHi: string;
  bodyHi: string;
  read: boolean;
}

// सूचनाएँ एवं शुभ मुहूर्त अलर्ट — opening marks all read (F9)
export function NotificationModal() {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  const open = active === "NOTIFICATION";
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));
    // mark all read after rendering the list
    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markAllRead" }),
    }).catch(() => undefined);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent scrollable>
        <DialogTitle className="flex items-center gap-2 text-sm font-bold text-maroonText">
          <Bell className="h-4 w-4 text-saffron" aria-hidden />
          सूचनाएँ एवं शुभ मुहूर्त अलर्ट
        </DialogTitle>
        <div className="space-y-2 text-xs">
          {items.length === 0 && (
            <p className="py-4 text-center text-xs text-gray-500">जल्द ही उपलब्ध होगा।</p>
          )}
          {items.map((n) => (
            <div key={n.id} className="rounded-xl border border-amber-200 bg-amber-50 p-2.5">
              <p className="font-bold text-gray-800">{n.titleHi}</p>
              <p className="text-[10px] text-gray-500">{n.bodyHi}</p>
            </div>
          ))}
        </div>
        <Button variant="primary" size="lg" className="w-full" onClick={close}>
          ठीक है
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// Memorial image icon re-export guard (keeps lucide-only rule explicit)
export const _memorialIcon = ImageIcon;
