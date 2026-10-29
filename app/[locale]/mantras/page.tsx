import type { Metadata } from "next";
import MantraLibrary from "@/components/site/MantraLibrary";

export const metadata: Metadata = {
  title: "मंत्र एवं स्तोत्र संग्रह",
  description:
    "गायत्री, महामृत्युंजय, पंचाक्षर, महामंत्र आदि परम्परागत मंत्र — देवनागरी पाठ, उच्चारण-सहायता, अर्थ एवं शास्त्रीय स्रोत के साथ।",
};

export default function MantrasPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-charcoal">मंत्र एवं स्तोत्र</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          परम्परागत मंत्र-संग्रह — शुद्ध देवनागरी पाठ, उच्चारण-सहायता एवं अर्थ। मूल पाठ और
          व्याख्या अलग-अलग दिखाई जाती है; जिसका स्रोत श्रुति/स्मृति में है वह स्पष्ट लिखा गया है,
          अन्यथा &apos;परम्परा&apos; लिखा है।
        </p>
      </header>
      <MantraLibrary />
    </div>
  );
}
