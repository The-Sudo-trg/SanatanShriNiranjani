import { prisma } from "@/lib/db";
import { orderSchema } from "@/lib/validators";
import { zodErrorMessage, jsonError } from "@/lib/api";

export const dynamic = "force-dynamic";

// POST /api/orders — mock checkout → Order row (M6)
// STUB(v2): Razorpay integration — order status PENDING→PAID via payment webhook
// (PRD §9.4: real payments locked until akhada trust KYC). Never call real money APIs.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("अमान्य अनुरोध।");
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const lines = await prisma.cartLine.findMany({ orderBy: { id: "asc" } });
  if (lines.length === 0) {
    return jsonError("आपका कार्ट खाली है।");
  }

  const products = await prisma.product.findMany({
    where: { id: { in: lines.map((l) => l.productId) } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const orderLines = lines.map((l) => {
    const p = byId.get(l.productId);
    return { productId: l.productId, nameHi: p?.nameHi ?? "अज्ञात वस्तु", price: p?.price ?? 0, qty: l.qty };
  });
  // total computed server-side from Product prices — never trusted from client
  const total = orderLines.reduce((sum, l) => sum + l.price * l.qty, 0);

  const order = await prisma.order.create({
    data: {
      buyerName: parsed.data.buyerName,
      phone: parsed.data.phone,
      total,
      status: "PAID", // MOCK PAID (v1)
      lines: orderLines,
    },
  });

  await prisma.cartLine.deleteMany({});
  return Response.json({ id: order.id, total: order.total, status: order.status }, { status: 201 });
}
