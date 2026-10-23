import Link from "next/link";
import JapMala from "@/components/granth/JapMala";
import { prisma } from "@/lib/db";

// ग्रंथालय + जप माला (M4) — 18 chapters from DB, verse detail via query param (TC-GR-01..03)
export const dynamic = "force-dynamic";

export default async function GranthPage({
  searchParams,
}: {
  searchParams: Promise<{ chapter?: string }>;
}) {
  const { chapter } = await searchParams;
  const chapterNum = chapter ? Math.min(18, Math.max(1, Number.parseInt(chapter, 10) || 1)) : null;

  const [chapters, verses] = await Promise.all([
    prisma.gitaChapter.findMany({ orderBy: { number: "asc" } }),
    chapterNum
      ? prisma.gitaVerse.findMany({ where: { chapterNumber: chapterNum }, orderBy: { number: "asc" } })
      : Promise.resolve([]),
  ]);
  const current = chapterNum ? chapters.find((c) => c.number === chapterNum) : null;

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl bg-gradient-to-r from-red-800 to-amber-800 p-4 text-white shadow-md">
        <h2 className="text-base font-bold">सनातन डिजिटल ग्रंथालय एवं जप माला</h2>
        <p className="mt-1 text-xs opacity-90">वेद, पुराण, उपनिषद तथा डिजिटल जप काउंटर।</p>
      </div>

      <JapMala />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {current ? (
          <div className="space-y-3 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm sm:col-span-2 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800">
                अध्याय {current.number}: {current.titleHi}
              </h3>
              <Link href="/granth" className="text-[10px] font-bold text-saffron hover:underline">
                ← सभी अध्याय
              </Link>
            </div>
            {verses.length === 0 && (
              <p className="py-3 text-center text-xs text-gray-500">जल्द ही उपलब्ध होगा।</p>
            )}
            {verses.map((v) => (
              <div key={v.id} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-[10px] font-bold text-saffron">श्लोक {v.number}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-800">{v.textHi}</p>
                <p className="mt-2 border-t border-amber-200 pt-2 text-[11px] leading-relaxed text-gray-600">
                  <span className="font-bold">अर्थ: </span>
                  {v.meaningHi}
                </p>
              </div>
            ))}
            {/* audio flag placeholder (PRD M4) */}
            <p className="text-center text-[10px] text-gray-400">
              ऑडियो पाठ: शीघ्र उपलब्ध होगा (सभी अध्याय)
            </p>
          </div>
        ) : (
          chapters.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 font-bold text-red-700">
                  {c.number}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">अध्याय {c.number}: {c.titleHi}</h4>
                  <p className="text-[10px] text-gray-500">कुल श्लोक: {c.verseCount}</p>
                </div>
              </div>
              <Link
                href={`/granth?chapter=${c.number}`}
                className="rounded-xl bg-saffron px-3 py-1.5 text-xs font-medium text-white transition hover:bg-deepSaffron"
              >
                पढ़ें
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
