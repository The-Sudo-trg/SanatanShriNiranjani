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
import { localeCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/i18n";

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
const PRODUCT_NAMES_EN: Record<string, string> = {
  "prod-gangajal": "Holy Ganga water",
  "prod-rudraksh": "Five-faced Rudraksha mala",
  "prod-havan": "Complete havan supplies kit",
  "prod-jyot": "Brass diya wicks (pair)",
  "prod-til": "Black sesame seeds for puja",
  "prod-thali": "Puja thali set",
};

// पूजा स्टोर (M6) — grid + cart sheet + mock checkout (F6)
export default function StoreClient({ products, locale }: { products: ProductRow[]; locale: Locale }) {
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
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
    toast.success(c(`${nameHi} आपके कार्ट में जोड़ दिया गया है!`, "Item added to your cart."));
  }

  async function onCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!buyerName.trim() || !phone.trim()) {
      toast.error(c("कृपया अपना नाम और मोबाइल नंबर लिखें।", "Enter your name and mobile number."));
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
      toast.success(c("आपका ऑर्डर सफलतापूर्वक दर्ज हो गया है। धन्यवाद!", "Your order has been recorded. Thank you."));
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
          <h2 className="text-base font-bold">{c("शुद्ध पूजा सामग्री ई-स्टोर", "Puja supplies store")}</h2>
          <p className="mt-1 text-xs opacity-90">
            {c("अखाड़े द्वारा प्रमाणित रुद्राक्ष, गंगा जल, हवन सामग्री सीधे घर मंगाएं।", "Order Rudraksha, Ganga water, and havan supplies for home delivery.")}
          </p>
        </div>
        <button suppressHydrationWarning
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label={c("कार्ट खोलें", "Open cart")}
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
                  <h4 className="text-xs font-bold text-gray-800">{locale === "en" ? PRODUCT_NAMES_EN[p.id] ?? "[English product name to be confirmed]" : p.nameHi}</h4>
                  {p.certified && (
                    <Badge variant="verified" className="mt-0.5 shrink-0">
                      {c("प्रमाणित", "Verified")}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-[11px] font-bold text-saffron">₹{p.price}</p>
                {p.unit && <p className="text-[10px] text-gray-500">{locale === "en" ? p.unit.replace("ली", "L").replace("माला", "mala").replace("जोड़ी", "pair").replace("ग्राम", "g").replace("किट", "kit").replace("सेट", "set") : p.unit}</p>}
              </div>
              <Button suppressHydrationWarning
                variant="primary"
                className="mt-3 w-full py-1.5 text-[11px]"
                onClick={() => void onAdd(p.id, p.nameHi)}
              >
                {c("कार्ट में जोड़ें", "Add to cart")}
              </Button>
            </div>
          );
        })}
      </div>

      {/* cart sheet */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent scrollable>
          <DialogTitle className="text-sm font-bold text-maroonText">{c("आपका कार्ट", "Your cart")}</DialogTitle>
          {items.length === 0 ? (
            <p className="py-4 text-center text-xs text-gray-500">{c("आपका कार्ट खाली है।", "Your cart is empty.")}</p>
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
                    <button suppressHydrationWarning
                      type="button"
                      aria-label={c("मात्रा घटाएँ", "Decrease quantity")}
                      onClick={() => void setQty(item.productId, item.qty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-700"
                    >
                      <Minus className="h-3 w-3" aria-hidden />
                    </button>
                    <span className="w-5 text-center text-xs font-bold tabular-nums">{item.qty}</span>
                    <button suppressHydrationWarning
                      type="button"
                      aria-label={c("मात्रा बढ़ाएँ", "Increase quantity")}
                      onClick={() => void setQty(item.productId, item.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-saffron text-white"
                    >
                      <Plus className="h-3 w-3" aria-hidden />
                    </button>
                    <button suppressHydrationWarning
                      type="button"
                      aria-label={c("कार्ट से हटाएँ", "Remove from cart")}
                      onClick={() => void remove(item.productId)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-700"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-amber-200 pt-2 text-xs font-bold">
                <span>{c("कुल राशि", "Total")}</span>
                <span className="text-saffron">₹{total}</span>
              </div>
              <Button suppressHydrationWarning
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setCheckoutOpen(true)}
                disabled={items.length === 0}
              >
                {c(`ऑर्डर करें (₹${total})`, `Place order (₹${total})`)}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* checkout form (mock payment) */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent>
          <DialogTitle className="text-sm font-bold text-maroonText">{c("चेकआउट", "Checkout")}</DialogTitle>
          <p className="text-[10px] text-gray-500">
            {c("ऑनलाइन भुगतान उपलब्ध नहीं है — वर्तमान में ऑर्डर केवल अनुरोध के रूप में दर्ज किया जाता है।", "Online payment is unavailable. Orders are recorded as requests only; no payment is collected.")}
          </p>
          <form onSubmit={onCheckout} className="space-y-3" noValidate>
            <Input suppressHydrationWarning
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder={c("आपका नाम", "Your name")}
              aria-label={c("आपका नाम", "Your name")}
            />
            <Input suppressHydrationWarning
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={c("मोबाइल नंबर (10 अंक)", "Mobile number (10 digits)")}
              aria-label={c("मोबाइल नंबर", "Mobile number")}
              inputMode="numeric"
            />
            <Button suppressHydrationWarning type="submit" variant="primary" size="lg" className="w-full" disabled={ordering}>
              {ordering ? c("ऑर्डर दर्ज हो रहा है…", "Recording order…") : c(`ऑर्डर अनुरोध भेजें (₹${total})`, `Submit order request (₹${total})`)}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* order success */}
      <Dialog open={orderDone !== null} onOpenChange={(o) => !o && setOrderDone(null)}>
        <DialogContent className="text-center">
          <DialogTitle className="text-sm font-bold text-maroonText">{c("ऑर्डर अनुरोध दर्ज", "Order request recorded")}</DialogTitle>
          <p className="text-xs leading-relaxed text-gray-600">
            {c(
              `आपका ऑर्डर अनुरोध #${orderDone?.id.slice(-6).toUpperCase()} (₹${orderDone?.total}) दर्ज हो गया है। अखाड़ा सेवा दल शीघ्र संपर्क करेगा।`,
              `Your order request #${orderDone?.id.slice(-6).toUpperCase()} (₹${orderDone?.total}) has been recorded. The Akhara seva team will contact you.`
            )}
          </p>
          <Button suppressHydrationWarning variant="primary" size="lg" className="w-full" onClick={() => setOrderDone(null)}>
            {c("ठीक है", "Close")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
