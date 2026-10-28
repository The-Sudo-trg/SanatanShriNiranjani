import { prisma } from "@/lib/db";
import { jsonError, jsonNoStore } from "@/lib/api";
import { requireRole, toPublicUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/sadhus — संत पंजीकरण सूची (ADMIN only) — Day 5 admin console की
// अपेक्षा आज (Day 3) API-first delivery: approve/reject पहले, UI बाद।
export async function GET(req: Request) {
  const guard = await requireRole("ADMIN", req);
  if (!guard.ok) return guard.response;

  try {
    const sadhus = await prisma.user.findMany({
      where: { role: "SADHU" },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return jsonNoStore({ sadhus: sadhus.map(toPublicUser) });
  } catch {
    return jsonError("सूची प्राप्त नहीं हुई, कृपया पुनः प्रयास करें।", 500);
  }
}
