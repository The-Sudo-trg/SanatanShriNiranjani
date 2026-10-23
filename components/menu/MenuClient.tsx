"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartHandshake, ScrollText, Users } from "lucide-react";
import DigitalId from "./DigitalId";
import DirectorySection, { CertificateDialog } from "./DirectorySection";
import { useModalStore } from "@/stores/modals";
import type { SaintRow } from "@/lib/content";

// मेनू / Profile page body (M7) — TC-MN-01 checklist
export default function MenuClient({ saints }: { saints: SaintRow[] }) {
  const [certOpen, setCertOpen] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const openModal = useModalStore((s) => s.open);

  return (
    <div className="space-y-4">
      {/* profile card */}
      <div className="rounded-2xl bg-gradient-to-r from-saffron to-deepSaffron p-4 text-center text-white shadow-md">
        <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-white text-3xl font-bold text-maroonText shadow-lg">
          DP
        </div>
        <h2 className="text-base font-bold">देश प्रेमी</h2>
        <p className="text-xs opacity-90">श्री पंचायती अखाड़ा निरंजनी - पंजीकृत सनातन भक्त</p>
      </div>

      {/* digital ID + actions */}
      <div className="space-y-3 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
          डिजिटल परिचय पत्र (Digital ID & Certificate)
        </h3>
        <DigitalId />
        <button
          type="button"
          onClick={() => setShowDirectory((v) => !v)}
          suppressHydrationWarning
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-600 py-2 text-xs font-bold text-white shadow transition hover:bg-amber-700"
        >
          <Users className="h-4 w-4" aria-hidden />
          श्री पंचायती अखाड़ा निरंजनी (पदाधिकारी सूची)
        </button>
        {showDirectory && <DirectorySection saints={saints} />}
        <Link
          href="/bookings"
          suppressHydrationWarning
          className="flex w-full items-center justify-center rounded-xl bg-stone-800 py-2 text-xs font-bold text-white shadow transition hover:bg-stone-900"
        >
          मेरी बुकिंग देखें
        </Link>
      </div>

      {/* volunteer + certificate */}
      <div className="space-y-3 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">सेवा एवं संकल्प</h3>
        <button
          type="button"
          onClick={() => openModal("VOLUNTEER")}
          suppressHydrationWarning
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white shadow transition hover:bg-indigo-700"
        >
          <HeartHandshake className="h-4 w-4" aria-hidden />
          निरंजनी युवा सेवा दल (Volunteer) पंजीकरण
        </button>
        <button
          type="button"
          onClick={() => setCertOpen(true)}
          suppressHydrationWarning
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-saffron py-2 text-xs font-bold text-white shadow transition hover:bg-deepSaffron"
        >
          <ScrollText className="h-4 w-4" aria-hidden />
          संकल्प ई-सर्टिफिकेट डाउनलोड करें
        </button>
      </div>

      <CertificateDialog open={certOpen} onClose={() => setCertOpen(false)} />
    </div>
  );
}
