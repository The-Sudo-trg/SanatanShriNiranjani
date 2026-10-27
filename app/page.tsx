import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Quote, TreePine } from "lucide-react";
import FeatureGrid from "@/components/home/FeatureGrid";
import QuickCards from "@/components/home/QuickCards";
import GoldenBabaCard from "@/components/home/GoldenBabaCard";
import SatsangPlayer from "@/components/home/SatsangPlayer";
import SouthSaintsButton from "@/components/home/SouthSaintsButton";
import { SuvicharStrip } from "@/components/home/SuvicharStrip";
import TempleCard from "@/components/site/TempleCard";
import FavoriteButton from "@/components/site/FavoriteButton";
import SadhuShowcase from "@/components/home/SadhuShowcase";
import { SADHUS } from "@/lib/data/sadhus";
import { prisma } from "@/lib/db";
import { kolkataDayKey } from "@/lib/dates";
import { formatDayKeyHi } from "@/lib/rotation";
import { TEMPLES } from "@/lib/data/temples";
import { wisdomForDay } from "@/lib/data/wisdom";
import { festivalForDay, upcomingFestivals } from "@/lib/data/festivals";
import { MANTRAS } from "@/lib/data/mantras";

// Home v2 (brief Phase 4) — editorial hero, today's spiritual experience,
// temple discovery, explore-by-interest, featured knowledge. Existing akhada
// modules (services grid, quick bookings, satsang, suvichar) are preserved.
export const dynamic = "force-dynamic";

// Hero photograph: verified Wikimedia Commons image of Akshardham (CC BY-SA),
// credited inline — used as editorial photography of the page's subject.
const HERO_PHOTO = {
  url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Akshardham_Delhi.jpg",
  credit: "Swaminarayan Sanstha, CC BY-SA 3.0 (Wikimedia Commons)",
  pageUrl: "https://commons.wikimedia.org/wiki/File:Akshardham_Delhi.jpg",
  alt: "नई दिल्ली के स्वामिनारायण अक्षरधाम मन्दिर का मुख्य स्मारक",
};

const INTERESTS = [
  { href: "/temples?category=SHAIVA", labelHi: "शिव मन्दिर" },
  { href: "/temples?category=VAISHNAVA", labelHi: "विष्णु एवं कृष्ण मन्दिर" },
  { href: "/temples?category=SHAKTA", labelHi: "देवी मन्दिर" },
  { href: "/kumbh-2027", labelHi: "प्रमुख तीर्थ — महाकुम्भ 2027" },
  { href: "/mantras", labelHi: "मंत्र एवं स्तोत्र" },
  { href: "/festivals", labelHi: "हिन्दू पर्व" },
  { href: "/granth", labelHi: "शास्त्र-कथा एवं गीता" },
  { href: "/gau-seva", labelHi: "गौ सेवा एवं प्रकृति" },
];

