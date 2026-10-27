import { prisma } from "@/lib/db";
import { jsonError, jsonNoStore, readJsonBody, zodErrorMessage } from "@/lib/api";
import { registerSchema } from "@/lib/validators";
import { createSessionToken, hashPassword, setSessionCookie, toPublicUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DUPLICATE_EMAIL = "यह ईमेल पहले से पंजीकृत है। कृपया लॉग इन करें।";

// Prisma unique-constraint violation (duplicate e-mail race between findUnique + create).
function isUniqueConstraintError(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: unknown }).code === "P2002";
}

// POST /api/auth/register — ईमेल + पासवर्ड से नया खाता
export async function POST(req: Request) {
  const body = await readJsonBody(req);
  if (!body.ok) return body.response;

  const parsed = registerSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const { name, email, password, phone, role } = parsed.data;

  let user;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return jsonError(DUPLICATE_EMAIL, 409);

    user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        phone: phone ?? null,
        role,
        // SADHU registrations start unverified until an admin approves them.
        sadhuVerified: false,
      },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) return jsonError(DUPLICATE_EMAIL, 409);
    return jsonError("पंजीकरण में त्रुटि हुई, कृपया पुनः प्रयास करें।", 500);
  }

  const response = jsonNoStore(
    { message: "पंजीकरण सफल हुआ।", user: toPublicUser(user) },
    { status: 201 }
  );
  return setSessionCookie(response, createSessionToken(user));
}
