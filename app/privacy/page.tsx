import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "गोपनीयता नीति",
  description: "सनातन श्री निरंजनी की गोपनीयता नीति — क्या डेटा कहाँ रहता है, क्या संग्रहित होता है।",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">गोपनीयता नीति</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-charcoal">
        <p>
          यह नीति उन सुविधाओं को दर्शाती है जो वास्तव में इस वेबसाइट पर लागू हैं — अनुमानित
          नहीं।
        </p>
        <h2 className="pt-2 font-heading text-xl font-bold">हम क्या संग्रहित नहीं करते</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>खाता-पंजीकरण आवश्यक नहीं है; हम नाम, ईमेल या जन्म-तिथि नहीं माँगते।</li>
          <li>आपके धार्मिक विश्वास, सम्प्रदाय या व्यक्तिगत पहचान का अनुमान नहीं लगाया जाता।</li>
          <li>विज्ञापन-ट्रैकिंग स्क्रिप्ट नहीं हैं।</li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">आपके उपकरण पर रहने वाला डेटा</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>सेव-सूची (localStorage):</strong> सेव किए मन्दिर/मंत्र/पर्व केवल आपके
            ब्राउज़र में रहते हैं; सर्वर पर नहीं जाते। &quot;सेव किया हुआ&quot; पृष्ठ से हटाए या पूरी
            सूची मिटाए जा सकती है।
          </li>
          <li>
            <strong>जप माला / थीम आदि:</strong> जप-गणना आपकी इच्छा से सर्वर पर गुमनाम
            उपकरण-कुंजी (device key) से सिंक होती है — नाम/सम्पर्क से नहीं।
          </li>
          <li>
            <strong>स्थान:</strong> मन्दिर-सूची में &quot;नज़दीकी क्रम&quot; केवल आपकी स्पष्ट अनुमति पर,
            उसी समय के लिए उपयोग होता है; यह संग्रहित या भेजा नहीं जाता।
          </li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">सर्वर पर सहेजा जाने वाला डेटा</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>बुकिंग/सेवा फॉर्म:</strong> बुकिंग-प्रपत्रों में आपके द्वारा दिया नाम,
            वाहन-नंबर या मोबाइल नंबर केवल सेवा-निष्पादन हेतु संग्रहित होता है।
          </li>
          <li>
            <strong>जिज्ञासा फोरम:</strong> प्रश्न-उत्तर व दिया गया नाम सार्वजनिक रूप से
            प्रकट होता है — कृपया निजी जानकारी न लिखें।
          </li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">बाहरी सेवाएँ</h2>
        <p>
          मन्दिर-छायाचित्र Wikimedia Commons से (स्रोत/लाइसेंस पृष्ठ पर अंकित) लोड होते हैं;
          नक्शे-लिंक Google Maps पर आपकी स्पष्ट क्लिक से खुलते हैं। इन सेवाओं की अपनी
          गोपनीयता-नीतियाँ लागू होती हैं।
        </p>
        <h2 className="pt-2 font-heading text-xl font-bold">सम्पर्क</h2>
        <p>
          गोपनीयता-सम्बन्धी प्रश्न हेतु{" "}
          <a href="/content-sources" className="font-medium text-teal underline hover:text-saffron">
            सुधार-पृष्ठ
          </a>{" "}
          के माध्यम से सम्पर्क करें।
        </p>
      </div>
    </div>
  );
}
