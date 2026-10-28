"use client";

import { QRCodeSVG } from "qrcode.react";
import { BadgeCheck } from "lucide-react";
import { BHAKT_ID } from "@/lib/constants";
import { roleLabelKey, t, type Locale } from "@/lib/i18n";

interface DigitalIdUser {
  name: string;
  role: string;
}

// डिजिटल परिचय पत्र — SN-2027-9842, QR placeholder rendered as real QR of the ID (M7).
// Day 3 — role-aware: the pass shows the account's real identity; rendered
// logged-out it keeps the v1 static content (SN-2027-9842 contract tests).
export default function DigitalId({ locale, user }: { locale: Locale; user?: DigitalIdUser | null }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3">
      <div>
        <p className="text-[10px] text-gray-500">आईडी नंबर: {BHAKT_ID}</p>
        {user ? (
          <>
            <p className="mt-0.5 truncate text-xs font-bold text-maroonText">{user.name}</p>
            <span className="mt-0.5 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800">
              {t(locale, roleLabelKey(user.role))}
            </span>
          </>
        ) : (
          <p className="mt-0.5 text-xs font-bold text-maroonText">भक्त एवं सेवा सहयोगी</p>
        )}
        <span className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">
          <BadgeCheck className="h-3 w-3" aria-hidden /> क्यूआर सत्यापित
        </span>
      </div>
      <div className="rounded-lg border border-amber-300 bg-white p-1">
        <QRCodeSVG value={BHAKT_ID} size={56} aria-label="भक्त आईडी क्यूआर कोड" />
      </div>
    </div>
  );
}
