import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/i18n/navigation";
import { CalendarDays, Quote, Sunrise } from "lucide-react";
import FavoriteButton from "@/components/site/FavoriteButton";
import TempleCard from "@/components/site/TempleCard";
import { prisma } from "@/lib/db";
import { kolkataDayKey } from "@/lib/dates";
import { featuredTempleForDay, TEMPLES } from "@/lib/data/temples";
import { wisdomForDay } from "@/lib/data/wisdom";
import { upcomingFestivals } from "@/lib/data/festivals";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: localeCopy(locale, "दैनिक दर्शन एवं दैनिक प्रेरणा", "Daily darshan and reflection"),
    description: localeCopy(locale, "आज का दर्शन — प्रतिदिन एक मन्दिर, एक गीता-प्रेरणा, पर्व-सूचना और पंचांग, सत्यापित स्रोतों के साथ।", "A daily temple feature, scriptural reflection, festival information, and panchang where available."),
  };
}

// Daily darshan (brief §6.1–6.2): deterministic daily temple + wisdom pick,
// today's festival when applicable, DB panchang when seeded. No fabricated
// tithi/muhurat — DB row only, else the section is omitted.
export const dynamic = "force-dynamic";

export default async function DailyDarshanPage() {
  const locale = await getLocale();
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  const formatDate = (key: string) =>
    new Intl.DateTimeFormat(locale === "en" ? "en-IN" : "hi-IN", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(`${key}T00:00:00.000Z`));
  const dayKey = kolkataDayKey(0);
  const todayDate = new Date(`${dayKey}T00:00:00.000Z`);

  const [panchang, temple, wisdom] = await Promise.all([
    prisma.panchang
      .findUnique({ where: { date: todayDate } })
      .catch(() => null) ?? prisma.panchang.findFirst({ orderBy: { date: "desc" } }),
    Promise.resolve(featuredTempleForDay(dayKey)),
    Promise.resolve(wisdomForDay(dayKey)),
  ]);
  const nextFestivals = upcomingFestivals(dayKey, 3);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-8 sm:px-6">
      <header>
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron">
          <Sunrise className="h-4 w-4" aria-hidden />
          {c("आज — ", "Today — ")}{formatDate(dayKey)}
        </p>
        <h1 className="mt-1 font-heading text-3xl font-bold text-charcoal">{c("दैनिक दर्शन", "Daily darshan")}</h1>
      </header>

      {/* Featured temple of the day */}
      <section aria-labelledby="featured-heading" className="space-y-4">
        <h2 id="featured-heading" className="font-heading text-xl font-bold text-charcoal">
          {c("आज का मन्दिर दर्शन", "Temple of the day")}
        </h2>
        <div className="overflow-hidden rounded-2xl border border-warmBorder bg-surface shadow-sm">
          <div className="relative aspect-[16/8] bg-saffronSoft">
            {temple.photo ? (
              <Image
                src={temple.photo.url}
                alt={temple.photo.alt}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span aria-hidden className="font-heading text-6xl text-saffron/70">ॐ</span>
              </div>
            )}
          </div>
          <div className="space-y-3 p-5">
            <h3 className="font-heading text-2xl font-bold text-charcoal">{locale === "en" ? temple.officialName : temple.nameHi}</h3>
            <p className="text-sm leading-relaxed text-charcoal">{locale === "en" ? temple.descriptionEn : temple.descriptionHi}</p>
            <p className="text-xs text-muted">
              {c("प्रमुख देवता: ", "Principal deity: ")}
              {locale === "en" && /[\u0900-\u097f]/.test(temple.deity)
                ? "[English deity name to be confirmed]"
                : temple.deity}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href={`/temples/${temple.slug}`}
                className="inline-flex min-h-11 items-center rounded-full bg-saffron px-4 py-1.5 text-xs font-bold text-white transition hover:bg-saffronDeep"
              >
                {c("पूरी जानकारी देखें", "View full profile")}
              </Link>
              <FavoriteButton
                kind="temple"
                slug={temple.slug}
                titleHi={temple.nameHi}
                href={`/temples/${temple.slug}`}
                locale={locale}
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLES.filter((t) => t.slug !== temple.slug)
            .slice(0, 3)
            .map((t) => (
              <TempleCard key={t.slug} temple={t} locale={locale} />
            ))}
        </div>
      </section>

      {/* Daily wisdom */}
      <section aria-labelledby="wisdom-heading" className="rounded-2xl border border-warmBorder bg-surface p-6">
        <h2 id="wisdom-heading" className="flex items-center gap-2 font-heading text-xl font-bold text-charcoal">
          <Quote className="h-5 w-5 text-saffron" aria-hidden />
          {c("आज की प्रेरणा", "Daily reflection")}
        </h2>
        <blockquote className="mt-4 border-l-4 border-saffron pl-4">
          <p className="font-heading text-lg leading-relaxed text-charcoal">{wisdom.textHi}</p>
          <footer className="mt-2 text-xs font-medium text-teal">
            — {locale === "en" ? wisdom.sourceEn : wisdom.sourceHi}
          </footer>
        </blockquote>
        <p className="mt-4 text-sm leading-relaxed text-muted">{locale === "en" ? wisdom.meaningEn : wisdom.meaningHi}</p>
        <p className="mt-3 rounded-xl bg-saffronSoft/60 p-3 text-sm leading-relaxed text-charcoal">
          <span className="font-bold">{c("आज का चिन्तन: ", "Reflection: ")}</span>
          {locale === "en" ? wisdom.reflectionEn : wisdom.reflectionHi}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <FavoriteButton
            kind="wisdom"
            slug={wisdom.key}
            titleHi={wisdom.sourceHi}
            href="/daily-darshan"
            locale={locale}
          />
          <Link
            href="/granth"
            className="inline-flex min-h-11 items-center rounded-full border border-warmBorder bg-cream px-4 py-1.5 text-xs font-medium text-charcoal transition hover:border-saffron"
          >
            {c("गीता पाठ जारी रखें", "Continue reading the Gita")}
          </Link>
        </div>
      </section>

      {/* Today's panchang — DB only; omitted when not seeded (no fabrication) */}
      {panchang && (
        <section aria-labelledby="panchang-heading" className="rounded-2xl bg-tealSoft p-6">
          <h2 id="panchang-heading" className="font-heading text-xl font-bold text-charcoal">
            {c("आज का पंचांग", "Today's panchang")}
          </h2>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-teal">{c("तिथि", "Lunar day")}</dt>
              <dd className="text-charcoal">{locale === "en" ? "[English panchang translation to be confirmed]" : panchang.tithi}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-teal">{c("पक्ष", "Lunar fortnight")}</dt>
              <dd className="text-charcoal">{locale === "en" ? "[English panchang translation to be confirmed]" : panchang.paksha}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-teal">{c("नक्षत्र", "Nakshatra")}</dt>
              <dd className="text-charcoal">{locale === "en" ? "[English panchang translation to be confirmed]" : panchang.nakshatra}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-teal">{c("सूर्योदय", "Sunrise")}</dt>
              <dd className="text-charcoal">{panchang.sunrise}</dd>
            </div>
          </dl>
          {panchang.note && <p className="mt-3 text-xs text-muted">{locale === "en" ? "[Panchang note translation to be confirmed]" : panchang.note}</p>}
          <p className="mt-3 text-[11px] text-muted">
            {c("पंचांग-विवरण अखाड़े द्वारा प्रकाशित (सीड) आधार पर है; स्थानानुसार भिन्नता संभव है.", "Panchang information is based on data published by the Akhara and may vary by location.")}
          </p>
        </section>
      )}

      {/* Upcoming festivals */}
      {nextFestivals.length > 0 && (
        <section aria-labelledby="festival-heading">
          <h2 id="festival-heading" className="flex items-center gap-2 font-heading text-xl font-bold text-charcoal">
            <CalendarDays className="h-5 w-5 text-saffron" aria-hidden />
            {c("आगामी पर्व", "Upcoming festivals")}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {nextFestivals.map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/festivals#${f.slug}`}
                  className="block h-full rounded-2xl border border-warmBorder bg-surface p-4 transition hover:border-saffron"
                >
                  <p className="text-[11px] font-bold text-saffron">
                    {formatDate(f.dateIso)}
                  </p>
                  <p className="mt-1 text-sm font-bold text-charcoal">{locale === "en" ? f.nameEn : f.nameHi}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{locale === "en" ? f.significanceEn : f.significanceHi}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-muted">
            {c("तिथियाँ drikpanchang.com से सत्यापित (स्रोत पर्व-पृष्ठों पर दिए गए हैं)।", "Dates are verified with drikpanchang.com; sources are linked on each festival page.")}
          </p>
        </section>
      )}
    </div>
  );
}
