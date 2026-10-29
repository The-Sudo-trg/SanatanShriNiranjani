import { describe, expect, it } from "vitest";

import {
  DEFAULT_LOCALE,
  LOCALES,
  MESSAGES,
  createTranslator,
  isLocale,
  normalizeLocale,
  roleLabelKey,
  t,
} from "@/lib/i18n";

// Language toggle contract: English is the default and unknown locales fail safe to English.
describe("i18n", () => {
  it("defaults to English and recognises only supported locales", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(LOCALES).toEqual(["en", "hi"]);
    expect(isLocale("hi")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(normalizeLocale("fr")).toBe("en");
    expect(normalizeLocale("en")).toBe("en");
  });

  it("has a complete English catalogue (no missing or extra keys)", () => {
    const hiKeys = Object.keys(MESSAGES.hi).sort();
    const enKeys = Object.keys(MESSAGES.en).sort();
    expect(enKeys).toEqual(hiKeys);
    for (const key of hiKeys) {
      expect(MESSAGES.en[key as keyof typeof MESSAGES.en].length).toBeGreaterThan(0);
    }
  });

  it("translates shell strings and never returns an empty value", () => {
    expect(t("hi", "nav.temples")).toBe("मंदिर");
    expect(t("en", "nav.temples")).toBe("Temples");
    expect(t("en", "header.login")).toBe("Log in");
    expect(t("hi", "auth.register.title")).toContain("पंजीकरण");
    expect(t("en", "auth.profile.title")).toBe("My profile");
    const tr = createTranslator("en");
    expect(tr("header.logout")).toBe("Log out");
    for (const key of Object.keys(MESSAGES.hi) as Array<keyof typeof MESSAGES.hi>) {
      expect(t("hi", key).length).toBeGreaterThan(0);
      expect(t("en", key).length).toBeGreaterThan(0);
    }
  });

  it("maps every role to a badge key in both languages", () => {
    expect(roleLabelKey("USER")).toBe("auth.roleBadge.user");
    expect(roleLabelKey("SADHU")).toBe("auth.roleBadge.sadhu");
    expect(roleLabelKey("VOLUNTEER")).toBe("auth.roleBadge.volunteer");
    expect(roleLabelKey("ADMIN")).toBe("auth.roleBadge.admin");
    expect(roleLabelKey("something-else")).toBe("auth.roleBadge.user");
    expect(t("hi", roleLabelKey("SADHU"))).toBe("संत");
  });
});
