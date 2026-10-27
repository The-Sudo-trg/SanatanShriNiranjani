import { clearSessionCookie } from "@/lib/auth";
import { jsonNoStore } from "@/lib/api";

export const dynamic = "force-dynamic";

// POST /api/auth/logout — सत्र कुकी हटाएँ (stateless JWT: revoke by expiring the cookie)
export async function POST() {
  const response = jsonNoStore({ message: "लॉग आउट सफल हुआ।" });
  return clearSessionCookie(response);
}
