import type { Metadata } from "next";
import MantraLibrary from "@/components/site/MantraLibrary";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: localeCopy(locale, "मंत्र एवं स्तोत्र संग्रह", "Mantra and hymn library"),
    description: localeCopy(locale, "गायत्री, महामृत्युंजय, पंचाक्षर, महामंत्र आदि परम्परागत मंत्र — देवनागरी पाठ, उच्चारण-सहायता, अर्थ एवं शास्त्रीय स्रोत के साथ।", "Traditional mantras with Devanagari text, pronunciation support, meanings, and scriptural sources."),
  };
}

export default async function MantrasPage() {
  const locale = await getLocale();
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-charcoal">{c("मंत्र एवं स्तोत्र", "Mantras and hymns")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {c(
            "परम्परागत मंत्र-संग्रह — शुद्ध देवनागरी पाठ, उच्चारण-सहायता एवं अर्थ। मूल पाठ और व्याख्या अलग-अलग दिखाई जाती है; जिसका स्रोत श्रुति/स्मृति में है वह स्पष्ट लिखा गया है, अन्यथा 'परम्परा' लिखा है।",
            "A collection of traditional mantras with Devanagari text, pronunciation support, and meanings. Original text is distinguished from editorial interpretation; verifiable scriptural sources are cited."
          )}
        </p>
      </header>
      <MantraLibrary locale={locale} />
    </div>
  );
}
