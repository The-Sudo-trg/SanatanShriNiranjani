"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCartStore, selectCartTotal } from "@/stores/cart";
import { cartBadgeCount } from "@/lib/cart";

interface ProductRow {
  id: string;
  nameHi: string;
  price: number;
  unit: string | null;
  icon: string;
  certified: boolean;
}

// icon map — lucide only (DESIGN §6); seeded icon names resolve here
import { Circle, CircleDot, Droplets, Flame, Sparkles, UtensilsCrossed } from "lucide-react";
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  CircleDot,
  Flame,
  Sparkles,
  Circle,
  UtensilsCrossed,
};

// पूजा स्टोर (M6) — grid + cart sheet + mock checkout (F6)
export default function StoreClient({ products }: { products: ProductRow[] }) {
  const { items, hydrate, hydrated, add, setQty, remove, checkout } = useCartStore();
  const total = useCartStore(selectCartTotal);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [phone, setPhone] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderDone, setOrderDone] = useState<{ id: string; total: number } | null>(null);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);

  async function onAdd(id: string, nameHi: string) {
    await add(id);
    toast.success(`${nameHi} आपके कार्ट में जोड़ दिया गया है!`);
  }

  async function onCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!buyerName.trim() || !phone.trim()) {
      toast.error("कृपया अपना नाम और मोबाइल नंबर लिखें।");
      return;
    }
    setOrdering(true);
    try {
      const order = await checkout(buyerName.trim(), phone.trim());
      setOrderDone({ id: order.orderId, total: order.total });
      setCheckoutOpen(false);
      setCartOpen(false);
      setBuyerName("");
      setPhone("");
      toast.success("आपका ऑर्डर सफलतापूर्वक दर्ज हो गया है। धन्यवाद!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।");
    } finally {
      setOrdering(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white shadow-md">
        <div>
          <h2 className="text-base font-bold">शुद्ध पूजा सामग्री ई-स्टोर</h2>
          <p className="mt-1 text-xs opacity-90">
            अखाड़े द्वारा प्रमाणित रुद्राक्ष, गंगा जल, हवन सामग्री सीधे घर मंगाएं।
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label="कार्ट खोलें"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/20"
        >
          <ShoppingCart className="h-5 w-5" aria-hidden />
          {cartBadgeCount(items) > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-maroonText">
              {cartBadgeCount(items)}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => {
          const Icon = ICONS[p.icon] ?? Sparkles;
          return (
            <div
              key={p.id}
              className="flex flex-col justify-between rounded-2xl border border-amber-100 bg-white p-3 shadow-sm"
            >
              <div>
                <div className="mb-2 flex h-24 w-full items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Icon className="h-9 w-9" aria-hidden />
                </div>
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-xs font-bold text-gray-800">{p.nameHi}</h4>
                  {p.certified && (
                    <Badge variant="verified" className="mt-0.5 shrink-0">
                      प्रमाणित
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-[11px] font-bold text-saffron">₹{p.price}</p>
                {p.unit && <p className="text-[10px] text-gray-500">{p.unit}</p>}
              </div>
              <Button
                variant="primary"
                className="mt-3 w-full py-1.5 text-[11px]"
                onClick={() => void onAdd(p.id, p.nameHi)}
              >
                कार्ट में जोड़ें
              </Button>
            </div>
          );
        })}
      </div>

      {/* cart sheet */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent scrollable>
          <DialogTitle className="text-sm font-bold text-maroonText">आपका कार्ट</DialogTitle>
          {items.length === 0 ? (
            <p className="py-4 text-center text-xs text-gray-500">आपका कार्ट खाली है।</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-gray-800">{item.nameHi}</p>
                    <p className="text-[10px] text-gray-500">
                      ₹{item.price} × {item.qty} = ₹{item.price * item.qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="मात्रा घटाएँ"
                      onClick={() => void setQty(item.productId, item.qty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-700"
                    >
                      <Minus className="h-3 w-3" aria-hidden />
                    </button>
                    <span className="w-5 text-center text-xs font-bold tabular-nums">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="मात्रा बढ़ाएँ"
                      onClick={() => void setQty(item.productId, item.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-saffron text-white"
                    >
                      <Plus className="h-3 w-3" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label="कार्ट से हटाएँ"
                      onClick={() => void remove(item.productId)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-700"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-amber-200 pt-2 text-xs font-bold">
                <span>कुल राशि</span>
                <span className="text-saffron">₹{total}</span>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setCheckoutOpen(true)}
                disabled={items.length === 0}
              >
                ऑर्डर करें (₹{total})
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* checkout form (mock payment) */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent>
          <DialogTitle className="text-sm font-bold text-maroonText">चेकआउट</DialogTitle>
          <p className="text-[10px] text-gray-500">
            भुगतान प्रणाली शीघ्र — वर्तमान में ऑर्डर केवल दर्ज किया जाता है। (मॉक)
          </p>
          <form onSubmit={onCheckout} className="space-y-3" noValidate>
            <Input
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="आपका नाम"
              aria-label="आपका नाम"
            />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="मोबाइल नंबर (10 अंक)"
              aria-label="मोबाइल नंबर"
              inputMode="numeric"
            />
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={ordering}>
              {ordering ? "ऑर्डर दर्ज हो रहा है…" : `ऑर्डर पुष्ट करें (₹${total})`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* order success */}
      <Dialog open={orderDone !== null} onOpenChange={(o) => !o && setOrderDone(null)}>
        <DialogContent className="text-center">
          <DialogTitle className="text-sm font-bold text-maroonText">ऑर्डर सफल</DialogTitle>
          <p className="text-xs leading-relaxed text-gray-600">
            आपका ऑर्डर <strong>#{orderDone?.id.slice(-6).toUpperCase()}</strong> (₹{orderDone?.total})
            दर्ज हो गया है। अखाड़ा सेवा दल शीघ्र संपर्क करेगा। धन्यवाद!
          </p>
          <Button variant="primary" size="lg" className="w-full" onClick={() => setOrderDone(null)}>
            ठीक है
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
