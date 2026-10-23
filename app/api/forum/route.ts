import { prisma } from "@/lib/db";
import { forumPostSchema } from "@/lib/validators";
import { zodErrorMessage, jsonError } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET /api/forum — feed: questions (newest first) with nested answers (M5)
export async function GET() {
  const [questions, answers] = await Promise.all([
    prisma.forumPost.findMany({ where: { kind: "QUESTION" }, orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.forumPost.findMany({ where: { kind: "ANSWER" }, orderBy: { createdAt: "asc" } }),
  ]);
  const feed = questions.map((q) => ({
    ...q,
    answers: answers.filter((a) => a.parentId === q.id),
  }));
  return Response.json({ feed });
}

// POST /api/forum — ask a question (v1 posts visible in feed; v2 answers flow)
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("अमान्य अनुरोध।");
  }

  const parsed = forumPostSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const { authorName, kind, body: text, parentId } = parsed.data;
  if (kind === "ANSWER" && !parentId) {
    return jsonError("उत्तर हेतु प्रश्न आवश्यक है।");
  }

  const post = await prisma.forumPost.create({
    data: { authorName, kind, body: text, parentId: parentId ?? null },
  });
  return Response.json(post, { status: 201 });
}
