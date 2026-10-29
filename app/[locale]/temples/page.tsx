import type { Metadata } from "next";
import TempleDirectory from "@/components/site/TempleDirectory";
import { TEMPLES } from "@/lib/data/temples";

export const metadata: Metadata = {
  title: "मंदिर सूची — दिल्ली NCR के प्रमुख मंदिर",
  description:
    "दिल्ली, नोएडा, गुरुग्राम, ग़ाज़ियाबाद एवं फ़रीदाबाद के वास्तविक मंदिरों की सत्यापित सूची — पता, समय, मार्ग एवं विशेष जानकारी स्रोतों के साथ।",
};

export default async function TemplesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-charcoal">मंदिर सूची</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          दिल्ली NCR के वास्तविक, श्रद्धेय मंदिर — नाम, पता, निकटतम मेट्रो, दर्शन-समय और रास्ता,
          सत्यापित स्रोतों के साथ। जो सूचना सत्यापित नहीं है, उसे स्पष्ट रूप से ऐसा ही दिखाया गया है।
          स्थान-अनुमति देना पूरी तरह वैकल्पिक है।
        </p>
      </header>
      <TempleDirectory temples={TEMPLES} initialCategory={category} />
    </div>
  );
}
