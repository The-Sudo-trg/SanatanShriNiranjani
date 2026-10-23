import { prisma } from "@/lib/db";
import { bookingSchema } from "@/lib/validators";
import { zodErrorMessage, jsonError } from "@/lib/api";
import { PRICES } from "@/lib/constants";

export const dynamic = "force-dynamic";

// GET /api/bookings — मेरी बुकिंग list
export async function GET() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return Response.json({ bookings });
}

// POST /api/bookings — all 3 types (M2); amount is sacred business data
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("अमान्य अनुरोध।");
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const data = parsed.data;
  const booking = await prisma.booking.create({
    data: {
      type: data.type,
      personName: data.personName,
      phone: "phone" in data ? data.phone : null,
      vehicleNo: "vehicleNo" in data ? data.vehicleNo : null,
      date: new Date(data.date),
      amount: data.type === "GADI_PUJA" ? PRICES.GADI_PUJA : null,
      status: "PENDING",
    },
  });

  return Response.json(booking, { status: 201 });
}
