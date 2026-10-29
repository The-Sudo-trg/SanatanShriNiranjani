import type { MetadataRoute } from "next";
import { TEMPLES } from "@/lib/data/temples";
import { routing } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sanatanshriniranjani.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    { path: "", changeFrequency: "daily" as const, priority: 1 },
    { path: "/daily-darshan", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/temples", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/festivals", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/mantras", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/granth", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/gau-seva", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/store", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/kumbh-2027", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/about", changeFrequency: "yearly" as const, priority: 0.4 },
    { path: "/contact", changeFrequency: "yearly" as const, priority: 0.4 },
    { path: "/content-sources", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  ];
  const pathsWithTemples = [
    ...paths.map((page) => ({ ...page, lastModified: now })),
    ...TEMPLES.map((temple) => ({
      path: `/temples/${temple.slug}`,
      lastModified: new Date(temple.lastVerified),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
  const pages: MetadataRoute.Sitemap = pathsWithTemples.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${page.path}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alternateLocale) => [
            alternateLocale,
            `${SITE_URL}/${alternateLocale}${page.path}`,
          ]),
        ),
      },
    })),
  );
  return pages;
}
