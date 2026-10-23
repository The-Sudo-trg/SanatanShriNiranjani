import { prisma } from "@/lib/db";
import { volunteerSchema } from "@/lib/validators";
import { zodErrorMessage, jsonError } from "@/lib/api";

export const dynamic = "force-dynamic";

// POST /api/volunteers — निरंजनी युवा सेवा दल registration (M7, F8)
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("अमान्य अनुरोध।");
  }

  const parsed = volunteerSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const volunteer = await prisma.volunteer.create({
    data: { name: parsed.data.name, whatsapp: parsed.data.whatsapp },
  });
  return Response.json({ ok: true, id: volunteer.id }, { status: 201 });
}
