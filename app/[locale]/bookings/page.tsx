import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: localeCopy(locale, "मेरी बुकिंग", "Bookings and bhandara"),
    description: localeCopy(locale, "सेवा बुकिंग देखें। भण्डारा बुकिंग उपलब्धता और लागत कॉन्फ़िगर होने तक बन्द है।", "View seva bookings. Bhandara booking is unavailable until availability and pricing are configured."),
  };
}

// मेरी बुकिंग (M2) — status chips प्रतीक्षारत/पुष्ट (F1 last leg)
export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  GADI_PUJA: "गाड़ी पूजन",
  NAMKARAN: "नामकरण संस्कार",
  SANT: "संत बुकिंग",
};

export default async function BookingsPage() {
  const [bookings, locale] = await Promise.all([
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    getLocale(),
  ]);
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  const typeLabels: Record<string, string> = locale === "en"
    ? { GADI_PUJA: "Vehicle puja", NAMKARAN: "Naming ceremony", SANT: "Saint booking" }
    : TYPE_LABELS;

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-base font-bold text-maroonText">{c("मेरी बुकिंग", "My bookings")}</h2>
      <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm" aria-labelledby="bhandara-heading">
        <h3 id="bhandara-heading" className="text-base font-bold text-maroonText">
          {c("भण्डारा बुकिंग", "Bhandara booking")}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          {c(
            "भण्डारा बुकिंग अभी उपलब्ध नहीं है। मंदिरों की उपलब्ध तिथियाँ, भोजन-मेनू, प्रति-व्यक्ति लागत और भुगतान व्यवस्था अभी कॉन्फ़िगर नहीं हैं।",
            "Bhandara booking is currently unavailable. Temple dates, menus, per-person pricing, and payment arrangements have not been configured."
          )}
        </p>
        <p role="alert" className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-900">
          {c(
            "अभी बुकिंग या भुगतान स्वीकार नहीं किया जा सकता। उपलब्धता और पूरी लागत की पुष्टि होने तक कोई बुकिंग कन्फर्म नहीं होगी।",
            "Bookings and payments cannot be accepted yet. No booking can be confirmed until availability and the full cost are verified."
          )}
        </p>
      </section>
      {bookings.length === 0 && (
        <p className="rounded-2xl border border-amber-100 bg-white p-6 text-center text-xs text-gray-500 shadow-sm">
          {c("अभी कोई बुकिंग नहीं है। होम पेज से गाड़ी पूजन, नामकरण अथवा संत बुकिंग करें।", "There are no bookings yet. Use the home page to request a vehicle puja, naming ceremony, or saint booking.")}
        </p>
      )}
      <div className="space-y-2">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white p-3.5 shadow-sm"
          >
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800">
                {typeLabels[b.type] ?? b.type}
                {b.vehicleNo ? ` — ${b.vehicleNo}` : ""}
              </p>
              <p className="text-[10px] text-gray-500">
                {b.personName}
                {b.phone ? ` • ${b.phone}` : ""} •{" "}
                {                new Intl.DateTimeFormat(locale === "en" ? "en-IN" : "hi-IN", {
                  timeZone: "Asia/Kolkata",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(b.date)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {b.amount !== null && (
                <span className="rounded-lg bg-saffron px-2 py-0.5 text-[10px] font-bold text-white">
                  ₹{b.amount}
                </span>
              )}
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                  b.status === "CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {b.status === "CONFIRMED" ? c("पुष्ट", "Confirmed") : c("प्रतीक्षारत", "Pending")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
