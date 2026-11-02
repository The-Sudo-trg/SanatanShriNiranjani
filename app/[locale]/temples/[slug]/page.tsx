import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Clock, ExternalLink, Info, MapPin, Navigation, Train } from "lucide-react";
import FavoriteButton from "@/components/site/FavoriteButton";
import TempleCard from "@/components/site/TempleCard";
import ShareButton from "@/components/site/ShareButton";
import { TEMPLES, findTemple, TEMPLE_CATEGORIES } from "@/lib/data/temples";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

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
  const locale = await getLocale();
  const title = locale === "en" ? temple.officialName : temple.nameHi;
  return {
    title: localeCopy(locale, `${title} — पता, दर्शन समय एवं मार्गदर्शन`, `${title} — address, visiting hours, and directions`),
    description: locale === "en" ? temple.descriptionEn : temple.descriptionHi,
    openGraph: {
      title: `${title} | ${localeCopy(locale, "सनातन श्री निरंजनी", "Sanatan Shri Niranjani")}`,
      description: locale === "en" ? temple.descriptionEn : temple.descriptionHi,
      images: temple.photo ? [{ url: temple.photo.url, alt: temple.photo.alt }] : undefined,
    },
  };
}

function Field({
  label,
  value,
  locale,
}: {
  label: string;
  value: string | null;
  locale: "en" | "hi";
}) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm leading-relaxed text-charcoal">
        {value ?? <span className="text-muted">{locale === "en" ? "Not verified" : "सत्यापित नहीं"}</span>}
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

  const locale = await getLocale();
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  const templeName = locale === "en" ? temple.officialName : temple.nameHi;
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
      <nav aria-label={c("ब्रेडक्रम्ब", "Breadcrumb")} className="mb-4 text-xs text-muted">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-saffron">{c("होम", "Home")}</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/temples" className="hover:text-saffron">{c("मंदिर सूची", "Temple directory")}</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-charcoal">{templeName}</li>
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
          {c("चित्र: ", "Photo: ")}{temple.photo.author}, {temple.photo.license} —{" "}
          <a href={temple.photo.pageUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-saffron">
            {c("स्रोत", "Source")}
          </a>
        </figcaption>
      )}

      <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-charcoal">{temple.officialName}</h1>
          {temple.altName && !(locale === "en" && /[\u0900-\u097f]/.test(temple.altName)) && (
            <p className="mt-1 text-sm text-muted">{temple.altName}</p>
          )}
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
            {category && (
              <span className="rounded-full bg-tealSoft px-2 py-0.5 font-medium text-teal">
                {locale === "en" ? category.labelEn : category.labelHi}
              </span>
            )}
            <span>
              {c("प्रमुख देवता: ", "Principal deity: ")}
              {locale === "en" && /[\u0900-\u097f]/.test(temple.deity)
                ? "[English deity name to be confirmed]"
                : temple.deity}
            </span>
          </p>
        </div>
        <FavoriteButton
          kind="temple"
          slug={temple.slug}
          titleHi={temple.nameHi}
          href={`/temples/${temple.slug}`}
          label={c("मन्दिर सेव करें", "Save temple")}
          locale={locale}
        />
      </div>
      <p className="mt-2 text-xs text-muted">
        {c(
          "सेव की गई मंदिर-सूची केवल इस उपकरण पर रहती है; मंदिर-प्रबंधन खाते से जुड़ी फॉलो सुविधा अभी उपलब्ध नहीं है।",
          "Saved temples are stored on this device only; account-based following by temple administrators is not available."
        )}
      </p>

      <section className="mt-5 rounded-2xl border border-warmBorder bg-cream p-5" aria-labelledby="profile-features-heading">
        <h2 id="profile-features-heading" className="font-heading text-lg font-bold text-charcoal">
          {c("प्रोफ़ाइल सुविधाएँ", "Profile features")}
        </h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <li className="rounded-xl bg-surface p-3">
            <strong>{c("फोटो", "Photos")}:</strong>{" "}
            {temple.photo ? c("स्रोत और लाइसेंस सहित उपलब्ध", "Available with source and license") : c("उपलब्ध नहीं", "Unavailable")}
          </li>
          <li className="rounded-xl bg-surface p-3">
            <strong>{c("इतिहास एवं आरती-विवरण", "History and aarti details")}:</strong>{" "}
            {c("[To be confirmed]", "[To be confirmed]")}
          </li>
          <li className="rounded-xl bg-surface p-3">
            <strong>{c("वीडियो एवं लाइव दर्शन", "Video and live darshan")}:</strong>{" "}
            {c("उपलब्ध नहीं — कोई सत्यापित वीडियो या लाइव स्ट्रीम कॉन्फ़िगर नहीं है।", "Unavailable — no verified video or live stream is configured.")}
          </li>
          <li className="rounded-xl bg-surface p-3">
            <strong>{c("लाइक एवं टिप्पणी", "Likes and comments")}:</strong>{" "}
            {c("उपलब्ध नहीं — सुरक्षित मॉडरेशन और डेटा-बैकएंड अभी उपलब्ध नहीं हैं।", "Unavailable — moderation and a data backend are not configured.")}
          </li>
          <li className="rounded-xl bg-surface p-3 sm:col-span-2">
            <strong>{c("मंदिर प्रबंधन द्वारा संपादन", "Temple-admin editing")}:</strong>{" "}
            {c("उपलब्ध नहीं — प्रोफ़ाइल विवरण साइट के केंद्रीय सत्यापित रिकॉर्ड से प्रकाशित होते हैं; मंदिर-प्रबंधन लॉगिन उपलब्ध नहीं है।", "Unavailable — profiles use centrally maintained, verified site records; temple-admin accounts are not configured.")}
          </li>
          <li className="rounded-xl bg-surface p-3 sm:col-span-2">
            <strong>{c("केंद्रीय प्रोफ़ाइल डेटाबेस", "Central profile database")}:</strong>{" "}
            {c("अभी उपलब्ध नहीं — मंदिर रिकॉर्ड साइट के सत्यापित डेटा स्रोत में रखे जाते हैं।", "Not configured — temple records currently live in the site's verified data source.")}
          </li>
        </ul>
      </section>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal">
        {locale === "en" ? temple.descriptionEn : temple.descriptionHi}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <ShareButton title={templeName} locale={locale} />
        <a
          href={directionsUrl(temple.lat, temple.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-saffron px-5 py-2 text-sm font-bold text-white transition hover:bg-saffronDeep"
        >
          <Navigation className="h-4 w-4" aria-hidden />
          {c("रास्ता देखें", "Directions")}
        </a>
        {temple.website && (
          <a
            href={temple.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-warmBorder bg-surface px-4 py-2 text-sm font-medium text-charcoal transition hover:border-saffron"
          >
            <ExternalLink className="h-4 w-4 text-teal" aria-hidden />
            {c("आधिकारिक वेबसाइट", "Official website")}
          </a>
        )}
      </div>

      <dl className="mt-8 grid gap-5 rounded-2xl border border-warmBorder bg-surface p-5 sm:grid-cols-2">
        <Field label={c("पता", "Address")} value={temple.address} locale={locale} />
        <Field
          label={c("स्थान", "Location")}
          value={locale === "en"
            ? `${temple.city} (${temple.lat.toFixed(4)}, ${temple.lng.toFixed(4)})`
            : `${temple.locality}, ${temple.city} (${temple.lat.toFixed(4)}, ${temple.lng.toFixed(4)})`}
          locale={locale}
        />
        <div>
          <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <Clock className="h-3.5 w-3.5 text-saffron" aria-hidden /> {c("दर्शन समय", "Visiting hours")}
          </dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-charcoal">
            {locale === "en"
              ? c("[English translation to be confirmed; verify hours with the temple before travelling.]", "[English translation to be confirmed; verify hours with the temple before travelling.]")
              : temple.hours ?? <span className="text-muted">सत्यापित नहीं — जाने से पहले स्थानीय पुष्टि करें</span>}
          </dd>
        </div>
        <Field label={c("साप्ताहिक बन्दी", "Weekly closure")} value={locale === "en" && temple.weeklyClosure ? "[English translation to be confirmed]" : temple.weeklyClosure} locale={locale} />
        <div>
          <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <Train className="h-3.5 w-3.5 text-teal" aria-hidden /> {c("निकटतम मेट्रो", "Nearest metro")}
          </dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-charcoal">
            {locale === "en" && temple.metro
              ? c("[English translation to be confirmed]", "[English translation to be confirmed]")
              : temple.metro ?? <span className="text-muted">{c("सत्यापित नहीं", "Not verified")}</span>}
          </dd>
        </div>
        <Field
          label={c("पार्किंग", "Parking")}
          value={locale === "en" && temple.parking ? "[English translation to be confirmed]" : temple.parking}
          locale={locale}
        />
        <div>
          <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <Info className="h-3.5 w-3.5 text-saffron" aria-hidden /> {c("फोटोग्राफी", "Photography")}
          </dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-charcoal">
            {locale === "en" && temple.photography
              ? c("[English translation to be confirmed]", "[English translation to be confirmed]")
              : temple.photography ?? <span className="text-muted">{c("सत्यापित नहीं", "Not verified")}</span>}
          </dd>
        </div>
      </dl>

      <section className="mt-6 rounded-2xl border border-warmBorder bg-cream p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">{c("सत्यापन स्रोत", "Verification sources")}</h2>
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
          {c(`अन्तिम सत्यापन: ${temple.lastVerified}। समय व नियम बदल सकते हैं — गलत सूचना `, `Last verified: ${temple.lastVerified}. Hours and rules may change. Report an error `)}
          <Link href="/content-sources" className="underline hover:text-saffron">{c("यहाँ सुधारें", "here")}</Link>.
        </p>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-heading text-xl font-bold text-charcoal">{c("इसी श्रेणी के अन्य मंदिर", "Other temples in this category")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <TempleCard key={t.slug} temple={t} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-6 flex items-center gap-1.5 text-xs text-muted">
        <MapPin className="h-3.5 w-3.5 text-saffron" aria-hidden />
        {c("स्थान-सूचना पूर्णतः सत्यापित नहीं है; यात्रा से पूर्व आधिकारिक स्रोत से पुष्टि करें।", "Location details may not be fully verified; check an official source before travelling.")}
      </p>
    </div>
  );
}
