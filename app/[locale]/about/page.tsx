import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const path = "/about";

  return {
    title: t("about.title"),
    description: t("about.intro"),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        en: `/en${path}`,
        hi: `/hi${path}`,
      },
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations();
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">{t("about.title")}</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-charcoal">
        <p>{t("about.intro")}</p>
        <p>{t("about.mission")}</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>{t("about.point1")}</li><li>{t("about.point2")}</li><li>{t("about.point3")}</li><li>{t("about.point4")}</li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">{t("about.principles")}</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>{t("about.truth")}</li><li>{t("about.respect")}</li><li>{t("about.privacy")}</li><li>{t("about.service")}</li>
        </ul>
        <h2 className="pt-2 font-heading text-xl font-bold">{t("about.corrections")}</h2>
        <p>
          {t("about.correctionPrompt")} {" "}
          <Link href="/content-sources" className="font-medium text-teal underline hover:text-saffron">
            {t("about.correctionLink")}
          </Link>{" "}
          {t("about.correctionEnd")}
        </p>
      </div>
    </div>
  );
}
