import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SearchBar from "@/components/shell/SearchBar";
import BottomNav from "@/components/shell/BottomNav";
import ModalRoot from "@/components/shell/ModalRoot";
import CartHydrator from "@/components/shell/CartHydrator";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { isLocale } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import type { SaintRow, TempleRow } from "@/lib/content";
import { SADHUS } from "@/lib/data/sadhus";
import "../globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sanatanshriniranjani.vercel.app";
const SITE_NAME = "सनातन श्री निरंजनी";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = isLocale(requestedLocale) ? requestedLocale : "en";
  const siteName = locale === "en" ? "Sanatan Shri Niranjani" : SITE_NAME;
  const siteTitle =
    locale === "en"
      ? "Sanatan Shri Niranjani — Darshan, temples, festivals and mantras"
      : `${SITE_NAME} — दैनिक दर्शन, मंदिर सूची, पर्व एवं मंत्र`;
  const description =
    locale === "en"
      ? "A digital gateway to Sanatan Dharma, with verified Delhi NCR temples, daily darshan, scripture, mantras, festival guidance and seva."
      : "सनातन धर्म का डिजिटल द्वार — दिल्ली NCR के सत्यापित मंदिर, दैनिक दर्शन, गीता-प्रेरणा, मंत्र-स्तोत्र, हिन्दू पर्व-मार्गदर्शिका और गौ सेवा।";

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: siteTitle, template: `%s | ${siteName}` },
    description,
    manifest: "/manifest.json",
    applicationName: siteName,
    openGraph: {
      type: "website",
      siteName,
      title: siteTitle,
      description,
      locale: locale === "en" ? "en_US" : "hi_IN",
      url: `${SITE_URL}/${locale}`,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#FF7722",
  width: "device-width",
  initialScale: 1,
};

// ---------- Site shell v3 (Day 1 auth + language) ----------------------------
// Locale comes from the URL segment; the locale cookie is only used by the
// request proxy to negotiate unprefixed entry routes.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [user, temples, saints] = await Promise.all([
    getSessionUser(),
    prisma.temple.findMany(),
    prisma.saint.findMany({ orderBy: { order: "asc" } }),
  ]);
  const headerUser = user
    ? { id: user.id, name: user.name, email: user.email, role: user.role }
    : null;
  const templeEnglish = [
    ["Sanatan Shiva Temple", "Approx. 90 meters"],
    ["Panchmukhi Hanuman Temple", "Approx. 2.3 kilometers"],
    ["Niranjani Akhara branch (Haridwar / Prayagraj)", "Official ashram and cantonment"],
  ];
  const templeRows: TempleRow[] = temples.map((t, index) => ({
    id: t.id,
    nameHi: locale === "en" ? (templeEnglish[index]?.[0] ?? "Temple") : t.nameHi,
    distanceText: locale === "en" ? (templeEnglish[index]?.[1] ?? "Nearby") : t.distanceText,
    isAkhadaBranch: t.isAkhadaBranch,
  }));
  const saintRows: SaintRow[] = saints.map((s) => {
    const englishSaint = SADHUS.find((record) => record.id === s.id);
    return {
      id: s.id,
      nameHi: locale === "en" ? (englishSaint?.nameEn ?? "Spiritual teacher") : s.nameHi,
      pad: locale === "en" ? "Spiritual teacher" : s.pad,
      bioHi: locale === "en" ? "Verified profile" : s.bioHi,
      originHi: locale === "en" ? null : s.originHi,
      memorial: s.memorial,
      verified: s.verified,
      order: s.order,
    };
  });

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-cream font-body text-charcoal" suppressHydrationWarning>
        <NextIntlClientProvider messages={null}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
