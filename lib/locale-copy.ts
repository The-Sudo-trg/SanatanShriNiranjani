import type { Locale } from "@/lib/i18n";

export function localeCopy(locale: Locale, hindi: string, english: string): string {
  return locale === "en" ? english : hindi;
}
