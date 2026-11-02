import type { Metadata } from "next";
import Link from "@/i18n/navigation";
import { kolkataDayKey } from "@/lib/dates";
import { FESTIVALS, upcomingFestivals } from "@/lib/data/festivals";
import FavoriteButton from "@/components/site/FavoriteButton";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: localeCopy(locale, "हिन्दू पर्व एवं उत्सव-मार्गदर्शिका", "Hindu festivals and observances"),
    description: localeCopy(locale, "आगामी हिन्दू पर्वों की सत्यापित तिथियाँ, तिथि-आधार, महत्व एवं विधि — स्रोत (drikpanchang.com) सहित; क्षेत्रीय भिन्नता के साथ।", "Verified upcoming Hindu festival dates, their basis, significance, and observances, with sources and regional variations."),
  };
}

// Festival guide (brief §6.4) — only source-verified dates; regional variations
// explicit. Uses server-rendered deterministic picks; no fabricated tithis.
export default async function FestivalsPage() {
  const locale = await getLocale();
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  const formatDate = (key: string) =>
    new Intl.DateTimeFormat(locale === "en" ? "en-IN" : "hi-IN", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(`${key}T00:00:00.000Z`));
  const dayKey = kolkataDayKey(0);
  const upcoming = upcomingFestivals(dayKey, 6);
  const past = FESTIVALS.filter((f) => f.dateIso < dayKey).sort((a, b) =>
    b.dateIso.localeCompare(a.dateIso)
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <header className="mb-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-charcoal">{c("पर्व एवं उत्सव", "Festivals and observances")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {c("तिथियाँ drikpanchang.com से सत्यापित हैं (अन्तिम सत्यापन 24 अक्टूबर 2026)। मुहूर्त व तिथि-विस्तार स्थान के अनुसार भिन्न हो सकते हैं — क्षेत्रीय भिन्नता हर पर्व पर दी गई है.", "Dates are verified with drikpanchang.com (last reviewed 24 October 2026). Muhurta and tithi timings can vary by location; regional notes are provided for each festival.")}
        </p>
      </header>

      <section aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="font-heading text-xl font-bold text-charcoal">
          {c("आगामी पर्व", "Upcoming festivals")}
        </h2>
        <ol className="mt-4 space-y-4">
          {upcoming.map((f) => (
            <li key={f.slug} id={f.slug} className="scroll-mt-24 rounded-2xl border border-warmBorder bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-saffron">{formatDate(f.dateIso)}</p>
                  <h3 className="font-heading text-lg font-bold text-charcoal">{locale === "en" ? f.nameEn : f.nameHi}</h3>
                  {locale === "hi" && <p className="text-xs text-muted">{f.nameEn}</p>}
                </div>
                <FavoriteButton kind="festival" slug={f.slug} titleHi={f.nameHi} href={`/festivals#${f.slug}`} locale={locale} />
              </div>
              <p className="mt-3 rounded-xl bg-cream p-3 text-xs leading-relaxed text-charcoal">
                <span className="font-bold">{c("तिथि-आधार: ", "Tithi basis: ")}</span>
                {locale === "en" ? "[English translation to be confirmed]" : f.tithi}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal">{locale === "en" ? f.significanceEn : f.significanceHi}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <span className="font-bold">{c("विधि एवं रीति: ", "Observances: ")}</span>
                {locale === "en" ? "[English translation to be confirmed]" : f.observancesHi}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                <span className="font-bold">{c("क्षेत्रीय भिन्नता: ", "Regional notes: ")}</span>
                {locale === "en" ? "[English translation to be confirmed]" : f.regionalNotes}
              </p>
              <p className="mt-3 text-[11px] text-muted">
                {c("स्रोत: ", "Source: ")}
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
            {c("सम्पन्न पर्व (इस सत्यापन-चक्र के)", "Past festivals (this verification cycle)")}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {past.map((f) => (
              <li key={f.slug}>
                <span className="inline-block rounded-full border border-warmBorder bg-cream px-3 py-1.5 text-xs text-muted">
                  {locale === "en" ? f.nameEn : f.nameHi} — {formatDate(f.dateIso)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted">
            {c("अगले वर्ष की तिथियाँ प्रकाशित होते ही सत्यापित करके जोड़ी जाएँगी।", "Dates for the next year will be verified and added after publication.")}{" "}
            <Link href="/content-sources" className="underline hover:text-saffron">
              {c("स्रोत एवं सुधार", "Sources and corrections")}
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
