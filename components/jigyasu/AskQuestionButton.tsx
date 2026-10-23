"use client";

import { PlusCircle } from "lucide-react";
import { useModalStore } from "@/stores/modals";

// "अपना नया प्रश्न पूछें" → AiChatSheet (TC-FO-02)
export default function AskQuestionButton() {
  const openModal = useModalStore((s) => s.open);
  return (
    <button
      type="button"
      onClick={() => openModal("AI_CHAT")}
      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow transition hover:bg-indigo-700"
    >
      <PlusCircle className="h-4 w-4" aria-hidden />
      अपना नया प्रश्न पूछें
    </button>
  );
}
