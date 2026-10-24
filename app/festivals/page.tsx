import type { Metadata } from "next";
import Link from "next/link";
import { kolkataDayKey } from "@/lib/dates";
import { formatDayKeyHi } from "@/lib/rotation";
import { FESTIVALS, upcomingFestivals } from "@/lib/data/festivals";
import FavoriteButton from "@/components/site/FavoriteButton";

export const metadata: Metadata = {
  title: "हिन्दू पर्व एवं उत्सव-मार्गदर्शिका",
  description:
    "आगामी हिन्दू पर्वों की सत्यापित तिथियाँ, तिथि-आधार, महत्व एवं विधि — स्रोत (drikpanchang.com) सहित; क्षेत्रीय भिन्नता के साथ।",
  alternates: { canonical: "/festivals" },
};

// Festival guide (brief §6.4) — only source-verified dates; regional variations
// explicit. Uses server-rendered deterministic picks; no fabricated tithis.
export default function FestivalsPage() {
  const dayKey = kolkataDayKey(0);
  const upcoming = upcomingFestivals(dayKey, 6);
  const past = FESTIVALS.filter((f) => f.dateIso < dayKey).sort((a, b) =>
    b.dateIso.localeCompare(a.dateIso)
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <header className="mb-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-charcoal">पर्व एवं उत्सव</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          तिथियाँ drikpanchang.com से सत्यापित हैं (अन्तिम सत्यापन 24 अक्टूबर 2026)। मुहूर्त व
          तिथि-विस्तार स्थान के अनुसार भिन्न हो सकते हैं — क्षेत्रीय भिन्नता हर पर्व पर दी गई है।
        </p>
      </header>

      <section aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="font-heading text-xl font-bold text-charcoal">
          आगामी पर्व
        </h2>
        <ol className="mt-4 space-y-4">
          {upcoming.map((f) => (
            <li key={f.slug} id={f.slug} className="scroll-mt-24 rounded-2xl border border-warmBorder bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-saffron">{formatDayKeyHi(f.dateIso)}</p>
                  <h3 className="font-heading text-lg font-bold text-charcoal">{f.nameHi}</h3>
                  <p className="text-xs text-muted">{f.nameEn}</p>
                </div>
                <FavoriteButton kind="festival" slug={f.slug} titleHi={f.nameHi} href={`/festivals#${f.slug}`} />
              </div>
              <p className="mt-3 rounded-xl bg-cream p-3 text-xs leading-relaxed text-charcoal">
                <span className="font-bold">तिथि-आधार: </span>
                {f.tithi}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal">{f.significanceHi}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <span className="font-bold">विधि एवं रीति: </span>
                {f.observancesHi}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                <span className="font-bold">क्षेत्रीय भिन्नता: </span>
                {f.regionalNotes}
              </p>
              <p className="mt-3 text-[11px] text-muted">
                स्रोत:{" "}
                {f.sourceUrls.map((u, i) => (
                  <span key={u}>
                    <a href={u} target="_blank" rel="noopener noreferrer" className="break-all text-teal underline hover:text-charcoal">
                      {u}
                    </a>
                    {i < f.sourceUrls.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {past.length > 0 && (
        <section aria-labelledby="past-heading" className="mt-10">
          <h2 id="past-heading" className="font-heading text-xl font-bold text-charcoal">
            सम्पन्न पर्व (इस सत्यापन-चक्र के)
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {past.map((f) => (
              <li key={f.slug}>
                <span className="inline-block rounded-full border border-warmBorder bg-cream px-3 py-1.5 text-xs text-muted">
                  {f.nameHi} — {formatDayKeyHi(f.dateIso)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted">
            अगले वर्ष की तिथियाँ प्रकाशित होते ही सत्यापित करके जोड़ी जाएँगी।{" "}
            <Link href="/content-sources" className="underline hover:text-saffron">
              स्रोत एवं सुधार
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
