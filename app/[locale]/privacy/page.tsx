import type { Metadata } from "next";
import Link from "@/i18n/navigation";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: localeCopy(locale, "गोपनीयता नीति", "Privacy policy"),
    description: localeCopy(locale, "सनातन श्री निरंजनी की गोपनीयता नीति", "Privacy policy for Sanatan Shri Niranjani"),
  };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const c = (hi: string, en: string) => localeCopy(locale, hi, en);
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">{c("गोपनीयता नीति", "Privacy policy")}</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-charcoal">
        <p>{c("यह नीति उन सुविधाओं को दर्शाती है जो वास्तव में इस वेबसाइट पर लागू हैं — अनुमानित नहीं।", "This policy describes the features that are actually in use on this website.")}</p>
        <h2 className="pt-2 font-heading text-xl font-bold">{c("हम क्या संग्रहित नहीं करते", "What we do not collect")}</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>{c("खाता-पंजीकरण आवश्यक नहीं है; हम नाम, ईमेल या जन्म-तिथि नहीं माँगते।", "Browsing public pages does not require an account or ask for your name, email, or date of birth.")}</li>
          <li>{c("आपके धार्मिक विश्वास, सम्प्रदाय या व्यक्तिगत पहचान का अनुमान नहीं लगाया जाता।", "We do not infer your religious beliefs, tradition, or personal identity.")}</li>
          <li>{c("विज्ञापन-ट्रैकिंग स्क्रिप्ट नहीं हैं।", "Advertising-tracking scripts are not used.")}</li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">{c("आपके उपकरण पर रहने वाला डेटा", "Data stored on your device")}</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>{c("सेव-सूची (localStorage):", "Saved list (localStorage):")}</strong>{" "}
            {c("सेव किए मन्दिर/मंत्र/पर्व केवल आपके ब्राउज़र में रहते हैं; सर्वर पर नहीं जाते। \"सेव किया हुआ\" पृष्ठ से हटाए या पूरी सूची मिटाए जा सकती है।", "Saved temples, mantras, and festivals remain in your browser and are not sent to the server. Remove items or clear the list from the Saved page.")}
          </li>
          <li>
            <strong>{c("जप माला / थीम आदि:", "Jap mala and preferences:")}</strong>{" "}
            {c("जप-गणना आपकी इच्छा से सर्वर पर गुमनाम उपकरण-कुंजी (device key) से सिंक होती है — नाम/सम्पर्क से नहीं।", "If enabled, jap counts sync to the server using an anonymous device key, not your name or contact details.")}
          </li>
          <li>
            <strong>{c("स्थान:", "Location:")}</strong>{" "}
            {c("मन्दिर-सूची में \"नज़दीकी क्रम\" केवल आपकी स्पष्ट अनुमति पर, उसी समय के लिए उपयोग होता है; यह संग्रहित या भेजा नहीं जाता।", "Location is used only with your permission to sort nearby temples. It is not stored or sent by this site.")}
          </li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">{c("सर्वर पर सहेजा जाने वाला डेटा", "Information stored on the server")}</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>{c("बुकिंग/सेवा फॉर्म:", "Booking and seva forms:")}</strong>{" "}
            {c("बुकिंग-प्रपत्रों में आपके द्वारा दिया नाम, वाहन-नंबर या मोबाइल नंबर केवल सेवा-निष्पादन हेतु संग्रहित होता है।", "Names, vehicle numbers, and phone numbers submitted in forms are stored for service coordination.")}
          </li>
          <li>
            <strong>{c("जिज्ञासा फोरम:", "Jigyasa forum:")}</strong>{" "}
            {c("प्रश्न-उत्तर व दिया गया नाम सार्वजनिक रूप से प्रकट होता है — कृपया निजी जानकारी न लिखें।", "Questions, answers, and the name provided may be public. Do not include private information.")}
          </li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">{c("बाहरी सेवाएँ", "External services")}</h2>
        <p>{c("मन्दिर-छायाचित्र Wikimedia Commons से (स्रोत/लाइसेंस पृष्ठ पर अंकित) लोड होते हैं; नक्शे-लिंक Google Maps पर आपकी स्पष्ट क्लिक से खुलते हैं। इन सेवाओं की अपनी गोपनीयता-नीतियाँ लागू होती हैं।", "Temple photographs are served from Wikimedia Commons with source and license details. Map links open Google Maps only when you choose them. Those services have their own privacy policies.")}</p>
        <h2 className="pt-2 font-heading text-xl font-bold">{c("सम्पर्क", "Contact")}</h2>
        <p>
          {c("गोपनीयता-सम्बन्धी प्रश्न हेतु", "For privacy questions, use the")}{" "}
          <Link href="/content-sources" className="font-medium text-teal underline hover:text-saffron">
            {c("सुधार-पृष्ठ", "sources and corrections page")}
          </Link>{" "}
          {c("के माध्यम से सम्पर्क करें।", ".")}
        </p>
      </div>
    </div>
  );
}
