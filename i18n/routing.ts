import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi"],
  defaultLocale: "en",
  localePrefix: "always",
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 31_536_000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
  alternateLinks: true,
});

export type AppLocale = (typeof routing.locales)[number];
