import { prisma } from "@/lib/db";
import { malaDeltaSchema } from "@/lib/validators";
import { zodErrorMessage, jsonError } from "@/lib/api";
import { kolkataDayKey } from "@/lib/dates";

export const dynamic = "force-dynamic";

const USER_KEY = "local";

async function streakFor(rows: Array<{ day: string; count: number }>): Promise<number> {
  const positive = rows.filter((r) => r.count > 0).map((r) => r.day);
  if (positive.length === 0) return 0;
  const set = new Set(positive);
  // streak counts back from today; today not yet jap'd → starts from yesterday
  let offset = set.has(kolkataDayKey(0)) ? 0 : 1;
  let streak = 0;
  while (set.has(kolkataDayKey(-offset))) {
    streak += 1;
    offset += 1;
  }
  return streak;
}

// GET /api/mala — today's count + daily streak (M4, Asia/Kolkata day key)
export async function GET() {
  const rows = await prisma.malaCount.findMany({
    where: { userKey: USER_KEY },
    orderBy: { day: "desc" },
    take: 400,
  });
  const today = rows.find((r) => r.day === kolkataDayKey(0));
  const streak = await streakFor(rows);
  return Response.json({ count: today?.count ?? 0, streak });
}

// POST /api/mala — {delta} upsert on @@unique([userKey, day]); count never negative.
// Atomic: positive deltas use SQL `increment` so concurrent taps never lose counts
// (TC-ML-01 found a read-modify-write race that dropped taps).
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("अमान्य अनुरोध।");
  }

  const parsed = malaDeltaSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const day = kolkataDayKey(0);
  let row;
  if (parsed.data.delta >= 0) {
    row = await prisma.malaCount.upsert({
      where: { userKey_day: { userKey: USER_KEY, day } },
      update: { count: { increment: parsed.data.delta } },
      create: { userKey: USER_KEY, day, count: parsed.data.delta },
    });
  } else {
    // reset path (negative delta): decrement then clamp at zero
    row = await prisma.malaCount.upsert({
      where: { userKey_day: { userKey: USER_KEY, day } },
      update: { count: { decrement: -parsed.data.delta } },
      create: { userKey: USER_KEY, day, count: 0 },
    });
    if (row.count < 0) {
      row = await prisma.malaCount.update({ where: { id: row.id }, data: { count: 0 } });
    }
  }

  return Response.json({ count: row.count });
}
