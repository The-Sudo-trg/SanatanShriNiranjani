import Link from "@/i18n/navigation";

import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";
import { t, type Locale, type MessageKey } from "@/lib/i18n";

// Footer v2 (brief §4.7) — charcoal band, four link columns, legal row.
// Labels are rendered from the URL-selected locale.
type FooterLink = { href: string; key: MessageKey };

const COLS: ReadonlyArray<{ titleKey: MessageKey; links: FooterLink[] }> = [
  {
    titleKey: "footer.col.daily",
    links: [
      { href: "/daily-darshan", key: "footer.daily.darshan" },
      { href: "/mantras", key: "footer.daily.mantras" },
      { href: "/festivals", key: "footer.daily.festivals" },
      { href: "/granth", key: "footer.daily.granth" },
    ],
  },
  {
    titleKey: "footer.col.temples",
    links: [
      { href: "/temples", key: "footer.temples.list" },
      { href: "/temples?category=SHAIVA", key: "footer.temples.shaiva" },
      { href: "/temples?category=SHAKTA", key: "footer.temples.shakta" },
      { href: "/temples?category=VAISHNAVA", key: "footer.temples.vaishnava" },
    ],
  },
  {
    titleKey: "footer.col.services",
    links: [
      { href: "/gau-seva", key: "footer.services.gau" },
      { href: "/bookings", key: "footer.services.bookings" },
      { href: "/store", key: "footer.services.store" },
      { href: "/kumbh-2027", key: "footer.services.kumbh" },
    ],
  },
  {
    titleKey: "footer.col.info",
    links: [
      { href: "/about", key: "footer.info.about" },
      { href: "/content-sources", key: "footer.info.sources" },
      { href: "/privacy", key: "footer.info.privacy" },
      { href: "/terms", key: "footer.info.terms" },
    ],
  },
];

export default function Footer({ locale }: { locale: Locale }) {
  const brandName = locale === "en" ? "Sanatan Shri Niranjani" : APP_NAME;
  const brandSubtitle = locale === "en" ? "Shri Panchayati Akhara Niranjani" : APP_SUBTITLE;
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
                {locale === "en" ? "SN" : "ॐ"}
              </span>
              <span>
                <span className="block font-heading text-base font-bold text-white">{brandName}</span>
                <span className="text-[10px] tracking-wider text-gray-400">{brandSubtitle}</span>
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-400">{t(locale, "footer.blurb")}</p>
          </div>
          {COLS.map((col) => (
            <nav key={col.titleKey} aria-label={t(locale, col.titleKey)}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {t(locale, col.titleKey)}
              </h3>
              <ul className="mt-3 space-y-1">
                {col.links.map((l) => (
                  <li key={l.href + l.key}>
                    <Link
                      href={l.href}
                      suppressHydrationWarning
                      className="-mx-2 flex min-h-9 items-center rounded-lg px-2 text-xs text-gray-300 transition hover:bg-white/5 hover:text-saffronSoft"
                    >
                      {t(locale, l.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-gray-700 pt-4 text-[11px] text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {APP_NAME} — {t(locale, "footer.copyright")}
          </p>
          <p>
            {t(locale, "footer.correction")}{" "}
            <Link href="/content-sources" className="underline hover:text-saffronSoft">
              {t(locale, "footer.correctionLink")}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
