import Link from "next/link";
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";

// Footer v2 (brief §4.7) — charcoal band, four link columns, legal row.
const COLS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "दैनिक साधना",
    links: [
      { href: "/daily-darshan", label: "दैनिक दर्शन" },
      { href: "/mantras", label: "मंत्र एवं स्तोत्र" },
      { href: "/festivals", label: "पर्व एवं कैलेण्डर" },
      { href: "/granth", label: "ग्रंथ (गीता, जप माला)" },
    ],
  },
  {
    title: "मंदिर दर्शन",
    links: [
      { href: "/temples", label: "मंदिर सूची (दिल्ली NCR)" },
      { href: "/temples?category=SHAIVA", label: "शिव मंदिर" },
      { href: "/temples?category=SHAKTA", label: "देवी मंदिर" },
      { href: "/temples?category=VAISHNAVA", label: "विष्णु / कृष्ण मंदिर" },
    ],
  },
  {
    title: "अखाड़ा सेवाएँ",
    links: [
      { href: "/gau-seva", label: "गौ सेवा एवं वृक्षारोपण" },
      { href: "/bookings", label: "पूजा बुकिंग" },
      { href: "/store", label: "पूजा स्टोर" },
      { href: "/kumbh-2027", label: "महाकुम्भ 2027" },
    ],
  },
  {
    title: "जानकारी",
    links: [
      { href: "/about", label: "परिचय" },
      { href: "/content-sources", label: "स्रोत एवं सुधार" },
      { href: "/privacy", label: "गोपनीयता नीति" },
      { href: "/terms", label: "उपयोग की शर्तें" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-12 bg-footerBg text-gray-300">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron text-lg font-bold text-white"
              >
                ॐ
              </span>
              <span>
                <span className="block font-heading text-base font-bold text-white">{APP_NAME}</span>
                <span className="text-[10px] tracking-wider text-gray-400">{APP_SUBTITLE}</span>
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-400">
              सनातन धर्म का डिजिटल द्वार — दैनिक दर्शन, सत्यापित मंदिर सूचना, मंत्र, पर्व-मार्गदर्शिका
              और श्रद्धा की सेवाएँ। आपकी प्राथमिकताएँ आपके उपकरण पर ही रहती हैं।
            </p>
          </div>
          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-xs text-gray-300 transition hover:text-saffronSoft"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-gray-700 pt-4 text-[11px] text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {APP_NAME} — श्रद्धा एवं सेवा-भाव से।</p>
          <p>
            तिथियों और मंदिर-सूचना के स्रोत दिए गए हैं; कोई गलती मिले तो{" "}
            <Link href="/content-sources" className="underline hover:text-saffronSoft">
              सुधार सुझाएँ
            </Link>
            ।
          </p>
        </div>
      </div>
    </footer>
  );
}
