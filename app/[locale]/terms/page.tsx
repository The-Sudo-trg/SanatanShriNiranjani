import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "उपयोग की शर्तें",
  description: "सनातन श्री निरंजनी वेबसाइट के उपयोग की शर्तें एवं सामग्री-अस्वीकरण।",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">उपयोग की शर्तें</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-charcoal">
        <h2 className="pt-2 font-heading text-xl font-bold">सामग्री-अस्वीकरण</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            मन्दिर-समय, पते व पर्व-तिथियाँ प्रयासपूर्वक सत्यापित की जाती हैं, परन्तु बदल
            सकती हैं। यात्रा/व्रत से पूर्व आधिकारिक स्रोत से पुष्टि करें।
          </li>
          <li>
            पंचांग-विवरण स्थान व परम्परा के अनुसार भिन्न होते हैं; वेबसाइट की जानकारी
            सामान्य-मार्गदर्शन है, धार्मिक आदेश नहीं।
          </li>
          <li>सम्प्रदायों में रीतियों की विविधता आदरपूर्वक स्वीकार की जाती है।</li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">उचित उपयोग</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            फोरम/जिज्ञासा में आदरपूर्ण भाषा रखें; अपमानजनक, विभाजनकारी या स्पैम सामग्री
            संयमित (moderated) की जाती है।
          </li>
          <li>बुकिंग-फॉर्म में सही विवरण दें; झूठी बुकिंग सेवा-व्यवस्था पर भार है।</li>
          <li>साइट की सामग्री व्यक्तिगत, अवाणिज्यिक उपयोग हेतु है; बिना अनुमति पुनर्प्रकाशन न करें।</li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">बौद्धिक सम्पदा</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>पवित्र पाठ सार्वजनिक डोमेन में हैं; व्याख्याएँ साइट की सम्पादकीय सामग्री हैं।</li>
          <li>छायाचित्र Wikimedia Commons लाइसेंस अनुसार स्रोत/लेखक-सहित प्रयुक्त हैं।</li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">कोड लाइसेंस</h2>
        <p>कोड MIT लाइसेंस (c) 2026 The-Sudo-trg के अन्तर्गत है।</p>
      </div>
    </div>
  );
}
