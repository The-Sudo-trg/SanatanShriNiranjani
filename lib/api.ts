import { ZodError } from "zod";

// PRD §6 — error responses are `{ error: string }` in Hindi
export function zodErrorMessage(err: ZodError): string {
  return err.issues[0]?.message ?? "कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।";
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
