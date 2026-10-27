"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import type { SadhuRecord } from "@/lib/data/sadhus";

// Landing-page "संत दर्शन" (brief Phase: saint showcase).
// - Mobile: horizontally scrollable scroll-snap carousel (keyboard-focusable).
// - sm+: 2–3 column grid.
// - Reveal: IntersectionObserver adds a one-shot CSS animation when the section
//   enters the viewport. Cards are VISIBLE by default (SSR/no-JS safe); the
//   animation only plays once revealed, with a stagger, and `motion-reduce`
//   disables it entirely.
// Class strings stay literal so Tailwind's scanner can see them.

const STAGGER_DELAYS = [
  "[animation-delay:0ms]",
  "[animation-delay:75ms]",
  "[animation-delay:150ms]",
  "[animation-delay:225ms]",
  "[animation-delay:300ms]",
] as const;

const REVEAL_ANIMATION =
  "motion-safe:animate-[sn-fade-up_600ms_ease-out_both] motion-reduce:animate-none";

export default function SadhuShowcase({ saints }: { saints: SadhuRecord[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion or unsupported observer: show the cards immediately,
    // untransformed (the motion-reduce classes also cover the pre-effect paint).
    if (prefersReducedMotion || node === null || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (saints.length === 0) return null;

  return (
    <section ref={sectionRef} aria-labelledby="sadhu-showcase-heading" className="mb-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="sadhu-showcase-heading" className="font-heading text-2xl font-bold text-charcoal">
            संत दर्शन — अखाड़ा परंपरा
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            श्री पंचायती अखाड़ा निरंजनी एवं दक्षिण भारत की साधना-परंपरा से जुड़े पूज्य संतों का सादर
            परिचय।
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-tealSoft px-3 py-1 text-[10px] font-bold text-teal sm:inline-flex">
          सत्यापित परिचय
        </span>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-muted sm:hidden">
        <span aria-hidden>↔</span> कार्ड पर बाएँ-दाएँ स्वाइप करें
      </p>

      <ul
        tabIndex={0}
        aria-label="संतों की सूची — बाएँ-दाएँ स्क्रॉल करके सभी विवरण देखें"
        className="hide-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-3"
      >
        {saints.map((saint, index) => (
          <li
            key={saint.id}
            className={`w-[82vw] max-w-xs shrink-0 snap-start sm:w-auto sm:max-w-none ${
              revealed ? `${REVEAL_ANIMATION} ${STAGGER_DELAYS[index % STAGGER_DELAYS.length]}` : ""
            }`}
          >
            <SadhuCard saint={saint} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SadhuCard({ saint }: { saint: SadhuRecord }) {
  const { image } = saint;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-warmBorder bg-surface shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-saffronSoft">
        {image ? (
          <Image
            src={image.url}
            alt={image.altHi}
            width={image.width}
            height={image.height}
            sizes="(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 30vw"
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <span
              aria-hidden
              className="flex h-20 w-20 items-center justify-center rounded-full border border-warmBorder bg-surface font-heading text-4xl text-saffron shadow-sm"
            >
              ॐ
            </span>
            <span className="px-3 text-center text-[10px] font-medium text-muted">
              सत्यापित चित्र उपलब्ध नहीं
            </span>
          </div>
        )}
      </div>

      {image && (
        <a
          href={image.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`चित्र स्रोत: ${image.credit} — ${image.license} (नई विंडो में खुलेगा)`}
          className="inline-flex min-h-11 items-center px-3 pt-1 text-[10px] leading-snug text-muted underline-offset-2 hover:text-saffron hover:underline"
        >
          चित्र: {image.credit} · {image.license}
        </a>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-base font-bold leading-snug text-charcoal">
            {saint.nameHi}
          </h3>
          {saint.memorial && (
            <span className="mt-0.5 shrink-0 rounded-full border border-warmBorder bg-cream px-2 py-0.5 text-[10px] font-medium text-muted">
              स्मृति
            </span>
          )}
        </div>

        <p className="w-fit rounded-full bg-saffronSoft px-2.5 py-0.5 text-[10px] font-bold leading-snug text-charcoal">
          {saint.padHi}
        </p>

        <p className="flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-saffron" aria-hidden />
          मूल: {saint.originHi}
        </p>

        <p className="line-clamp-4 text-xs leading-relaxed text-muted">{saint.bioHi}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-tealSoft px-2 py-0.5 text-[10px] font-medium text-teal">
            <span aria-hidden>✓</span> सत्यापित: {saint.verifiedOn}
          </span>
          {saint.sources.length > 0 && (
            <a
              href={saint.sources[0]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${saint.nameHi} — स्रोत (नई विंडो में खुलेगा)`}
              className="inline-flex min-h-11 items-center gap-1 px-1 text-[11px] font-bold text-saffron hover:underline"
            >
              स्रोत <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
