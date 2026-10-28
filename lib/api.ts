import { ZodError } from "zod";

// PRD §6 — error responses are `{ error: string }` in Hindi
//
// Zod's built-in type errors ("Invalid input: expected string…", "Too big…") are
// English. Only messages authored in lib/validators.ts contain Devanagari, so
// anything else is replaced by a generic Hindi message (all user-facing errors are
// contractual Hindi — AGENT.md §3).
const HINDI_TEXT = /[\u0900-\u097F]/;

export function zodErrorMessage(err: ZodError): string {
  const message = err.issues[0]?.message ?? "";
  if (HINDI_TEXT.test(message)) return message;
  return "कृपया दिए गए विवरण जाँचें।";
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

// Auth/session responses must never be cached by a browser or proxy.
export function jsonNoStore(data: unknown, init?: ResponseInit) {
  const response = Response.json(data, init);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Cookie");
  return response;
}

/** Maximum accepted JSON request body (8 KiB) — public routes must not buffer more. */
export const MAX_JSON_BODY_BYTES = 8 * 1024;

export type JsonBodyResult =
  | { ok: true; data: unknown }
  | { ok: false; response: Response };

/**
 * Bounded JSON body reader: rejects oversized/poisoned payloads before parsing
 * (AGENT.md §3 "zod-parse input → try/catch → typed JSON response") and always
 * answers in Hindi.
 *
 * Security contract:
 * 1. Only `application/json` requests are accepted. A cross-site attacker page
 *    cannot set a foreign content type (no CORS preflight), so this is a
 *    defence-in-depth CSRF kill-switch on top of the SameSite=Lax cookie — forms
 *    can only POST `text/plain` / `urlencoded` / `multipart`.
 * 2. The size cap is measured in UTF-8 bytes, not string length — a Devanagari
 *    character is 3 bytes, so `raw.length` under-counted real payloads.
 */
export async function readJsonBody(
  req: Request,
  maxBytes: number = MAX_JSON_BODY_BYTES
): Promise<JsonBodyResult> {
  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.toLowerCase().includes("application/json")) {
    return { ok: false, response: jsonError("अमान्य अनुरोध।") };
  }

  const declared = Number(req.headers.get("content-length"));
  if (Number.isInteger(declared) && declared > maxBytes) {
    return { ok: false, response: jsonError("अनुरोध बहुत बड़ा है।", 413) };
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return { ok: false, response: jsonError("अमान्य अनुरोध।") };
  }
  if (Buffer.byteLength(raw, "utf8") > maxBytes) {
    return { ok: false, response: jsonError("अनुरोध बहुत बड़ा है।", 413) };
  }

  try {
    return { ok: true, data: JSON.parse(raw) };
  } catch {
    return { ok: false, response: jsonError("अमान्य अनुरोध।") };
  }
}
