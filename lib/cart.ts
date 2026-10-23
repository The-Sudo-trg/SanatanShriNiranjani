// Pure cart math — rupees as integers everywhere (TESTING.md §13.6)
export interface CartItem {
  productId: string;
  nameHi: string;
  price: number;
  qty: number;
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function cartBadgeCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}
