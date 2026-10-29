import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/i18n/navigation";
import { CalendarDays, Quote, Sunrise } from "lucide-react";
import FavoriteButton from "@/components/site/FavoriteButton";
import TempleCard from "@/components/site/TempleCard";
import { prisma } from "@/lib/db";
import { kolkataDayKey } from "@/lib/dates";
import { formatDayKeyHi } from "@/lib/rotation";
import { featuredTempleForDay, TEMPLES } from "@/lib/data/temples";
import { wisdomForDay } from "@/lib/data/wisdom";
import { upcomingFestivals } from "@/lib/data/festivals";

export const metadata: Metadata = {
  title: "दैनिक दर्शन एवं दैनिक प्रेरणा",
  description:
    "आज का दर्शन — प्रतिदिन एक मन्दिर, एक गीता-प्रेरणा, पर्व-सूचना और पंचांग, सत्यापित स्रोतों के साथ।",
};

// Daily darshan (brief §6.1–6.2): deterministic daily temple + wisdom pick,
// today's festival when applicable, DB panchang when seeded. No fabricated
// tithi/muhurat — DB row only, else the section is omitted.
export const dynamic = "force-dynamic";

export default async function DailyDarshanPage() {
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
          आज — {formatDayKeyHi(dayKey)}
        </p>
        <h1 className="mt-1 font-heading text-3xl font-bold text-charcoal">दैनिक दर्शन</h1>
      </header>

      {/* Featured temple of the day */}
      <section aria-labelledby="featured-heading" className="space-y-4">
        <h2 id="featured-heading" className="font-heading text-xl font-bold text-charcoal">
          आज का मन्दिर दर्शन
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
            <h3 className="font-heading text-2xl font-bold text-charcoal">{temple.nameHi}</h3>
            <p className="text-sm leading-relaxed text-charcoal">{temple.descriptionHi}</p>
            <p className="text-xs text-muted">प्रमुख देवता: {temple.deity}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href={`/temples/${temple.slug}`}
                className="inline-flex min-h-11 items-center rounded-full bg-saffron px-4 py-1.5 text-xs font-bold text-white transition hover:bg-saffronDeep"
              >
                पूरी जानकारी देखें
              </Link>
              <FavoriteButton
                kind="temple"
                slug={temple.slug}
                titleHi={temple.nameHi}
                href={`/temples/${temple.slug}`}
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLES.filter((t) => t.slug !== temple.slug)
            .slice(0, 3)
            .map((t) => (
              <TempleCard key={t.slug} temple={t} />
            ))}
        </div>
      </section>

      {/* Daily wisdom */}
      <section aria-labelledby="wisdom-heading" className="rounded-2xl border border-warmBorder bg-surface p-6">
        <h2 id="wisdom-heading" className="flex items-center gap-2 font-heading text-xl font-bold text-charcoal">
          <Quote className="h-5 w-5 text-saffron" aria-hidden />
          आज की प्रेरणा
        </h2>
        <blockquote className="mt-4 border-l-4 border-saffron pl-4">
          <p className="font-heading text-lg leading-relaxed text-charcoal">{wisdom.textHi}</p>
          <footer className="mt-2 text-xs font-medium text-teal">
            — {wisdom.sourceHi} ({wisdom.sourceEn})
          </footer>
        </blockquote>
        <p className="mt-4 text-sm leading-relaxed text-muted">{wisdom.meaningHi}</p>
        <p className="mt-3 rounded-xl bg-saffronSoft/60 p-3 text-sm leading-relaxed text-charcoal">
          <span className="font-bold">आज का चिन्तन: </span>
          {wisdom.reflectionHi}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <FavoriteButton
            kind="wisdom"
            slug={wisdom.key}
            titleHi={wisdom.sourceHi}
            href="/daily-darshan"
          />
          <Link
            href="/granth"
            className="inline-flex min-h-11 items-center rounded-full border border-warmBorder bg-cream px-4 py-1.5 text-xs font-medium text-charcoal transition hover:border-saffron"
          >
            गीता पाठ जारी रखें
          </Link>
        </div>
      </section>

      {/* Today's panchang — DB only; omitted when not seeded (no fabrication) */}
      {panchang && (
        <section aria-labelledby="panchang-heading" className="rounded-2xl bg-tealSoft p-6">
          <h2 id="panchang-heading" className="font-heading text-xl font-bold text-charcoal">
            आज का पंचांग
          </h2>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-teal">तिथि</dt>
              <dd className="text-charcoal">{panchang.tithi}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-teal">पक्ष</dt>
              <dd className="text-charcoal">{panchang.paksha}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-teal">नक्षत्र</dt>
              <dd className="text-charcoal">{panchang.nakshatra}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-teal">सूर्योदय</dt>
              <dd className="text-charcoal">{panchang.sunrise}</dd>
            </div>
          </dl>
          {panchang.note && <p className="mt-3 text-xs text-muted">{panchang.note}</p>}
          <p className="mt-3 text-[11px] text-muted">
            पंचांग-विवरण अखाड़े द्वारा प्रकाशित (सीड) आधार पर है; स्थानानुसार भिन्नता संभव है।
          </p>
        </section>
      )}

      {/* Upcoming festivals */}
      {nextFestivals.length > 0 && (
        <section aria-labelledby="festival-heading">
          <h2 id="festival-heading" className="flex items-center gap-2 font-heading text-xl font-bold text-charcoal">
            <CalendarDays className="h-5 w-5 text-saffron" aria-hidden />
            आगामी पर्व
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {nextFestivals.map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/festivals#${f.slug}`}
                  className="block h-full rounded-2xl border border-warmBorder bg-surface p-4 transition hover:border-saffron"
                >
                  <p className="text-[11px] font-bold text-saffron">
                    {formatDayKeyHi(f.dateIso)}
                  </p>
                  <p className="mt-1 text-sm font-bold text-charcoal">{f.nameHi}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{f.significanceHi}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-muted">
            तिथियाँ drikpanchang.com से सत्यापित (स्रोत पर्व-पृष्ठों पर दिए गए हैं)।
          </p>
        </section>
      )}
    </div>
  );
}
