import { prisma } from "@/lib/db";

// मेरी बुकिंग (M2) — status chips प्रतीक्षारत/पुष्ट (F1 last leg)
export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  GADI_PUJA: "गाड़ी पूजन",
  NAMKARAN: "नामकरण संस्कार",
  SANT: "संत बुकिंग",
};

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-base font-bold text-maroonText">मेरी बुकिंग</h2>
      {bookings.length === 0 && (
        <p className="rounded-2xl border border-amber-100 bg-white p-6 text-center text-xs text-gray-500 shadow-sm">
          अभी कोई बुकिंग नहीं है। होम पेज से गाड़ी पूजन, नामकरण अथवा संत बुकिंग करें।
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
                {TYPE_LABELS[b.type] ?? b.type}
                {b.vehicleNo ? ` — ${b.vehicleNo}` : ""}
              </p>
              <p className="text-[10px] text-gray-500">
                {b.personName}
                {b.phone ? ` • ${b.phone}` : ""} •{" "}
                {new Intl.DateTimeFormat("hi-IN", {
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
                {b.status === "CONFIRMED" ? "पुष्ट" : "प्रतीक्षारत"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
