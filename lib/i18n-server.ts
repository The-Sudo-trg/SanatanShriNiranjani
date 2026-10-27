import { cookies } from "next/headers";

import { DEFAULT_LOCALE, LOCALE_COOKIE, normalizeLocale, type Locale } from "./i18n";

/**
 * Server-side locale: read the `sn_lang` cookie in a Request scope (layout,
 * Server Components, route handlers). Falls back to Hindi outside a request
 * scope (unit tests / build) so callers never crash.
 */
export async function getLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    return normalizeLocale(store.get(LOCALE_COOKIE)?.value);
  } catch {
    return DEFAULT_LOCALE;
  }
}
