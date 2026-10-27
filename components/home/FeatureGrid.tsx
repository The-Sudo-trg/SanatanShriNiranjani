"use client";

import Link from "next/link";
import { HousePlug, Landmark, Store, Video } from "lucide-react";
import { useModalStore } from "@/stores/modals";
import CowIcon from "@/components/icons/CowIcon";

// NAVIGATION §3.1 — feature grid: each tile opens its modal/page (TC-HM-02).
// The "AI जिज्ञासा" tile was removed from the landing grid on owner request
// (chat support removed from the homepage); the AI सहायक stays reachable from
// /jigyasu where the forum lives.
const TILES = [
  { label: "लाइव दर्शन", modal: "LIVE_DARSHAN", Icon: Video, tile: "bg-orange-100 text-saffron" },
  { label: "कुंभ 2027", href: "/kumbh-2027", Icon: Landmark, tile: "bg-yellow-100 text-amber-600" },
  { label: "गौ सेवा", href: "/gau-seva", Icon: CowIcon, tile: "bg-amber-100 text-amber-700" },
  { label: "पूजा स्टोर", href: "/store", Icon: Store, tile: "bg-red-100 text-red-600" },
  { label: "संत बुकिंग", modal: "BOOKING", Icon: HousePlug, tile: "bg-blue-100 text-blue-600" },
] as const;

type Tile = (typeof TILES)[number];

export default function FeatureGrid() {
  const openModal = useModalStore((s) => s.open);

  function tileBody(tile: Tile) {
    return (
      <>
        <div
          className={`mb-1.5 flex h-11 w-11 items-center justify-center rounded-xl transition group-hover:scale-110 ${tile.tile}`}
        >
          <tile.Icon className="h-5 w-5" aria-hidden />
        </div>
        <span className="text-[11px] font-semibold text-gray-700">{tile.label}</span>
      </>
    );
  }

  return (
    <div>
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-gray-700">
        मुख्य सेवाएँ एवं सुविधाएँ
      </h3>
      <div className="grid grid-cols-3 gap-3 text-center sm:grid-cols-4 lg:grid-cols-5 lg:gap-4">
        {TILES.map((tile) =>
          "modal" in tile && tile.modal ? (
            <button
              key={tile.label}
              type="button"
              onClick={() => openModal(tile.modal as never)}
              suppressHydrationWarning
              className="group flex min-h-11 cursor-pointer flex-col items-center justify-center rounded-2xl border border-amber-100 bg-white p-3 shadow-sm transition hover:bg-amber-50 lg:p-4"
            >
              {tileBody(tile)}
            </button>
          ) : (
            <Link
              key={tile.label}
              href={tile.href}
              suppressHydrationWarning
              className="group flex min-h-11 cursor-pointer flex-col items-center justify-center rounded-2xl border border-amber-100 bg-white p-3 shadow-sm transition hover:bg-amber-50 lg:p-4"
            >
              {tileBody(tile)}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
