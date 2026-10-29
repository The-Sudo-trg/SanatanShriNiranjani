import type { Metadata } from "next";
import SiteSearch from "@/components/site/SiteSearch";

export const metadata: Metadata = {
  title: "खोज",
  description: "सनातन श्री निरंजनी में मन्दिर, मंत्र, पर्व, प्रेरणा एवं पृष्ठ खोजें।",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-5 font-heading text-2xl font-bold text-charcoal">खोजें</h1>
      <SiteSearch />
    </div>
  );
}
