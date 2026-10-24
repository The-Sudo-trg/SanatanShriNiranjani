import type { Metadata } from "next";
import SavedList from "@/components/site/SavedList";

export const metadata: Metadata = {
  title: "सेव किया हुआ",
  description: "आपकी सेव की हुई सूची — मन्दिर, मंत्र, पर्व एवं प्रेरणा। यह सूची केवल आपके उपकरण पर रहती है।",
  alternates: { canonical: "/saved" },
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 font-heading text-2xl font-bold text-charcoal">सेव किया हुआ</h1>
      <p className="mb-5 text-sm text-muted">
        आपकी सूची आपके उपकरण (localStorage) पर सुरक्षित रहती है — कोई खाता नहीं, कोई
        सर्वर-डेटा नहीं।
      </p>
      <SavedList />
    </div>
  );
}
