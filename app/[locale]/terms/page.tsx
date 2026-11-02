import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: localeCopy(locale, "उपयोग की शर्तें", "Terms of use"),
    description: localeCopy(locale, "सनातन श्री निरंजनी वेबसाइट के उपयोग की शर्तें एवं सामग्री-अस्वीकरण।", "Terms of use and content disclaimer for Sanatan Shri Niranjani."),
  };
}

export default async function TermsPage() {
  const locale = await getLocale();
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">{c("उपयोग की शर्तें", "Terms of use")}</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-charcoal">
        <h2 className="pt-2 font-heading text-xl font-bold">{c("सामग्री-अस्वीकरण", "Content disclaimer")}</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            {c("मन्दिर-समय, पते व पर्व-तिथियाँ प्रयासपूर्वक सत्यापित की जाती हैं, परन्तु बदल सकती हैं। यात्रा/व्रत से पूर्व आधिकारिक स्रोत से पुष्टि करें।", "Temple hours, addresses, and festival dates are reviewed but may change. Confirm with an official source before travelling or observing a fast.")}
          </li>
          <li>
            {c("पंचांग-विवरण स्थान व परम्परा के अनुसार भिन्न होते हैं; वेबसाइट की जानकारी सामान्य-मार्गदर्शन है, धार्मिक आदेश नहीं।", "Panchang details vary by location and tradition. Website information is general guidance, not a religious directive.")}
          </li>
          <li>{c("सम्प्रदायों में रीतियों की विविधता आदरपूर्वक स्वीकार की जाती है।", "We respect the diversity of practices across traditions.")}</li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">{c("उचित उपयोग", "Acceptable use")}</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            {c("फोरम/जिज्ञासा में आदरपूर्ण भाषा रखें; अपमानजनक, विभाजनकारी या स्पैम सामग्री संयमित (moderated) की जाती है।", "Use respectful language in the forum. Abusive, divisive, or spam content is moderated.")}
          </li>
          <li>{c("बुकिंग-फॉर्म में सही विवरण दें; झूठी बुकिंग सेवा-व्यवस्था पर भार है।", "Provide accurate details in booking forms; false bookings disrupt service coordination.")}</li>
          <li>{c("साइट की सामग्री व्यक्तिगत, अवाणिज्यिक उपयोग हेतु है; बिना अनुमति पुनर्प्रकाशन न करें।", "Site content is for personal, non-commercial use. Do not republish it without permission.")}</li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">{c("बौद्धिक सम्पदा", "Intellectual property")}</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>{c("पवित्र पाठ सार्वजनिक डोमेन में हैं; व्याख्याएँ साइट की सम्पादकीय सामग्री हैं।", "Sacred texts are in the public domain; explanations are editorial content of this site.")}</li>
          <li>{c("छायाचित्र Wikimedia Commons लाइसेंस अनुसार स्रोत/लेखक-सहित प्रयुक्त हैं।", "Photographs are used with source and author attribution under their Wikimedia Commons licenses.")}</li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">{c("कोड लाइसेंस", "Code license")}</h2>
        <p>{c("कोड MIT लाइसेंस (c) 2026 The-Sudo-trg के अन्तर्गत है।", "The code is licensed under the MIT License (c) 2026 The-Sudo-trg.")}</p>
      </div>
    </div>
  );
}
