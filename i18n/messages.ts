import { MESSAGES, type Locale } from "@/lib/i18n";

export type MessageTree = { [key: string]: string | MessageTree };

function nestMessages(flatMessages: Record<string, string>): MessageTree {
  const result: MessageTree = {};

  for (const [key, value] of Object.entries(flatMessages)) {
    const segments = key.split(".");
    let branch = result;

    for (const segment of segments.slice(0, -1)) {
      const child = branch[segment];
      if (typeof child === "string") {
        throw new Error(`Translation key conflicts with namespace: ${key}`);
      }
      if (!child) branch[segment] = {};
      branch = branch[segment] as MessageTree;
    }

    branch[segments.at(-1)!] = value;
  }

  return result;
}

const nestedMessages: Record<Locale, MessageTree> = {
  en: nestMessages(MESSAGES.en),
  hi: nestMessages(MESSAGES.hi),
};

function withEnglishFallback(english: MessageTree, translated: MessageTree): MessageTree {
  const result: MessageTree = {};

  for (const key of new Set([...Object.keys(english), ...Object.keys(translated)])) {
    const englishValue = english[key];
    const translatedValue = translated[key];

    if (translatedValue === undefined || translatedValue === "") {
      if (englishValue !== undefined) result[key] = englishValue;
    } else if (
      typeof englishValue === "object" &&
      typeof translatedValue === "object"
    ) {
      result[key] = withEnglishFallback(englishValue, translatedValue);
    } else {
      result[key] = translatedValue;
    }
  }

  return result;
}

export function getMessages(locale: Locale): MessageTree {
  return locale === "en"
    ? nestedMessages.en
    : withEnglishFallback(nestedMessages.en, nestedMessages[locale]);
}
