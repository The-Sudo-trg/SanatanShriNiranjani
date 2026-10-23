"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { PRICES } from "@/lib/constants";

// लाइव सत्संग एवं भजन स्ट्रीमर — play/pause icon swap
// STUB(v2): real podcast stream URL; mock audio state per TC-HM-06 (mock audio acceptable)
export default function SatsangPlayer() {
  const [playing, setPlaying] = useState(false);
  void PRICES; // sacred-data import guard (band itself has no price)

  return (
    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-stone-900 to-amber-950 p-3.5 text-white shadow-md">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-gold text-base text-maroonText ${
            playing ? "animate-pulse" : ""
          }`}
        >
          <Play aria-hidden className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-wider text-gold">
            लाइव सत्संग एवं भजन स्ट्रीमर
          </p>
          <h4 className="text-xs font-bold">महामृत्युंजय मंत्र एवं शंखनाद पॉडकास्ट</h4>
        </div>
      </div>
      <button
        type="button"
        aria-label={playing ? "सत्संग रोकें" : "सत्संग चलाएँ"}
        onClick={() => setPlaying((p) => !p)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron text-white shadow transition hover:bg-deepSaffron"
      >
        {playing ? <Pause className="h-3 w-3" aria-hidden /> : <Play className="h-3 w-3" aria-hidden />}
      </button>
    </div>
  );
}
