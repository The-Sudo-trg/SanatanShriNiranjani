import { describe, expect, it } from "vitest";
import { cartTotal, cartBadgeCount, type CartItem } from "@/lib/cart";

// TC-ST-02 — गंगाजल ₹151 + रुद्राक्ष माला ₹351 = ₹502
describe("cart math (rupees as integers)", () => {
  const items: CartItem[] = [
    { productId: "p1", nameHi: "पवित्र गंगो जल", price: 151, qty: 1 },
    { productId: "p2", nameHi: "पाँच मुखी रुद्राक्ष माला", price: 351, qty: 1 },
  ];

  it("totals ₹502 for the canonical pair", () => {
    expect(cartTotal(items)).toBe(502);
  });

  it("counts badge as total quantity", () => {
    expect(cartBadgeCount(items)).toBe(2);
    expect(cartBadgeCount([{ ...items[0], qty: 3 }])).toBe(3);
  });

  it("recomputes on qty change (TC-ST-03)", () => {
    expect(cartTotal([{ ...items[1], qty: 2 }])).toBe(702);
  });

  it("handles empty cart", () => {
    expect(cartTotal([])).toBe(0);
  });
});
