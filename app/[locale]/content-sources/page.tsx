import type { Metadata } from "next";
import Link from "@/i18n/navigation";
import { FESTIVALS } from "@/lib/data/festivals";
import { MANTRAS } from "@/lib/data/mantras";
import { WISDOM_ENTRIES } from "@/lib/data/wisdom";
import { TEMPLES } from "@/lib/data/temples";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: localeCopy(locale, "स्रोत एवं सुधार", "Sources and corrections"),
    description: localeCopy(locale, "मंदिर-सूचना, पर्व-तिथियों, मंत्र-पाठों एवं छायाचित्रों के सत्यापन-स्रोत; गलती मिलने पर सुधार कैसे सुझाएँ।", "Verification sources for temple details, festival dates, mantras, and photographs, plus how to suggest a correction."),
  };
}

export default async function ContentSourcesPage() {
  const locale = await getLocale();
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  const photoLicenses = TEMPLES.filter((t) => t.photo).map((t) => ({
    temple: t.officialName,
    author: t.photo!.author,
    license: t.photo!.license,
    pageUrl: t.photo!.pageUrl,
  }));

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">{c("स्रोत एवं सुधार", "Sources and corrections")}</h1>
      <div className="mt-4 space-y-5 text-sm leading-relaxed text-charcoal">
        <section>
          <h2 className="font-heading text-xl font-bold">{c("सत्यापन-सिद्धान्त", "Verification policy")}</h2>
          <p className="mt-1.5">
            {c("हर मन्दिर-रिकॉर्ड के साथ उसके सत्यापन-स्रोत एवं अन्तिम सत्यापन-तिथि दी जाती है। जो बात स्रोत से पुष्ट नहीं है, वह \"सत्यापित नहीं\" लिखी जाती है — अनुमान नहीं लगाया जाता।", "Each temple record includes its verification sources and last-reviewed date. Details not supported by a source are marked as unverified rather than guessed.")}
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold">{c("पर्व-तिथियाँ", "Festival dates")}</h2>
          <p className="mt-1.5">
            {c("सभी पर्व-तिथियाँ ", "Festival dates are checked against ")}
            <a href="https://www.drikpanchang.com" target="_blank" rel="noopener noreferrer" className="font-medium text-teal underline hover:text-saffron">
              drikpanchang.com
            </a>{" "}
            {c(`से सत्यापित (अन्तिम सत्यापन 24 अक्टूबर 2026)। ${FESTIVALS.length} पर्व वर्तमान सत्यापन-चक्र में शामिल हैं; प्रत्येक पर्व-पृष्ठ पर उसका सीधा स्रोत-लिंक है।`, ` (last reviewed 24 October 2026). ${FESTIVALS.length} festivals are included in the current review cycle, with direct source links on each festival entry.`)}
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold">{c("मन्दिर-सूचना", "Temple information")}</h2>
          <p className="mt-1.5">
            {c(`${TEMPLES.length} मन्दिरों की जानकारी आधिकारिक मन्दिर-वेबसाइटों, दिल्ली पर्यटन, Wikipedia एवं विश्वसनीय सार्वजनिक स्रोतों से संकलित। प्रत्येक मन्दिर-पृष्ठ के "सत्यापन स्रोत" अनुभाग में सभी लिंक हैं।`, `Information for ${TEMPLES.length} temples is compiled from official temple websites, Delhi Tourism, Wikipedia, and other reliable public sources. Links appear in the verification-sources section of each temple profile.`)}
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold">{c("मंत्र एवं शास्त्र-पाठ", "Mantras and scriptural texts")}</h2>
          <p className="mt-1.5">
            {c(`${MANTRAS.length} मंत्र सार्वजनिक डोमेन के परम्परागत पाठ हैं; जहाँ श्रुति/स्मृति स्रोत (ऋग्वेद, उपनिषद्, गीता आदि) ज्ञात है वहाँ अध्याय/मन्त्र-संख्या सहित दिया गया है, अन्यथा "परम्परा" लिखा गया है। ${WISDOM_ENTRIES.length} दैनिक-प्रेरणा प्रविष्टियाँ अध्याय-सहित सत्यापित गीता/उपनिषद्-वाक्य हैं; व्याख्या सम्पादकीय है।`, `${MANTRAS.length} mantras are traditional texts in the public domain. Verifiable sources such as the Rigveda, Upanishads, or Gita are cited where known; otherwise the source is identified as tradition. The ${WISDOM_ENTRIES.length} daily reflections quote verified Gita or Upanishad passages; explanations are editorial.`)}
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold">{c("छायाचित्र-लाइसेंस", "Photo licenses")}</h2>
          <ul className="mt-2 space-y-1.5">
            {photoLicenses.map((p) => (
              <li key={p.pageUrl} className="text-xs">
                <strong>{p.temple}:</strong> © {p.author}, {p.license} —{" "}
                <a href={p.pageUrl} target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-saffron">
                  {c("Commons पृष्ठ", "Commons page")}
                </a>
              </li>
            ))}
            <li className="text-xs">
              {c("जिन मन्दिरों का उपयुक्त-लाइसेंस चित्र उपलब्ध नहीं, वहाँ स्वच्छ प्रतीक-स्थलापन (placeholder) है — भिन्न मन्दिर का चित्र प्रमाणित रूप से कभी नहीं लगाया जाता।", "Where no appropriately licensed image is available, a neutral placeholder is used; an unrelated temple image is never substituted.")}
            </li>
          </ul>
        </section>
        <section className="rounded-2xl border border-warmBorder bg-surface p-5">
          <h2 className="font-heading text-xl font-bold">{c("गलती सुधारें", "Suggest a correction")}</h2>
          <p className="mt-1.5">
            {c("किसी तिथि, समय या विवरण में त्रुटि मिले तो बताएँ: सही जानकारी + प्रामाणिक स्रोत। सत्यापन के बाद सुधार प्रकाशित होगा और स्रोत-तिथि अद्यतन की जाएगी। सुधार-सुझाव हेतु ", "If you find an incorrect date, time, or detail, provide the correction and a reliable source. After verification, the correction will be published and the source review date updated. To submit a suggestion, use the ")}
            <Link href="/contact" className="font-medium text-teal underline hover:text-saffron">
              {c("सम्पर्क पृष्ठ", "contact page")}
            </Link>{" "}
            {c("देखें।", " for guidance.")}
          </p>
        </section>
      </div>
    </div>
  );
}
