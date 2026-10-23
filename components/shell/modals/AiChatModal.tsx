"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Bot, Send } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModalStore } from "@/stores/modals";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const INTRO: Msg = {
  role: "assistant",
  content:
    "नमस्ते! मैं सनातन संस्कृति, व्रत नियमों और पूजा-पाठ से जुड़े आपके हर सवाल का उत्तर देने के लिए तैयार हूँ। कृपया ध्यान रखें: बड़े निर्णय हेतु अपने गुरु/आचार्य से परामर्श अवश्य लें।",
};

// AI आध्यात्मिक सहायक — F5 (history persists per session via ChatMessage table)
export function AiChatModal() {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  const open = active === "AI_CHAT";
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    // session key is resolved in an async callback (external system: localStorage)
    const ready = Promise.resolve().then(() => {
      let key = window.localStorage.getItem("ai-session-key");
      if (!key) {
        key = window.crypto.randomUUID();
        window.localStorage.setItem("ai-session-key", key);
      }
      return key;
    });
    ready
      .then((key) => {
        if (cancelled) return;
        setSessionId(key);
        return fetch(`/api/chat?sessionId=${encodeURIComponent(key)}`)
          .then((r) => (r.ok ? r.json() : { messages: [] }))
          .then((d) => {
            if (!cancelled && Array.isArray(d.messages) && d.messages.length > 0) {
              setMessages([INTRO, ...(d.messages as Msg[])]);
            }
          });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, typing]);

  async function send() {
    const content = input.trim();
    if (!content || typing) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content }]);
    setTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, content }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "AI सेवा इस समय उपलब्ध नहीं है, कृपया पुनः प्रयास करें।");
      }
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।");
    } finally {
      setTyping(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="flex max-h-[85vh] flex-col">
        <DialogTitle className="flex items-center gap-2 text-sm font-bold text-maroonText">
          <Bot className="h-4 w-4 text-indigo-600" aria-hidden />
          AI आध्यात्मिक सहायक
        </DialogTitle>
        <div ref={listRef} className="hide-scrollbar flex-1 space-y-2 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-indigo-600 text-white"
                  : "bg-indigo-50 text-indigo-900"
              }`}
            >
              {m.content}
            </div>
          ))}
          {typing && (
            <div className="max-w-[85%] rounded-xl bg-indigo-50 p-3 text-xs text-indigo-900" aria-live="polite">
              उत्तर लिखा जा रहा है…
            </div>
          )}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="अपना प्रश्न यहाँ पूछें..."
            aria-label="अपना प्रश्न लिखें"
          />
          <Button
            type="submit"
            variant="indigo"
            aria-label="प्रश्न भेजें"
            className="h-9 w-9 shrink-0 rounded-full p-0"
            disabled={typing || !input.trim()}
          >
            <Send className="h-4 w-4" aria-hidden />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
