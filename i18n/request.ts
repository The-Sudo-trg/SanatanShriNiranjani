import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getMessages } from "./messages";
import { isLocale } from "@/lib/i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: getMessages(locale),
  };
});
