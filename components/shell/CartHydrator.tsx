"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart";

// Hydrates the global cart badge on first mount (NAVIGATION §7.4)
export default function CartHydrator() {
  const hydrate = useCartStore((s) => s.hydrate);
  const hydrated = useCartStore((s) => s.hydrated);
  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);
  return null;
}
