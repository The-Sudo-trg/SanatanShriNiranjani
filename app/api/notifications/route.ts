import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/notifications — list + unreadCount (M9, F9)
export async function GET() {
  const items = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
  const unreadCount = await prisma.notification.count({ where: { read: false } });
  return Response.json({ items, unreadCount });
}

// POST /api/notifications {action:"markAllRead"} — badge clears after open
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "अमान्य अनुरोध।" }, { status: 400 });
  }
  const action = (body as { action?: string }).action;
  if (action !== "markAllRead") {
    return Response.json({ error: "अमान्य क्रिया।" }, { status: 400 });
  }
  await prisma.notification.updateMany({ data: { read: true } });
  const unreadCount = await prisma.notification.count({ where: { read: false } });
  return Response.json({ ok: true, unreadCount });
}
