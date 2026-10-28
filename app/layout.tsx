import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SearchBar from "@/components/shell/SearchBar";
import BottomNav from "@/components/shell/BottomNav";
import ModalRoot from "@/components/shell/ModalRoot";
import CartHydrator from "@/components/shell/CartHydrator";
import { Analytics } from "@vercel/analytics/next";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import type { SaintRow, TempleRow } from "@/lib/content";
import "./globals.css";

// Fonts (brief Phase 2): Inter for Latin body, Playfair Display for editorial
// headings, Noto Sans Devanagari for Hindi/Sanskrit — swap display, 2 weights.
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-noto-devanagari",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-inter",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-playfair",
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sanatanshriniranjani.vercel.app";
const SITE_NAME = "सनातन श्री निरंजनी";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — दैनिक दर्शन, मंदिर सूची, पर्व एवं मंत्र`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "सनातन धर्म का डिजिटल द्वार — दिल्ली NCR के सत्यापित मंदिर, दैनिक दर्शन, गीता-प्रेरणा, मंत्र-स्तोत्र, हिन्दू पर्व-मार्गदर्शिका और गौ सेवा।",
  manifest: "/manifest.json",
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — सनातन धर्म का डिजिटल द्वार`,
    description:
      "दिल्ली NCR के सत्यापित मंदिर, दैनिक दर्शन, गीता-प्रेरणा, मंत्र एवं पर्व-मार्गदर्शिका।",
    locale: "hi_IN",
    url: SITE_URL,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FF7722",
  width: "device-width",
  initialScale: 1,
};

// ---------- Site shell v3 (Day 1 auth + language) ----------------------------
// Dynamic shell: the language cookie (Hindi default, English toggle) and the
// session cookie are read per request so the header/footer/nav render in the
// chosen locale and the correct auth state (लॉग इन / प्रोफ़ाइल + लॉग आउट) without
// a flash. Content pages remain thin and re-render per request on top of this.

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, user, temples, saints] = await Promise.all([
    getLocale(),
    getSessionUser(),
    prisma.temple.findMany(),
    prisma.saint.findMany({ orderBy: { order: "asc" } }),
  ]);
  const headerUser = user
    ? { id: user.id, name: user.name, email: user.email, role: user.role }
    : null;
  const templeRows: TempleRow[] = temples.map((t) => ({
    id: t.id,
    nameHi: t.nameHi,
    distanceText: t.distanceText,
    isAkhadaBranch: t.isAkhadaBranch,
  }));
  const saintRows: SaintRow[] = saints.map((s) => ({
    id: s.id,
    nameHi: s.nameHi,
    pad: s.pad,
    bioHi: s.bioHi,
    originHi: s.originHi,
    memorial: s.memorial,
    verified: s.verified,
    order: s.order,
  }));

  return (
    <html
      lang={locale}
      className={`${devanagari.variable} ${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-cream font-body text-charcoal" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-saffron focus:px-4 focus:py-2 focus:text-white"
        >
          {locale === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to main content"}
        </a>
        <Header locale={locale} user={headerUser} />
        <SearchBar locale={locale} />
        <main id="main-content" className="pb-24 lg:pb-0">
          {children}
        </main>
        <Footer locale={locale} />
        <BottomNav locale={locale} />
        <ModalRoot temples={templeRows} saints={saintRows} user={headerUser ? { name: headerUser.name } : null} />
        <CartHydrator />
        <Toaster position="top-center" richColors />
        {/* Vercel Analytics loads from va.vercel-scripts.com in dev, which the CSP
            intentionally does not allow (no third-party scripts). Production uses
            the first-party /_vercel/insights script, so only mount it there. */}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
