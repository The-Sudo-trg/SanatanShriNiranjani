import { prisma } from "@/lib/db";
import { kolkataDayKey } from "@/lib/dates";

export const dynamic = "force-dynamic";

// GET /api/panchang — today's panchang with seed fallback (PRD §6)
export async function GET() {
  const todayDate = new Date(`${kolkataDayKey(0)}T00:00:00.000Z`);
  const today = await prisma.panchang.findUnique({ where: { date: todayDate } });
  if (today) return Response.json(today);
  const fallback = await prisma.panchang.findFirst({ orderBy: { date: "desc" } });
  if (!fallback) return Response.json({ error: "पंचांग डेटा उपलब्ध नहीं है।" }, { status: 404 });
  return Response.json(fallback);
}
