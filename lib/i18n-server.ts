import { getLocale as getNextIntlLocale } from "next-intl/server";

import { DEFAULT_LOCALE, normalizeLocale, type Locale } from "./i18n";

/**
 * Server-side locale from next-intl's URL-derived request configuration.
 * Falls back to English outside a request scope so callers never crash.
 */
export async function getLocale(): Promise<Locale> {
  try {
    return normalizeLocale(await getNextIntlLocale());
  } catch {
    return DEFAULT_LOCALE;
  }
}
