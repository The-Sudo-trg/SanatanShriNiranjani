"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Favorites (brief §6.5) — anonymous, local-only. No accounts, no network:
// saved temples/mantras/wisdom/festivals live in localStorage so personal
// preferences never leave the device (privacy by default, brief §12).

export type FavKind = "temple" | "mantra" | "wisdom" | "festival";

export interface FavItem {
  kind: FavKind;
  slug: string;
  titleHi: string;
  href: string;
  savedAt: number;
}

interface FavoritesState {
  items: FavItem[];
  hydrated: boolean;
  toggle: (item: Omit<FavItem, "savedAt">) => void;
  remove: (kind: FavKind, slug: string) => void;
  clearAll: () => void;
}

const keyOf = (kind: FavKind, slug: string) => `${kind}:${slug}`;

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      toggle: (item) => {
        const id = keyOf(item.kind, item.slug);
        const existing = get().items;
        set({
          items: existing.some((i) => keyOf(i.kind, i.slug) === id)
            ? existing.filter((i) => keyOf(i.kind, i.slug) !== id)
            : [{ ...item, savedAt: Date.now() }, ...existing],
        });
      },
      remove: (kind, slug) =>
        set({ items: get().items.filter((i) => keyOf(i.kind, i.slug) !== keyOf(kind, slug)) }),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: "ssn-favorites",
      storage: createJSONStorage(() => localStorage),
      // hydration flag lets SSR render a stable "not saved" state first
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);

export function isSaved(items: FavItem[], kind: FavKind, slug: string): boolean {
  return items.some((i) => i.kind === kind && i.slug === slug);
}
