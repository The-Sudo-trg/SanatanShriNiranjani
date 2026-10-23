import type { Metadata, Viewport } from "next";
import { Noto_Sans_Devanagari } from "next/font/google";
import { Toaster } from "sonner";
import Header from "@/components/shell/Header";
import SearchBar from "@/components/shell/SearchBar";
import BottomNav from "@/components/shell/BottomNav";
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
  title: "सनातन श्री निरंजनी — Sanatan Shri Niranjani Master App",
  description: "श्री पंचायती अखाड़ा निरंजनी — सनातन धर्म का डिजिटल द्वार",
  manifest: "/manifest.json",
  applicationName: "सनातन श्री निरंजनी",
};

export const viewport: Viewport = {
  themeColor: "#FF6700",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Seeded directory/temple content is shell-level (modals live on every page, NAVIGATION §4)
  const [temples, saints] = await Promise.all([
    prisma.temple.findMany({ orderBy: { id: "asc" } }),
    prisma.saint.findMany({ orderBy: { order: "asc" } }),
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
    <html lang="hi" className={devanagari.variable}>
      <body className="min-h-screen bg-divineBg font-devanagari text-gray-800">
        {/* Mobile shell → desktop phone-frame (DESIGN §4) */}
        <div className="flex min-h-screen justify-center sm:items-center sm:p-4">
          <div className="relative flex h-screen w-full max-w-md flex-col overflow-hidden bg-white sm:h-[880px] sm:rounded-3xl sm:border sm:border-amber-200 sm:shadow-2xl">
            <Header />
            <SearchBar />
            <main className="hide-scrollbar flex-1 overflow-y-auto pb-24">{children}</main>
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
