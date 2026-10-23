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
// Model: optimistic local counter + serialized server sync. `pending` counts
// un-confirmed taps; the GET in hydrate is ignored while taps are in flight, and
// each sync response reconciles local === server once the chain drains.
export const useMalaStore = create<MalaState>((set, get) => {
  let syncChain: Promise<unknown> = Promise.resolve();
  let pending = 0;

  const enqueue = (body: { delta: number }, applyResponse: (serverCount: number) => void) => {
    syncChain = syncChain
      .then(() =>
        fetch("/api/mala", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
      )
      .then((res) => (res.ok ? res.json() : { count: null }))
      .then((data: { count: number | null }) => {
        if (applyResponse && data.count !== null) applyResponse(data.count);
      })
      .catch(() => undefined);
    return syncChain;
  };

  return {
    count: 0,
    streak: 1,
    hydrated: false,
    hydrate: async () => {
      try {
        await syncChain;
        const res = await fetch("/api/mala");
        if (res.ok) {
          const data = (await res.json()) as { count: number; streak: number };
          // ignore server value while optimistic taps are still un-confirmed
          if (pending === 0) set({ count: data.count, streak: data.streak, hydrated: true });
          else set({ streak: data.streak, hydrated: true });
        } else {
          set({ hydrated: true });
        }
      } catch {
        set({ hydrated: true });
      }
    },
    increment: () => {
      set({ count: get().count + 1 });
      pending += 1;
      enqueue({ delta: 1 }, (serverCount) => {
        pending = Math.max(0, pending - 1);
        if (pending === 0) set({ count: serverCount }); // reconcile अंतर
      });
    },
    reset: () => {
      const previous = get().count;
      set({ count: 0 });
      enqueue({ delta: -previous }, (serverCount) => set({ count: serverCount }));
    },
  };
});

export function todayKey(): string {
  return kolkataDayKey(0);
}
