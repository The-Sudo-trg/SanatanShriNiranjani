import type { Metadata } from "next";
import SiteSearch from "@/components/site/SiteSearch";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: localeCopy(locale, "खोज", "Search"),
    description: localeCopy(locale, "सनातन श्री निरंजनी में मन्दिर, मंत्र, पर्व, प्रेरणा एवं पृष्ठ खोजें।", "Search temples, mantras, festivals, reflections, and pages on Sanatan Shri Niranjani."),
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage() {
  const locale = await getLocale();
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-5 font-heading text-2xl font-bold text-charcoal">
        {localeCopy(locale, "खोजें", "Search")}
      </h1>
      <SiteSearch locale={locale} />
    </div>
  );
}
