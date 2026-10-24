import Image from "next/image";
import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import FavoriteButton from "@/components/site/FavoriteButton";
import type { Temple } from "@/lib/data/temples";
import { TEMPLE_CATEGORIES } from "@/lib/data/temples";

// Temple card (brief §4.4/§5) — authentic photo with attribution alt text,
// location, deity, directions; save action. Unverified fields are not shown.
const directionsUrl = (t: Temple) =>
  `https://www.google.com/maps/dir/?api=1&destination=${t.lat},${t.lng}`;

export default function TempleCard({
  temple,
  distanceKm,
}: {
  temple: Temple;
  distanceKm?: number | null;
}) {
  const category = TEMPLE_CATEGORIES.find((c) => c.value === temple.category);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-warmBorder bg-surface shadow-sm transition hover:shadow-md">
      <Link
        href={`/temples/${temple.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-saffronSoft"
        tabIndex={-1}
        aria-hidden
      >
        {temple.photo ? (
          <Image
            src={temple.photo.url}
            alt={temple.photo.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span aria-hidden className="font-heading text-4xl text-saffron/70">ॐ</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-base font-bold leading-snug text-charcoal">
            <Link href={`/temples/${temple.slug}`} className="hover:text-saffron">
              {temple.nameHi}
            </Link>
          </h3>
          {category && (
            <span className="whitespace-nowrap rounded-full bg-tealSoft px-2 py-0.5 text-[10px] font-medium text-teal">
              {category.labelHi}
            </span>
          )}
        </div>
        <p className="flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-saffron" aria-hidden />
          {temple.locality}, {temple.city}
          {typeof distanceKm === "number" && (
            <span className="ml-1 font-medium text-charcoal">(~{distanceKm} किमी)</span>
          )}
        </p>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted">{temple.descriptionHi}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <Link
            href={`/temples/${temple.slug}`}
            className="inline-flex min-h-11 items-center rounded-full bg-saffron px-4 py-1.5 text-xs font-bold text-white transition hover:bg-saffronDeep"
          >
            मन्दिर देखें
          </Link>
          <a
            href={directionsUrl(temple)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-warmBorder bg-cream px-3 py-1.5 text-xs font-medium text-charcoal transition hover:border-saffron"
          >
            <Navigation className="h-3.5 w-3.5 text-teal" aria-hidden />
            रास्ता देखें
          </a>
          <FavoriteButton
            kind="temple"
            slug={temple.slug}
            titleHi={temple.nameHi}
            href={`/temples/${temple.slug}`}
          />
        </div>
      </div>
    </article>
  );
}
