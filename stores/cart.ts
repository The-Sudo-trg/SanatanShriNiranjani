"use client";

import { create } from "zustand";
import { cartBadgeCount, cartTotal, type CartItem } from "@/lib/cart";

interface CartState {
  items: CartItem[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  add: (productId: string) => Promise<void>;
  setQty: (productId: string, qty: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clearLocal: () => void;
  checkout: (buyerName: string, phone: string) => Promise<{ orderId: string; total: number }>;
}

// Cart persists server-side (CartLine table) — survives refresh (TC-ST-06)
export const useCartStore = create<CartState>((set) => ({
  items: [],
  hydrated: false,
  hydrate: async () => {
    const res = await fetch("/api/cart");
    if (res.ok) set({ items: (await res.json()).items ?? [], hydrated: true });
  },
  add: async (productId) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) set({ items: (await res.json()).items ?? [] });
  },
  setQty: async (productId, qty) => {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty }),
    });
    if (res.ok) set({ items: (await res.json()).items ?? [] });
  },
  remove: async (productId) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) set({ items: (await res.json()).items ?? [] });
  },
  clearLocal: () => set({ items: [] }),
  checkout: async (buyerName, phone) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerName, phone }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? "कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।");
    }
    const order = (await res.json()) as { id: string; total: number };
    set({ items: [] });
    return { orderId: order.id, total: order.total };
  },
}));

export const selectCartBadge = (s: CartState) => cartBadgeCount(s.items);
export const selectCartTotal = (s: CartState) => cartTotal(s.items);
