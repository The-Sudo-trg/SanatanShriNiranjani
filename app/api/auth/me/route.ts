import { getSessionUser } from "@/lib/auth";
import { jsonError, jsonNoStore } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET /api/auth/me — current user (never passwordHash) or 401
export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) return jsonError("कृपया पहले लॉग इन करें।", 401);
  return jsonNoStore({ user });
}
