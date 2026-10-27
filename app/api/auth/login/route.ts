import { prisma } from "@/lib/db";
import { jsonError, jsonNoStore, readJsonBody, zodErrorMessage } from "@/lib/api";
import { loginSchema } from "@/lib/validators";
import {
  DUMMY_PASSWORD_HASH,
  createSessionToken,
  setSessionCookie,
  toPublicUser,
  verifyPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

// One generic message for every failure — never reveal whether the e-mail exists.
const INVALID_CREDENTIALS = "ईमेल या पासवर्ड गलत है।";

// POST /api/auth/login — सत्र कुकी के साथ लॉग इन
export async function POST(req: Request) {
  const body = await readJsonBody(req);
  if (!body.ok) return body.response;

  const parsed = loginSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const { email, password } = parsed.data;

  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch {
    return jsonError("लॉग इन में त्रुटि हुई, कृपया पुनः प्रयास करें।", 500);
  }

  if (!user) {
    // Spend the same scrypt work as a real verification so response timing does
    // not leak account existence (correlates with TC #6 / #7).
    await verifyPassword(password, DUMMY_PASSWORD_HASH);
    return jsonError(INVALID_CREDENTIALS, 401);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return jsonError(INVALID_CREDENTIALS, 401);

  const response = jsonNoStore({ message: "लॉग इन सफल हुआ।", user: toPublicUser(user) });
  return setSessionCookie(response, createSessionToken(user));
}
