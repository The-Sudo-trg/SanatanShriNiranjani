"use client";

import { create } from "zustand";
import { kolkataDayKey } from "@/lib/dates";

interface MalaState {
  count: number;
  streak: number;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  increment: () => void;
  reset: () => void;
}

// Jap count persists per Asia/Kolkata day key (TESTING.md §13.4) via /api/mala.
export const useMalaStore = create<MalaState>((set, get) => ({
  count: 0,
  streak: 1,
  hydrated: false,
  hydrate: async () => {
    try {
      const res = await fetch("/api/mala");
      if (res.ok) {
        const data = (await res.json()) as { count: number; streak: number };
        set({ count: data.count, streak: data.streak, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },
  increment: () => {
    // optimistic +1; fire-and-forget sync (offline PWA-tolerant)
    set({ count: get().count + 1 });
    void fetch("/api/mala", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta: 1 }),
    });
  },
  reset: () => {
    const previous = get().count;
    set({ count: 0 });
    void fetch("/api/mala", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta: -previous }),
    });
  },
}));

export function todayKey(): string {
  return kolkataDayKey(0);
}
