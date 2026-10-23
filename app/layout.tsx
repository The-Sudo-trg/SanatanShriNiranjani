import type { Metadata, Viewport } from "next";
import { Noto_Sans_Devanagari } from "next/font/google";
import { Toaster } from "sonner";
import Header from "@/components/shell/Header";
import SearchBar from "@/components/shell/SearchBar";
import BottomNav from "@/components/shell/BottomNav";
import DesktopNav from "@/components/shell/DesktopNav";
import ModalRoot from "@/components/shell/ModalRoot";
import CartHydrator from "@/components/shell/CartHydrator";
import { prisma } from "@/lib/db";
import type { SaintRow, TempleRow } from "@/lib/content";
import "./globals.css";

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-noto-devanagari",
});

export const metadata: Metadata = {
  title: "Satantani — Pure Pooja Samagri for Sacred Living",
  description: "Authentic, handpicked and ethically sourced pooja samagri, puja kits and cow-based products delivered with devotion.",
  manifest: "/manifest.json",
  applicationName: "सनातन श्री निरंजनी",
};

export const viewport: Viewport = {
  themeColor: "#FF6700",
  width: "device-width",
  initialScale: 1,
};

// ---------- Responsive shell (3 tiers) --------------------------------------
// <md      : mobile — full-bleed fluid width, bottom 5-tab bar (NAVIGATION §2)
// md–lg    : tablet/landscape — centered rounded app card on the divine bg
// ≥lg      : desktop — full-width app, left rail nav, content centered at 6xl
// All tiers keep the app-window model (internal main scroll) so modals,
// toasts and the PWA shell behave identically on every device.
// Suppresses the form-filler-extension hydration noise (fdprocessedid).

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [temples, saints] = await Promise.all([
    prisma.temple.findMany().catch(() => []),
    prisma.saint.findMany({ orderBy: { order: "asc" } }).catch(() => []),
  ]);
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
    <html lang="hi" className={devanagari.variable} suppressHydrationWarning>
      <body
        className="min-h-dvh bg-divineBg font-devanagari text-gray-800"
        suppressHydrationWarning
      >
        <div
          suppressHydrationWarning
          className="flex min-h-dvh justify-center sm:items-center sm:p-4"
        >
          <div
            suppressHydrationWarning
            className="relative flex h-dvh w-full max-w-lg flex-col overflow-hidden bg-white
                       sm:h-[900px] sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl sm:border
                       sm:border-amber-200 sm:shadow-2xl
                       lg:max-w-none lg:h-dvh lg:max-h-none lg:rounded-none lg:border-none lg:shadow-none"
          >
            <Header />
            <SearchBar />
            <div suppressHydrationWarning className="flex min-h-0 flex-1">
              <DesktopNav />
              <main className="hide-scrollbar min-w-0 flex-1 overflow-y-auto pb-24 lg:pb-8">
                <div className="mx-auto w-full lg:max-w-6xl">{children}</div>
              </main>
            </div>
            <BottomNav />
            <ModalRoot temples={templeRows} saints={saintRows} />
            <CartHydrator />
          </div>
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
