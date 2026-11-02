import type { Metadata } from "next";
import TempleDirectory from "@/components/site/TempleDirectory";
import { TEMPLES } from "@/lib/data/temples";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: localeCopy(locale, "मंदिर सूची — दिल्ली NCR के प्रमुख मंदिर", "Temple directory — Delhi NCR"),
    description: localeCopy(
      locale,
      "दिल्ली, नोएडा, गुरुग्राम, ग़ाज़ियाबाद एवं फ़रीदाबाद के वास्तविक मंदिरों की सत्यापित सूची — पता, समय, मार्ग एवं विशेष जानकारी स्रोतों के साथ।",
      "A source-verified directory of temples in Delhi NCR with addresses, visiting information, directions, and sources."
    ),
  };
}

export default async function TemplesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, locale] = await Promise.all([searchParams, getLocale()]);
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-charcoal">{c("मंदिर सूची", "Temple directory")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {c(
            "दिल्ली NCR के वास्तविक, श्रद्धेय मंदिर — नाम, पता, निकटतम मेट्रो, दर्शन-समय और रास्ता, सत्यापित स्रोतों के साथ। जो सूचना सत्यापित नहीं है, उसे स्पष्ट रूप से ऐसा ही दिखाया गया है। स्थान-अनुमति देना पूरी तरह वैकल्पिक है।",
            "Explore verified temples across Delhi NCR with names, addresses, visiting information, nearby transit, directions, and sources. Unverified details are identified, and location access is optional."
          )}
        </p>
      </header>
      <TempleDirectory temples={TEMPLES} initialCategory={category} locale={locale} />
    </div>
  );
}
