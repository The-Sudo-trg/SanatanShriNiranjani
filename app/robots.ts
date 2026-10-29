import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sanatanshriniranjani.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/en/saved", "/hi/saved", "/en/search", "/hi/search"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
