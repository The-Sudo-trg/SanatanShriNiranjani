import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "परिचय — सनातन श्री निरंजनी",
  description:
    "सनातन श्री निरंजनी — श्री पंचायती अखाड़ा निरंजनी का डिजिटल द्वार: हमारा उद्देश्य, सिद्धान्त एवं सम्पर्क-मार्ग।",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">परिचय</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-charcoal">
        <p>
          <strong>सनातन श्री निरंजनी</strong> — श्री पंचायती अखाड़ा निरंजनी का डिजिटल द्वार —
          सनातन धर्म की साधना, दर्शन और सेवा को रोज़मर्रा के जीवन से जोड़ने का प्रयास है।
        </p>
        <p>हमारा उद्देश्य सीधा है:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>प्रतिदिन उपयोगी आध्यात्मिक सामग्री — दर्शन, प्रेरणा, मंत्र, पर्व-मार्गदर्शन।</li>
          <li>दिल्ली NCR के वास्तविक मन्दिरों की सत्यापित, स्रोत-सहित जानकारी।</li>
          <li>अखाड़े की सेवाएँ — गौ सेवा, वृक्षारोपण, पूजा बुकिंग, पूजा सामग्री।</li>
          <li>आदरपूर्ण भाषा, सांस्कृतिक प्रामाणिकता और स्पष्ट स्रोत-विवरण।</li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">हमारे सिद्धान्त</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>सत्य:</strong> जो सत्यापित नहीं है, उसे सत्यापित ही लिखा जाता है। तिथि, समय
            व सूचना के स्रोत दिखाए जाते हैं।
          </li>
          <li>
            <strong>आदर:</strong> किसी सम्प्रदाय की श्रेष्ठता का दावा नहीं; सभी परम्पराओं का
            समान सम्मान।
          </li>
          <li>
            <strong>निजता:</strong> प्राथमिकताएँ व सेव-सूची आपके उपकरण पर रहती हैं — खाता
            बनाना आवश्यक नहीं।
          </li>
          <li>
            <strong>सेवा:</strong> विज्ञापन-प्रेरित नहीं, भक्ति-प्रेरित अनुभव।
          </li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">सुझाव व सुधार</h2>
        <p>
          कोई गलती या सुझाव?{" "}
          <Link href="/content-sources" className="font-medium text-teal underline hover:text-saffron">
            स्रोत एवं सुधार पृष्ठ
          </Link>{" "}
          पर बताया गया मार्ग अपनाएँ। हर सुधार-सुझाव श्रद्धा व सत्य की सेवा है।
        </p>
      </div>
    </div>
  );
}
