"use client";

import { PlusCircle } from "lucide-react";
import { useModalStore } from "@/stores/modals";
import { localeCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/i18n";

// "अपना नया प्रश्न पूछें" → AiChatSheet (TC-FO-02)
export default function AskQuestionButton({ locale }: { locale: Locale }) {
  const openModal = useModalStore((s) => s.open);
  return (
    <button
      type="button"
      onClick={() => openModal("AI_CHAT")}
      suppressHydrationWarning
      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow transition hover:bg-indigo-700"
    >
      <PlusCircle className="h-4 w-4" aria-hidden />
      {localeCopy(locale, "अपना नया प्रश्न पूछें", "Ask a question")}
    </button>
  );
}
