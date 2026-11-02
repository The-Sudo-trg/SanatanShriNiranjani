import type { Metadata } from "next";
import SavedList from "@/components/site/SavedList";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: localeCopy(locale, "सेव किया हुआ", "Saved items"),
    description: localeCopy(locale, "आपकी सेव की हुई सूची — मन्दिर, मंत्र, पर्व एवं प्रेरणा। यह सूची केवल आपके उपकरण पर रहती है।", "Your saved temples, mantras, festivals, and reflections. This list stays on your device."),
    robots: { index: false, follow: true },
  };
}

export default async function SavedPage() {
  const locale = await getLocale();
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 font-heading text-2xl font-bold text-charcoal">{c("सेव किया हुआ", "Saved items")}</h1>
      <p className="mb-5 text-sm text-muted">
        {c("आपकी सूची आपके उपकरण (localStorage) पर सुरक्षित रहती है — कोई खाता नहीं, कोई सर्वर-डेटा नहीं.", "Your list is stored on your device (localStorage)—no account or server-side list.")}
      </p>
      <SavedList locale={locale} />
    </div>
  );
}
