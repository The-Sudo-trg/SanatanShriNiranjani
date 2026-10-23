"use client";

import { useModalStore } from "@/stores/modals";

// "संत दर्शन" CTA → SouthSaintsModal (TC-HM-05)
export default function SouthSaintsButton() {
  const openModal = useModalStore((s) => s.open);
  return (
    <button
      type="button"
      onClick={() => openModal("SOUTH_SAINTS")}
      className="mt-2 rounded-full bg-amber-600 px-3 py-1 text-[10px] font-medium text-white shadow transition hover:bg-amber-700"
    >
      संत दर्शन
    </button>
  );
}
