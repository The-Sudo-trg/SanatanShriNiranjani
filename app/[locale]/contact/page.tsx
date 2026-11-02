import type { Metadata } from "next";
import Link from "@/i18n/navigation";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: localeCopy(locale, "सम्पर्क एवं सुधार", "Contact and corrections"),
    description: localeCopy(
      locale,
      "सुधार सुझाएँ, सामग्री फीडबैक दें या नए मन्दिर की सूचना दें — सनातन श्री निरंजनी।",
      "Suggest a correction, share content feedback, or submit a temple for review."
    ),
  };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const copy = (hi: string, en: string) => localeCopy(locale, hi, en);
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">
        {copy("सम्पर्क एवं सुधार", "Contact and corrections")}
      </h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-charcoal">
        <p>
          {copy(
            "इस प्लेटफॉर्म की जानकारी श्रद्धा और सावधानी से सत्यापित की जाती है, फिर भी त्रुटि संभव है। आपके सुधार स्वागत योग्य हैं।",
            "Information is reviewed with care, but errors can occur. We welcome corrections and feedback."
          )}
        </p>
        <div className="rounded-2xl border border-warmBorder bg-surface p-5">
          <h2 className="font-heading text-lg font-bold">
            {copy("मन्दिर-सूचना में सुधार", "Correct temple information")}
          </h2>
          <p className="mt-1.5 text-muted">
            {copy(
              "किसी मन्दिर का समय, पता या अन्य विवरण बदला/गलत लगे तो मन्दिर-पृष्ठ पर दिए स्रोत के साथ",
              "If a temple's hours, address, or other details appear incorrect, send the supporting source through the"
            )}{" "}
            <Link href="/content-sources" className="font-medium text-teal underline hover:text-saffron">
              {copy("सुधार-प्रक्रिया", "correction process")}
            </Link>{" "}
            {copy(
              "का उपयोग करें। सत्यापन के बाद सुधार प्रकाशित होता है और स्रोत-तिथि अद्यतन होती है।",
              "on the sources page. Corrections are published after verification, with the source date updated."
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-warmBorder bg-surface p-5">
          <h2 className="font-heading text-lg font-bold">
            {copy("अखाड़ा सेवाएँ (बुकिंग/गौ सेवा)", "Akhara services (bookings and gau seva)")}
          </h2>
          <p className="mt-1.5 text-muted">
            {copy(
              "गाड़ी पूजन, नामकरण, संत-दर्शन, गौ सेवा व वृक्षारोपण हेतु ऐप के भीतर ही बुकिंग-फॉर्म उपलब्ध हैं —",
              "Booking forms for vehicle puja, naming ceremonies, saint visits, gau seva, and tree planting are available in the app. See"
            )}{" "}
            <Link href="/gau-seva" className="font-medium text-teal underline hover:text-saffron">
              {copy("गौ सेवा", "gau seva")}
            </Link>{" "}
            {copy("एवं", "and")}{" "}
            <Link href="/bookings" className="font-medium text-teal underline hover:text-saffron">
              {copy("बुकिंग", "bookings")}
            </Link>{" "}
            {copy("पृष्ठ देखें।", "pages.")}
          </p>
        </div>
        <div className="rounded-2xl border border-warmBorder bg-surface p-5">
          <h2 className="font-heading text-lg font-bold">
            {copy("नए मन्दिर की सूचना", "Submit a temple")}
          </h2>
          <p className="mt-1.5 text-muted">
            {copy(
              "किसी मन्दिर को जोड़वाना हो तो उसका आधिकारिक नाम, पता, सत्यापन-स्रोत (आधिकारिक वेबसाइट/प्रामाणिक पृष्ठ) और यथासम्भव छायाचित्र-स्रोत भेजें। अनाधिकृत/असत्यापित सूचना प्रकाशित नहीं की जाती।",
              "To suggest a temple, provide its official name, address, verification source (such as an official website), and photo source if available. Unverified information is not published."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
