import type { Metadata } from "next";
import Link from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "सम्पर्क एवं सुधार",
  description:
    "सुधार सुझाएँ, सामग्री फीडबैक दें या नए मन्दिर की सूचना दें — सनातन श्री निरंजनी।",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">सम्पर्क एवं सुधार</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-charcoal">
        <p>
          इस प्लेटफॉर्म की जानकारी श्रद्धा और सावधानी से सत्यापित की जाती है, फिर भी त्रुटि
          संभव है। आपके सुधार स्वागत योग्य हैं।
        </p>
        <div className="rounded-2xl border border-warmBorder bg-surface p-5">
          <h2 className="font-heading text-lg font-bold">मन्दिर-सूचना में सुधार</h2>
          <p className="mt-1.5 text-muted">
            किसी मन्दिर का समय, पता या अन्य विवरण बदला/गलत लगे तो मन्दिर-पृष्ठ पर दिए स्रोत
            के साथ{" "}
            <Link href="/content-sources" className="font-medium text-teal underline hover:text-saffron">
              सुधार-प्रक्रिया
            </Link>{" "}
            का उपयोग करें। सत्यापन के बाद सुधार प्रकाशित होता है और स्रोत-तिथि अद्यतन होती है।
          </p>
        </div>
        <div className="rounded-2xl border border-warmBorder bg-surface p-5">
          <h2 className="font-heading text-lg font-bold">अखाड़ा सेवाएँ (बुकिंग/गौ सेवा)</h2>
          <p className="mt-1.5 text-muted">
            गाड़ी पूजन, नामकरण, संत-दर्शन, गौ सेवा व वृक्षारोपण हेतु ऐप के भीतर ही बुकिंग-फॉर्म
            उपलब्ध हैं —{" "}
            <Link href="/gau-seva" className="font-medium text-teal underline hover:text-saffron">गौ सेवा</Link>{" "}
            एवं{" "}
            <Link href="/bookings" className="font-medium text-teal underline hover:text-saffron">बुकिंग</Link>{" "}
            पृष्ठ देखें।
          </p>
        </div>
        <div className="rounded-2xl border border-warmBorder bg-surface p-5">
          <h2 className="font-heading text-lg font-bold">नए मन्दिर की सूचना</h2>
          <p className="mt-1.5 text-muted">
            किसी मन्दिर को जोड़वाना हो तो उसका आधिकारिक नाम, पता, सत्यापन-स्रोत (आधिकारिक
            वेबसाइट/प्रामाणिक पृष्ठ) और यथासम्भव छायाचित्र-स्रोत भेजें। अनाधिकृत/असत्यापित
            सूचना प्रकाशित नहीं की जाती।
          </p>
        </div>
      </div>
    </div>
  );
}
