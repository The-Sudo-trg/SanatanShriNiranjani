import { prisma } from "@/lib/db";
import { jsonError, jsonNoStore, readJsonBody, zodErrorMessage } from "@/lib/api";
import { feedbackSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

// POST /api/feedback — संदेश सहेजें (val 1-preparation for Day 8 admin inbox)
export async function POST(req: Request) {
  const body = await readJsonBody(req);
  if (!body.ok) return body.response;

  const parsed = feedbackSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const { name, email, message, templeSlug } = parsed.data;

  try {
    const feedback = await prisma.feedback.create({
      data: {
        // Empty optional form fields are stored as NULL, not "".
        name: name && name.length > 0 ? name : null,
        email: email && email.length > 0 ? email : null,
        message,
        templeSlug: templeSlug && templeSlug.length > 0 ? templeSlug : null,
      },
    });

    return jsonNoStore(
      { message: "आपका संदेश प्राप्त हुआ। धन्यवाद।", feedback },
      { status: 201 }
    );
  } catch {
    return jsonError("संदेश सहेजा नहीं जा सका, कृपया पुनः प्रयास करें।", 500);
  }
}
