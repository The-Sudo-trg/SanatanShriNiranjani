import AskQuestionButton from "@/components/jigyasu/AskQuestionButton";
import { prisma } from "@/lib/db";
import { relativeTimeHi } from "@/lib/dates";
import { Badge } from "@/components/ui/badge";

// सनातन सत्संग एवं जिज्ञासा मंच (M5) — seeded पेशवाई Q&A (TC-FO-01)
export const dynamic = "force-dynamic";

export default async function JigyasuPage() {
  const [questions, answers] = await Promise.all([
    prisma.forumPost.findMany({ where: { kind: "QUESTION" }, orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.forumPost.findMany({ where: { kind: "ANSWER" }, orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <main className="min-h-full space-y-4 bg-[#FFF8F2] p-4">
      <div className="rounded-[1.5rem] bg-gradient-to-br from-[#0F766E] via-[#115E59] to-[#164E63] p-5 text-white shadow-lg">
        <h2 className="text-base font-bold">सनातन सत्संग एवं जिज्ञासा मंच</h2>
        <p className="mt-1 text-xs opacity-90">संतों और भक्तों के साथ धार्मिक चर्चा व प्रश्नोत्तर।</p>
      </div>

      <div className="space-y-3">
        {questions.length === 0 && (
          <p className="py-4 text-center text-xs text-gray-500">जल्द ही उपलब्ध होगा।</p>
        )}
        {questions.map((q) => {
          const qAnswers = answers.filter((a) => a.parentId === q.id);
          return (
            <div key={q.id} className="space-y-2 rounded-2xl border border-amber-100 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <Badge variant="tag">प्रश्न</Badge>
                <span className="text-[10px] text-gray-400">
                  {relativeTimeHi(q.createdAt)} • {q.authorName}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-800">&quot;{q.body}&quot;</p>
              {qAnswers.map((a) => (
                <div key={a.id} className="rounded-xl bg-amber-50 p-2.5">
                  <p className="text-[10px] font-bold text-saffron">{a.authorName}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-gray-600">{a.body}</p>
                </div>
              ))}
              {qAnswers.length === 0 && (
                <p className="text-[10px] text-gray-400">उत्तर शीघ्र प्रकाशित होगा।</p>
              )}
            </div>
          );
        })}
        <AskQuestionButton />
      </div>
    </main>
  );
}
