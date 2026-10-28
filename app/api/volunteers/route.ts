import { prisma } from "@/lib/db";
import { jsonError, jsonNoStore, readJsonBody, zodErrorMessage } from "@/lib/api";
import { volunteerSchema } from "@/lib/validators";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Day 3 — the pass is account-based: guests cannot POST (old anonymous form is
// gone); every logged-in account may request a निरंजनी युवा सेवा दल pass.
const ALL_ROLES = ["USER", "SADHU", "VOLUNTEER", "ADMIN"] as const;

// POST /api/volunteers — खाते से जुड़ा सेवा दल पास अनुरोध
export async function POST(req: Request) {
  const guard = await requireRole(ALL_ROLES, req);
  if (!guard.ok) return guard.response;

  const body = await readJsonBody(req);
  if (!body.ok) return body.response;

  const parsed = volunteerSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  try {
    const volunteer = await prisma.volunteer.create({
      data: {
        // Pass is issued in the account's name — client input is never trusted.
        name: guard.user.name,
        whatsapp: parsed.data.whatsapp,
        userId: guard.user.id,
      },
    });

    return jsonNoStore(
      { message: "सेवा दल पास जारी करने की प्रक्रिया प्रारंभ हो गई है। धन्यवाद!", volunteer },
      { status: 201 }
    );
  } catch {
    return jsonError("अनुरोध सहेजा नहीं जा सका, कृपया पुनः प्रयास करें।", 500);
  }
}
