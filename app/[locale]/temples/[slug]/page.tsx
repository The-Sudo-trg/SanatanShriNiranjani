import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Clock, ExternalLink, Info, MapPin, Navigation, Train } from "lucide-react";
import FavoriteButton from "@/components/site/FavoriteButton";
import TempleCard from "@/components/site/TempleCard";
import { TEMPLES, findTemple, TEMPLE_CATEGORIES } from "@/lib/data/temples";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sanatanshriniranjani.vercel.app";
const directionsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

export function generateStaticParams() {
  return TEMPLES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const temple = findTemple(slug);
  if (!temple) return {};
  return {
    title: `${temple.officialName} — पता, दर्शन समय एवं मार्गदर्शन`,
    description: temple.descriptionHi,
    openGraph: {
      title: `${temple.officialName} | सनातन श्री निरंजनी`,
      description: temple.descriptionHi,
      images: temple.photo ? [{ url: temple.photo.url, alt: temple.photo.alt }] : undefined,
    },
  };
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm leading-relaxed text-charcoal">
        {value ?? <span className="text-muted">सत्यापित नहीं</span>}
      </dd>
    </div>
  );
}

export default async function TempleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const temple = findTemple(slug);
  if (!temple) notFound();

  const category = TEMPLE_CATEGORIES.find((c) => c.value === temple.category);
  const related = TEMPLES.filter((t) => t.slug !== temple.slug && t.category === temple.category).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: temple.officialName,
    alternateName: temple.altName ?? undefined,
    description: temple.descriptionEn,
    address: {
      "@type": "PostalAddress",
      streetAddress: temple.address,
      addressLocality: temple.city,
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: temple.lat, longitude: temple.lng },
    url: temple.website ?? `${SITE_URL}/temples/${temple.slug}`,
    photo: temple.photo?.url,
    isAccessibleForFree: true,
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="ब्रेडक्रम्ब" className="mb-4 text-xs text-muted">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-saffron">होम</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/temples" className="hover:text-saffron">मंदिर सूची</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-charcoal">{temple.nameHi}</li>
        </ol>
      </nav>

      <figure className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-warmBorder bg-saffronSoft">
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
      </figure>
      {temple.photo && (
        <figcaption className="mt-1.5 text-[11px] text-muted">
          चित्र: {temple.photo.author}, {temple.photo.license} —{" "}
          <a href={temple.photo.pageUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-saffron">
            स्रोत
          </a>
        </figcaption>
      )}

      <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-charcoal">{temple.officialName}</h1>
          {temple.altName && <p className="mt-1 text-sm text-muted">{temple.altName}</p>}
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
            {category && (
              <span className="rounded-full bg-tealSoft px-2 py-0.5 font-medium text-teal">
                {category.labelHi}
              </span>
            )}
            <span>प्रमुख देवता: {temple.deity}</span>
          </p>
        </div>
        <FavoriteButton
          kind="temple"
          slug={temple.slug}
          titleHi={temple.nameHi}
          href={`/temples/${temple.slug}`}
          label="मन्दिर सेव करें"
        />
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal">{temple.descriptionHi}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={directionsUrl(temple.lat, temple.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-saffron px-5 py-2 text-sm font-bold text-white transition hover:bg-saffronDeep"
        >
          <Navigation className="h-4 w-4" aria-hidden />
          रास्ता देखें
        </a>
        {temple.website && (
          <a
            href={temple.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-warmBorder bg-surface px-4 py-2 text-sm font-medium text-charcoal transition hover:border-saffron"
          >
            <ExternalLink className="h-4 w-4 text-teal" aria-hidden />
            आधिकारिक वेबसाइट
          </a>
        )}
      </div>

      <dl className="mt-8 grid gap-5 rounded-2xl border border-warmBorder bg-surface p-5 sm:grid-cols-2">
        <Field label="पता" value={temple.address} />
        <Field
          label="स्थान"
          value={`${temple.locality}, ${temple.city} (${temple.lat.toFixed(4)}, ${temple.lng.toFixed(4)})`}
        />
        <div>
          <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <Clock className="h-3.5 w-3.5 text-saffron" aria-hidden /> दर्शन समय
          </dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-charcoal">
            {temple.hours ?? <span className="text-muted">सत्यापित नहीं — जाने से पहले स्थानीय पुष्टि करें</span>}
          </dd>
        </div>
        <Field label="साप्ताहिक बन्दी" value={temple.weeklyClosure} />
        <div>
          <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <Train className="h-3.5 w-3.5 text-teal" aria-hidden /> निकटतम मेट्रो
          </dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-charcoal">
            {temple.metro ?? <span className="text-muted">सत्यापित नहीं</span>}
          </dd>
        </div>
        <Field label="पार्किंग" value={temple.parking} />
        <div>
          <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <Info className="h-3.5 w-3.5 text-saffron" aria-hidden /> फोटोग्राफी
          </dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-charcoal">
            {temple.photography ?? <span className="text-muted">सत्यापित नहीं</span>}
          </dd>
        </div>
      </dl>

      <section className="mt-6 rounded-2xl border border-warmBorder bg-cream p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">सत्यापन स्रोत</h2>
        <ul className="mt-2 space-y-1">
          {temple.sources.map((s) => (
            <li key={s} className="text-xs">
              <a href={s} target="_blank" rel="noopener noreferrer" className="break-all text-teal underline hover:text-charcoal">
                {s}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-muted">
          अन्तिम सत्यापन: {temple.lastVerified}। समय व नियम बदल सकते हैं — गलत सूचना{" "}
          <Link href="/content-sources" className="underline hover:text-saffron">यहाँ सुधारें</Link>।
        </p>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-heading text-xl font-bold text-charcoal">इसी श्रेणी के अन्य मंदिर</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <TempleCard key={t.slug} temple={t} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-6 flex items-center gap-1.5 text-xs text-muted">
        <MapPin className="h-3.5 w-3.5 text-saffron" aria-hidden />
        स्थान-सूचना पूर्णतः सत्यापित नहीं है; यात्रा से पूर्व आधिकारिक स्रोत से पुष्टि करें।
      </p>
    </div>
  );
}
