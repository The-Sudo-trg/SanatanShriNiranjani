"use client";

import { QRCodeSVG } from "qrcode.react";
import { BadgeCheck } from "lucide-react";
import { BHAKT_ID } from "@/lib/constants";
import { roleLabelKey, t, type Locale } from "@/lib/i18n";
import { localeCopy } from "@/lib/locale-copy";

interface DigitalIdUser {
  name: string;
  role: string;
}

// डिजिटल परिचय पत्र — SN-2027-9842, QR placeholder rendered as real QR of the ID (M7).
// Day 3 — role-aware: the pass shows the account's real identity; rendered
// logged-out it keeps the v1 static content (SN-2027-9842 contract tests).
export default function DigitalId({ locale, user }: { locale: Locale; user?: DigitalIdUser | null }) {
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  return (
    <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3">
      <div>
        <p className="text-[10px] text-gray-500">{c("आईडी नंबर:", "ID:")} {BHAKT_ID}</p>
        {user ? (
          <>
            <p className="mt-0.5 truncate text-xs font-bold text-maroonText">{user.name}</p>
            <span className="mt-0.5 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800">
              {t(locale, roleLabelKey(user.role))}
            </span>
          </>
        ) : (
          <p className="mt-0.5 text-xs font-bold text-maroonText">{c("भक्त एवं सेवा सहयोगी", "Devotee and seva volunteer")}</p>
        )}
        <span className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">
          <BadgeCheck className="h-3 w-3" aria-hidden /> {c("क्यूआर सत्यापित", "QR verified")}
        </span>
      </div>
      <div className="rounded-lg border border-amber-300 bg-white p-1">
        <QRCodeSVG value={BHAKT_ID} size={56} aria-label={c("भक्त आईडी क्यूआर कोड", "Devotee ID QR code")} />
      </div>
    </div>
  );
}
