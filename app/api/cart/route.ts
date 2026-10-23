import { prisma } from "@/lib/db";
import { cartAddSchema, cartUpdateSchema, cartRemoveSchema } from "@/lib/validators";
import { zodErrorMessage, jsonError } from "@/lib/api";
import type { CartItem } from "@/lib/cart";

export const dynamic = "force-dynamic";

// Cart persists server-side (CartLine × Product) — survives refresh (TC-ST-06)
async function currentItems(): Promise<CartItem[]> {
  const lines = await prisma.cartLine.findMany({ orderBy: { id: "asc" } });
  const products = await prisma.product.findMany({
    where: { id: { in: lines.map((l) => l.productId) } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));
  return lines
    .map((l) => {
      const p = byId.get(l.productId);
      return p
        ? { productId: p.id, nameHi: p.nameHi, price: p.price, qty: l.qty }
        : null;
    })
    .filter((x): x is CartItem => x !== null);
}

export async function GET() {
  return Response.json({ items: await currentItems() });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("अमान्य अनुरोध।");
  }
  const parsed = cartAddSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const product = await prisma.product.findFirst({ where: { id: parsed.data.productId, active: true } });
  if (!product) return jsonError("यह वस्तु उपलब्ध नहीं है।", 404);

  const existing = await prisma.cartLine.findFirst({ where: { productId: product.id } });
  if (existing) {
    await prisma.cartLine.update({ where: { id: existing.id }, data: { qty: existing.qty + 1 } });
  } else {
    await prisma.cartLine.create({ data: { productId: product.id, qty: 1 } });
  }
  return Response.json({ items: await currentItems() }, { status: 201 });
}

export async function PATCH(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("अमान्य अनुरोध।");
  }
  const parsed = cartUpdateSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const line = await prisma.cartLine.findFirst({ where: { productId: parsed.data.productId } });
  if (!line) return jsonError("कार्ट में यह वस्तु नहीं है।", 404);

  if (parsed.data.qty === 0) {
    await prisma.cartLine.delete({ where: { id: line.id } });
  } else {
    await prisma.cartLine.update({ where: { id: line.id }, data: { qty: parsed.data.qty } });
  }
  return Response.json({ items: await currentItems() });
}

export async function DELETE(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("अमान्य अनुरोध।");
  }
  const parsed = cartRemoveSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  await prisma.cartLine.deleteMany({ where: { productId: parsed.data.productId } });
  return Response.json({ items: await currentItems() });
}