export default async function HomePage() {
  const todayKey = kolkataDayKey(0);
  const todayDate = new Date(`${todayKey}T00:00:00.000Z`);

  const [panchang, suvichar, baba] = await Promise.all([
    prisma.panchang.findUnique({ where: { date: todayDate } }).catch(() => null) ??
      prisma.panchang.findFirst({ orderBy: { date: "desc" } }),
    prisma.suvichar.findFirst({ orderBy: { day: "asc" } }),
    // Golden Baba is a living Mahamandaleshwar — look him up by id (the old
    // `memorial: true` lookup mixed him up with a different, deceased sadhu).
    prisma.saint.findUnique({ where: { id: "saint-sk-narayan-giri" } }),
  ]);

  const wisdom = wisdomForDay(todayKey);
  const todayFestival = festivalForDay(todayKey);
  const nextFestivals = upcomingFestivals(todayKey, 2);
  const dailyMantra = MANTRAS.find((m) => m.slug === "gayatri-mantra") ?? MANTRAS[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "सनातन श्री निरंजनी",
            alternateName: "Sanatan Shri Niranjani",
            url: process.env.NEXT_PUBLIC_APP_URL || "https://sanatanshriniranjani.vercel.app",
            inLanguage: "hi",
            potentialAction: {
              "@type": "SearchAction",
              target: `${process.env.NEXT_PUBLIC_APP_URL || "https://sanatanshriniranjani.vercel.app"}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      {/* Hero — editorial, text not covering the photograph, CTAs visible on mobile */}
      <section className="grid items-center gap-6 py-8 lg:grid-cols-2 lg:gap-10 lg:py-12">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-saffron">
            {formatDayKeyHi(todayKey)}
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold leading-tight text-charcoal sm:text-5xl">
            सनातन धर्म की शाश्वत विरासत
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            सत्यापित मन्दिर-दर्शन, दैनिक प्रेरणा, मंत्र-स्तोत्र और पर्व-मार्गदर्शिका — भारत की
            जीवित साधना-परम्परा का डिजिटल द्वार।
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/temples"
              className="inline-flex min-h-11 items-center rounded-full bg-saffron px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-saffronDeep"
            >
              मंदिर देखें
            </Link>
            <Link
              href="/daily-darshan"
              className="inline-flex min-h-11 items-center rounded-full border border-saffron bg-surface px-6 py-2.5 text-sm font-bold text-saffron transition hover:bg-saffronSoft"
            >
              आज का दर्शन
            </Link>
          </div>
        </div>
        <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-warmBorder shadow-sm lg:aspect-[5/4]">
          <Image
            src={HERO_PHOTO.url}
            alt={HERO_PHOTO.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/80 to-transparent p-3 text-[10px] text-white/90">
            चित्र:{" "}
            <a href={HERO_PHOTO.pageUrl} target="_blank" rel="noopener noreferrer" className="underline">
              {HERO_PHOTO.credit}
            </a>
          </figcaption>
        </figure>
      </section>

      {/* Panchang banner (seeded only — no fabricated tithi) */}
      {panchang && (
        <section
          aria-label="आज का पंचांग"
          className="mb-8 rounded-2xl border border-warmBorder bg-surface p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">आज का पंचांग</h2>
            {panchang.muhurat && (
              <span className="rounded-full bg-saffronSoft px-2.5 py-0.5 text-[10px] font-bold text-charcoal">
                शुभ मुहूर्त: {panchang.muhurat}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm font-bold text-charcoal">
            {panchang.tithi} • नक्षत्र: {panchang.nakshatra}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            सूर्योदय: {panchang.sunrise}
            {panchang.note ? ` | ${panchang.note}` : ""}
          </p>
        </section>
      )}

      {/* Today's spiritual experience */}
      <section aria-labelledby="today-heading" className="mb-10">
        <h2 id="today-heading" className="font-heading text-2xl font-bold text-charcoal">
          आज का आध्यात्मिक अनुभव
        </h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-warmBorder bg-surface p-5">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron">
              <Quote className="h-3.5 w-3.5" aria-hidden /> दैनिक प्रेरणा
            </h3>
            <blockquote className="mt-3">
              <p lang="sa" className="font-heading text-sm leading-relaxed text-charcoal">
                {wisdom.textHi}
              </p>
              <footer className="mt-2 text-[11px] font-medium text-teal">{wisdom.sourceHi}</footer>
            </blockquote>
            <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted">{wisdom.meaningHi}</p>
            <Link
              href="/daily-darshan"
              className="mt-3 inline-flex min-h-11 items-center text-xs font-bold text-saffron hover:underline"
            >
              चिन्तन एवं पूरा अर्थ →
            </Link>
          </article>
          <article className="rounded-2xl border border-warmBorder bg-surface p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron">आज का मंत्र</h3>
            <p lang="sa" className="mt-3 font-heading text-sm leading-relaxed text-charcoal">
              {dailyMantra.text}
            </p>
            <p className="mt-2 text-[11px] italic text-muted">{dailyMantra.transliteration}</p>
            <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
              {dailyMantra.meaningHi}
            </p>
            <Link
              href="/mantras"
              className="mt-3 inline-flex min-h-11 items-center text-xs font-bold text-saffron hover:underline"
            >
              मंत्र-संग्रह →
            </Link>
          </article>
          <article className="rounded-2xl border border-warmBorder bg-surface p-5">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden /> पर्व-सूचना
            </h3>
            {todayFestival ? (
              <>
                <p className="mt-3 font-heading text-lg font-bold text-charcoal">
                  आज: {todayFestival.nameHi}
                </p>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted">
                  {todayFestival.significanceHi}
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 text-xs text-muted">आज कोई प्रमुख पर्व नहीं।</p>
                <p className="mt-2 text-sm font-bold text-charcoal">
                  अगला: {nextFestivals[0]?.nameHi ?? "—"}
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  {nextFestivals[0] ? formatDayKeyHi(nextFestivals[0].dateIso) : ""}
                </p>
              </>
            )}
            <Link
              href="/festivals"
              className="mt-3 inline-flex min-h-11 items-center text-xs font-bold text-saffron hover:underline"
            >
              पूरी पर्व-मार्गदर्शिका →
            </Link>
          </article>
        </div>
      </section>

      {/* Temple discovery */}
      <section aria-labelledby="temple-heading" className="mb-10">
        <div className="flex items-end justify-between">
          <h2 id="temple-heading" className="font-heading text-2xl font-bold text-charcoal">
            मन्दिर दर्शन — दिल्ली NCR
          </h2>
          <Link
            href="/temples"
            className="inline-flex min-h-11 items-center text-xs font-bold text-saffron hover:underline"
          >
            पूरी सूची →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLES.slice(0, 3).map((t) => (
            <TempleCard key={t.slug} temple={t} />
          ))}
        </div>
      </section>

      {/* संत दर्शन — verified akhada/south-master lineage with scroll reveal */}
      <SadhuShowcase saints={SADHUS} />

      {/* Explore by interest */}
      <section aria-labelledby="interests-heading" className="mb-10">
        <h2 id="interests-heading" className="font-heading text-2xl font-bold text-charcoal">
          रुचि के अनुसार देखें
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {INTERESTS.map(({ href, labelHi }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex min-h-11 flex-col justify-center rounded-2xl border border-warmBorder bg-surface p-4 text-center text-xs font-bold text-charcoal shadow-sm transition hover:border-saffron hover:bg-saffronSoft/40"
              >
                {labelHi}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured knowledge + save */}
      <section aria-labelledby="knowledge-heading" className="mb-10">
        <h2 id="knowledge-heading" className="font-heading text-2xl font-bold text-charcoal">
          आध्यात्मिक ज्ञान
        </h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-warmBorder bg-tealSoft p-5 lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal">
              श्रीमद्भगवद्गीता — {wisdom.sourceHi}
            </h3>
            <p lang="sa" className="mt-3 font-heading text-base leading-relaxed text-charcoal">
              {wisdom.textHi}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal">{wisdom.meaningHi}</p>
            <p className="mt-2 text-[11px] text-muted">
              मूल श्लोक शास्त्रीय है; व्याख्या सम्पादकीय। अध्याय-श्लोक स्रोत अंकित।
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/granth"
                className="inline-flex min-h-11 items-center rounded-full bg-teal px-4 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
              >
                गीता पाठ करें
              </Link>
              <FavoriteButton
                kind="wisdom"
                slug={wisdom.key}
                titleHi={wisdom.sourceHi}
                href="/daily-darshan"
              />
            </div>
          </article>
          <article className="flex flex-col justify-between rounded-2xl border border-warmBorder bg-surface p-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-saffron">
                जप माला
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal">
                डिजिटल जप माला — आपकी गणना दिन-प्रतिदिन सुरक्षित रहती है, साधना की नियमितता
                के लिए।
              </p>
            </div>
            <Link
              href="/granth"
              className="mt-4 inline-flex min-h-11 items-center rounded-full border border-warmBorder bg-cream px-4 py-1.5 text-xs font-bold text-charcoal transition hover:border-saffron"
            >
              जप आरम्भ करें
            </Link>
          </article>
        </div>
      </section>

      {/* Suvichar strip (akhada vāṇī, preserved) */}
      {suvichar && <SuvicharStrip text={suvichar.text} source={suvichar.source ?? "निरंजनी वाणी"} />}

      {/* Akhada services (preserved modules) */}
      <section aria-labelledby="services-heading" className="mb-10 mt-8">
        <h2 id="services-heading" className="font-heading text-2xl font-bold text-charcoal">
          अखाड़ा सेवाएँ एवं सुविधाएँ
        </h2>
        <div className="mt-4 space-y-4">
          <FeatureGrid />
          <QuickCards />
        </div>
      </section>

      {/* विशेष आकर्षण (preserved scope: golden baba / south saints / vriksharopan) */}
      <section aria-labelledby="attractions-heading" className="mb-10">
        <h2 id="attractions-heading" className="font-heading text-2xl font-bold text-charcoal">
          विशेष आकर्षण
        </h2>
        <div className="mt-4 space-y-3">
          {baba && (
            <GoldenBabaCard
              nameHi={baba.nameHi}
              originHi={baba.originHi ?? "केरल"}
              quoteHi={'"4 किग्रा स्वर्ण आभूषण साधना व सनातन सेवा के प्रतीक।"'}
            />
          )}
          <div className="flex items-center gap-3.5 rounded-2xl border border-warmBorder bg-surface p-4 shadow-sm">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tealSoft text-teal">
              <TreePine className="h-6 w-6" aria-hidden />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-charcoal">
                स्मृति वृक्षारोपण (अपनों की याद में पेड़)
              </h3>
              <p className="mt-0.5 text-xs text-muted">
                अखाड़े के परिसरों में GPS टैगिंग के साथ पौधा लगवाएं और ई-प्रमाण पत्र पाएं
              </p>
              <Link
                href="/gau-seva"
                className="mt-2 inline-flex min-h-11 items-center rounded-full bg-teal px-3.5 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
              >
                गौ एवं प्रकृति पोर्टल पर जाएं
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3.5 rounded-2xl border border-warmBorder bg-surface p-4 shadow-sm">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-charcoal">दक्षिण भारत के संत एवं आचार्य दर्शन</h3>
              <p className="mt-0.5 text-xs text-muted">
                स्वामी चिन्मयानंद सरस्वती, श्री नारायण गुरु एवं अन्य महान संत
              </p>
              <div className="mt-2">
                <SouthSaintsButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SatsangPlayer />
    </div>
  );
}
