import Image from "next/image";
import Link from "@/i18n/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { SADHUS } from "@/lib/data/sadhus";
import { TEMPLES } from "@/lib/data/temples";
import { wisdomForDay } from "@/lib/data/wisdom";
import { festivalForDay, upcomingFestivals } from "@/lib/data/festivals";
import { MANTRAS } from "@/lib/data/mantras";
import { kolkataDayKey } from "@/lib/dates";

const HERO_PHOTO = "https://upload.wikimedia.org/wikipedia/commons/b/bd/Akshardham_Delhi.jpg";

export default function EnglishHome() {
  const todayKey = kolkataDayKey(0);
  const today = new Date(`${todayKey}T00:00:00.000Z`);
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeZone: "Asia/Kolkata",
  }).format(today);
  const wisdom = wisdomForDay(todayKey);
  const festival = festivalForDay(todayKey);
  const nextFestivals = upcomingFestivals(todayKey, 2);
  const mantra = MANTRAS.find((item) => item.slug === "gayatri-mantra") ?? MANTRAS[0];
  const temples = TEMPLES.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Sanatan Shri Niranjani",
            url: process.env.NEXT_PUBLIC_APP_URL || "https://sanatanshriniranjani.vercel.app",
            inLanguage: "en",
            potentialAction: {
              "@type": "SearchAction",
              target: `${process.env.NEXT_PUBLIC_APP_URL || "https://sanatanshriniranjani.vercel.app"}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      <section className="grid items-center gap-6 py-8 lg:grid-cols-2 lg:gap-10 lg:py-12">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-saffron">{dateLabel}</p>
          <h1 className="mt-2 font-heading text-4xl font-bold leading-tight text-charcoal sm:text-5xl">
            Explore the living heritage of Sanatan Dharma
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Find verified temples, daily reflections, mantra guides, festival dates, and ways to serve.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/temples" className="inline-flex min-h-11 items-center rounded-full bg-saffron px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-saffronDeep">
              Explore temples
            </Link>
            <Link href="/daily-darshan" className="inline-flex min-h-11 items-center rounded-full border border-saffron bg-surface px-6 py-2.5 text-sm font-bold text-saffron transition hover:bg-saffronSoft">
              Today&apos;s reflection
            </Link>
          </div>
        </div>
        <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-warmBorder shadow-sm lg:aspect-[5/4]">
          <Image src={HERO_PHOTO} alt="Akshardham temple in New Delhi" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/80 to-transparent p-3 text-[10px] text-white/90">
            Photo: <a href="https://commons.wikimedia.org/wiki/File:Akshardham_Delhi.jpg" target="_blank" rel="noopener noreferrer" className="underline">Swaminarayan Sanstha, CC BY-SA 3.0 (Wikimedia Commons)</a>
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="today-heading" className="mb-10">
        <h2 id="today-heading" className="font-heading text-2xl font-bold text-charcoal">Today&apos;s spiritual highlights</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-warmBorder bg-surface p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron">Daily wisdom · {wisdom.sourceEn}</h3>
            <p className="mt-3 text-sm leading-relaxed text-charcoal">{wisdom.meaningEn}</p>
            <Link href="/daily-darshan" className="mt-3 inline-flex min-h-11 items-center text-xs font-bold text-saffron hover:underline">Read today&apos;s reflection →</Link>
          </article>
          <article className="rounded-2xl border border-warmBorder bg-surface p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron">Mantra of the day · {mantra.titleEn}</h3>
            <p lang="sa-Latn" className="mt-3 font-heading text-sm leading-relaxed text-charcoal">{mantra.transliteration}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{mantra.meaningEn}</p>
            <Link href="/mantras" className="mt-3 inline-flex min-h-11 items-center text-xs font-bold text-saffron hover:underline">Browse mantras →</Link>
          </article>
          <article className="rounded-2xl border border-warmBorder bg-surface p-5">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron"><CalendarDays className="h-3.5 w-3.5" aria-hidden /> Festival guide</h3>
            {festival ? <><p className="mt-3 font-heading text-lg font-bold text-charcoal">Today: {festival.nameEn}</p><p className="mt-1 text-xs leading-relaxed text-muted">{festival.significanceEn}</p></> : <><p className="mt-3 text-xs text-muted">No major festival is listed for today.</p><p className="mt-2 text-sm font-bold text-charcoal">Coming up: {nextFestivals[0]?.nameEn ?? "—"}</p></>}
            <Link href="/festivals" className="mt-3 inline-flex min-h-11 items-center text-xs font-bold text-saffron hover:underline">View festival calendar →</Link>
          </article>
        </div>
      </section>

      <section aria-labelledby="temples-heading" className="mb-10">
        <div className="flex items-end justify-between gap-3"><h2 id="temples-heading" className="font-heading text-2xl font-bold text-charcoal">Temple guide · Delhi NCR</h2><Link href="/temples" className="inline-flex min-h-11 items-center text-xs font-bold text-saffron hover:underline">All temples →</Link></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {temples.map((temple) => <article key={temple.slug} className="overflow-hidden rounded-2xl border border-warmBorder bg-surface shadow-sm">
            <Link href={`/temples/${temple.slug}`} className="relative block aspect-[16/10] bg-saffronSoft">
              {temple.photo ? <Image src={temple.photo.url} alt={`${temple.officialName}, ${temple.city}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" loading="lazy" /> : <span className="flex h-full items-center justify-center text-3xl">Temple</span>}
            </Link>
            <div className="p-4"><h3 className="font-heading text-base font-bold text-charcoal"><Link href={`/temples/${temple.slug}`}>{temple.officialName}</Link></h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted"><MapPin className="h-3.5 w-3.5 text-saffron" aria-hidden />{temple.city}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{temple.descriptionEn}</p>
              <Link href={`/temples/${temple.slug}`} className="mt-3 inline-flex min-h-11 items-center rounded-full bg-saffron px-4 py-1.5 text-xs font-bold text-white">Temple details</Link>
            </div>
          </article>)}
        </div>
      </section>

      <section aria-labelledby="saints-heading" className="mb-10">
        <h2 id="saints-heading" className="font-heading text-2xl font-bold text-charcoal">Teachers and spiritual leaders</h2>
        <p className="mt-1 text-sm text-muted">Profiles of teachers connected with the Niranjani Akhara and spiritual traditions across India.</p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SADHUS.slice(0, 3).map((saint) => <li key={saint.id} className="overflow-hidden rounded-2xl border border-warmBorder bg-surface shadow-sm">
            {saint.image && <div className="relative aspect-[4/3]"><Image src={saint.image.url} alt={saint.nameEn} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover object-top" /></div>}
            <div className="p-4"><h3 className="font-heading text-base font-bold text-charcoal">{saint.nameEn}</h3><p className="mt-2 text-xs text-muted">Verified profile · {saint.verifiedOn}</p></div>
          </li>)}
        </ul>
      </section>

      <section aria-labelledby="services-heading" className="mb-10">
        <h2 id="services-heading" className="font-heading text-2xl font-bold text-charcoal">Explore services</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["Live darshan", "/daily-darshan"], ["Kumbh 2027", "/kumbh-2027"], ["Gau seva", "/gau-seva"], ["Prayer store", "/store"], ["Saint bookings", "/bookings"], ["Scripture library", "/granth"], ["Festival calendar", "/festivals"], ["About the Akhara", "/about"]].map(([label, href]) => <Link key={href} href={href} className="flex min-h-14 items-center justify-center rounded-2xl border border-warmBorder bg-surface p-3 text-center text-xs font-bold text-charcoal shadow-sm transition hover:border-saffron">{label}</Link>)}
        </div>
      </section>
    </div>
  );
}
