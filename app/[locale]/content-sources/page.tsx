import type { Metadata } from "next";
import Link from "@/i18n/navigation";
import { FESTIVALS } from "@/lib/data/festivals";
import { MANTRAS } from "@/lib/data/mantras";
import { WISDOM_ENTRIES } from "@/lib/data/wisdom";
import { TEMPLES } from "@/lib/data/temples";

export const metadata: Metadata = {
  title: "स्रोत एवं सुधार",
  description:
    "मंदिर-सूचना, पर्व-तिथियों, मंत्र-पाठों एवं छायाचित्रों के सत्यापन-स्रोत; गलती मिलने पर सुधार कैसे सुझाएँ।",
};

export default function ContentSourcesPage() {
  const photoLicenses = TEMPLES.filter((t) => t.photo).map((t) => ({
    temple: t.officialName,
    author: t.photo!.author,
    license: t.photo!.license,
    pageUrl: t.photo!.pageUrl,
  }));

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">स्रोत एवं सुधार</h1>
      <div className="mt-4 space-y-5 text-sm leading-relaxed text-charcoal">
        <section>
          <h2 className="font-heading text-xl font-bold">सत्यापन-सिद्धान्त</h2>
          <p className="mt-1.5">
            हर मन्दिर-रिकॉर्ड के साथ उसके सत्यापन-स्रोत एवं अन्तिम सत्यापन-तिथि दी जाती है।
            जो बात स्रोत से पुष्ट नहीं है, वह &quot;सत्यापित नहीं&quot; लिखी जाती है — अनुमान नहीं
            लगाया जाता।
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold">पर्व-तिथियाँ</h2>
          <p className="mt-1.5">
            सभी पर्व-तिथियाँ{" "}
            <a href="https://www.drikpanchang.com" target="_blank" rel="noopener noreferrer" className="font-medium text-teal underline hover:text-saffron">
              drikpanchang.com
            </a>{" "}
            से सत्यापित (अन्तिम सत्यापन 24 अक्टूबर 2026)। {FESTIVALS.length} पर्व वर्तमान
            सत्यापन-चक्र में शामिल हैं; प्रत्येक पर्व-पृष्ठ पर उसका सीधा स्रोत-लिंक है।
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold">मन्दिर-सूचना</h2>
          <p className="mt-1.5">
            {TEMPLES.length} मन्दिरों की जानकारी आधिकारिक मन्दिर-वेबसाइटों, दिल्ली पर्यटन,
            Wikipedia एवं विश्वसनीय सार्वजनिक स्रोतों से संकलित। प्रत्येक मन्दिर-पृष्ठ के
            &quot;सत्यापन स्रोत&quot; अनुभाग में सभी लिंक हैं।
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold">मंत्र एवं शास्त्र-पाठ</h2>
          <p className="mt-1.5">
            {MANTRAS.length} मंत्र सार्वजनिक डोमेन के परम्परागत पाठ हैं; जहाँ श्रुति/स्मृति
            स्रोत (ऋग्वेद, उपनिषद्, गीता आदि) ज्ञात है वहाँ अध्याय/मन्त्र-संख्या सहित दिया
            गया है, अन्यथा &quot;परम्परा&quot; लिखा गया है। {WISDOM_ENTRIES.length} दैनिक-प्रेरणा
            प्रविष्टियाँ अध्याय-सहित सत्यापित गीता/उपनिषद्-वाक्य हैं; व्याख्या सम्पादकीय है।
          </p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold">छायाचित्र-लाइसेंस</h2>
          <ul className="mt-2 space-y-1.5">
            {photoLicenses.map((p) => (
              <li key={p.pageUrl} className="text-xs">
                <strong>{p.temple}:</strong> © {p.author}, {p.license} —{" "}
                <a href={p.pageUrl} target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-saffron">
                  Commons पृष्ठ
                </a>
              </li>
            ))}
            <li className="text-xs">
              जिन मन्दिरों का उपयुक्त-लाइसेंस चित्र उपलब्ध नहीं, वहाँ स्वच्छ प्रतीक-स्थलापन
              (placeholder) है — भिन्न मन्दिर का चित्र प्रमाणित रूप से कभी नहीं लगाया जाता।
            </li>
          </ul>
        </section>
        <section className="rounded-2xl border border-warmBorder bg-surface p-5">
          <h2 className="font-heading text-xl font-bold">गलती सुधारें</h2>
          <p className="mt-1.5">
            किसी तिथि, समय या विवरण में त्रुटि मिले तो बताएँ: सही जानकारी + प्रामाणिक स्रोत।
            सत्यापन के बाद सुधार प्रकाशित होगा और स्रोत-तिथि अद्यतन की जाएगी। सुधार-सुझाव हेतु{" "}
            <Link href="/contact" className="font-medium text-teal underline hover:text-saffron">
              सम्पर्क पृष्ठ
            </Link>{" "}
            देखें।
          </p>
        </section>
      </div>
    </div>
  );
}
