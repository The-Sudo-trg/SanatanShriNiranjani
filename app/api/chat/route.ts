import { prisma } from "@/lib/db";
import { chatSchema } from "@/lib/validators";
import { zodErrorMessage, jsonError } from "@/lib/api";
import { askAi, AiUnavailableError, type ChatTurn } from "@/lib/ai";

export const dynamic = "force-dynamic";

// GET /api/chat?sessionId= — per-session history (M5 acceptance: history persists)
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("sessionId") ?? "";
  if (!sessionId) return Response.json({ messages: [] });
  const rows = await prisma.chatMessage.findMany({
    where: { sessionKey: sessionId },
    orderBy: { createdAt: "asc" },
    take: 50,
  });
  return Response.json({
    messages: rows.map((r) => ({ role: r.role, content: r.content })),
  });
}

// POST /api/chat — {sessionId, content} → {reply} via z-ai-web-dev-sdk (guardrailed)
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("अमान्य अनुरोध।");
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));
  const { sessionId, content } = parsed.data;

  await prisma.chatMessage.create({ data: { sessionKey: sessionId, role: "user", content } });

  const history = await prisma.chatMessage.findMany({
    where: { sessionKey: sessionId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const turns: ChatTurn[] = history
    .reverse()
    .map((r) => ({ role: r.role === "assistant" ? "assistant" : "user", content: r.content }));

  try {
    const reply = await askAi(turns);
    await prisma.chatMessage.create({ data: { sessionKey: sessionId, role: "assistant", content: reply } });
    return Response.json({ reply });
  } catch (e) {
    if (e instanceof AiUnavailableError) {
      // TC-AI-04: Hindi failure, chat usable after retry
      return jsonError(e.message, 503);
    }
    return jsonError("कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।", 500);
  }
}
