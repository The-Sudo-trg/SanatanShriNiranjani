import { prisma } from "@/lib/db";
import { jsonError, jsonNoStore, readJsonBody, zodErrorMessage } from "@/lib/api";
import { sadhuApprovalSchema } from "@/lib/validators";
import { requireRole, toPublicUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const NOT_FOUND = "संत खाता नहीं मिला।";

// PATCH /api/admin/sadhus/[id] — संत सत्यापन स्थिति अद्यतन करें (ADMIN only)।
// updateMany with the role filter guarantees a USER row can never be touched.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole("ADMIN", req);
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const body = await readJsonBody(req);
  if (!body.ok) return body.response;

  const parsed = sadhuApprovalSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  try {
    const updated = await prisma.user.updateMany({
      where: { id, role: "SADHU" },
      data: { sadhuVerified: parsed.data.sadhuVerified },
    });
    if (updated.count === 0) return jsonError(NOT_FOUND, 404);

    const sadhu = await prisma.user.findUniqueOrThrow({ where: { id } });
    return jsonNoStore({
      message: parsed.data.sadhuVerified ? "संत सत्यापित किया गया।" : "सत्यापन लंबित किया गया।",
      sadhu: toPublicUser(sadhu),
    });
  } catch {
    return jsonError("सत्यापन स्थिति अद्यतन नहीं हुई, कृपया पुनः प्रयास करें।", 500);
  }
}
