// New-site flows (brief Phase 15.3): temple directory → detail → directions,
// favorites save/remove, daily darshan, mantras, festivals, site search,
// legal pages, deep-link refresh, not-found. Complements flows.spec.ts.
import { expect, test } from "@playwright/test";

test.describe("temple directory", () => {
  test("lists temples, searches, filters and opens a detail page", async ({ page }) => {
    await page.goto("/temples");
    await expect(page.getByRole("heading", { name: "मंदिर सूची" })).toBeVisible();
    await expect(page.getByText("10 मन्दिर मिले")).toBeVisible();

    // search by locality
    await page.getByLabel("मन्दिर खोजें").fill("कालकाजी");
    await expect(page.getByText("1 मन्दिर मिले")).toBeVisible();

    // open detail
    await page.getByRole("link", { name: "श्री कालकाजी मन्दिर" }).first().click();
    await expect(page).toHaveURL(/\/temples\/kalkaji-mandir-new-delhi/);
    await expect(page.getByRole("heading", { name: /Kalkaji Mandir/ })).toBeVisible();
    await expect(page.getByText("अन्तिम सत्यापन:")).toBeVisible();
    await expect(page.getByRole("link", { name: "drikpanchang.com" }).or(page.locator("a[href*='wikipedia']")).first()).toBeVisible();
  });

  test("unverified fields render as सत्यापित नहीं, never invented", async ({ page }) => {
    await page.goto("/temples/chhatarpur-temple-new-delhi");
    await expect(page.getByText("सत्यापित नहीं").first()).toBeVisible();
  });

  test("deep link refresh works (server-rendered SSG page)", async ({ page }) => {
    await page.goto("/temples/akshardham-temple-new-delhi");
    await page.reload();
    await expect(page.getByRole("heading", { name: /Akshardham/ })).toBeVisible();
  });

  test("unknown slug renders not-found", async ({ page }) => {
    const res = await page.goto("/temples/no-such-temple");
    expect(res?.status()).toBe(404);
  });

  test("category deep-link preselects the filter", async ({ page }) => {
    await page.goto("/temples?category=SHAIVA");
    await expect(page.getByText("1 मन्दिर मिले")).toBeVisible();
  });
});

test.describe("favorites (local-only)", () => {
  test("save → badge in /saved → remove", async ({ page }) => {
    await page.goto("/temples/kalkaji-mandir-new-delhi");
    await page.getByRole("button", { name: /मन्दिर सेव करें/ }).click();
    await expect(page.getByText("आपकी सूची में सेव हो गया")).toBeVisible();

    await page.goto("/saved");
    await expect(page.getByText("कालकाजी").first()).toBeVisible();
    await expect(page.getByText("1 चीज़ें सेव हैं")).toBeVisible();

    // persists across reload (localStorage)
    await page.reload();
    await expect(page.getByText("1 चीज़ें सेव हैं")).toBeVisible();

    await page.getByRole("button", { name: "हटाएँ: श्री कालकाजी मन्दिर" }).click();
    await expect(page.getByText("अभी कुछ सेव नहीं किया")).toBeVisible();
  });
});

test.describe("daily darshan + content", () => {
  test("daily darshan shows featured temple, dated wisdom, upcoming festivals", async ({ page }) => {
    await page.goto("/daily-darshan");
    await expect(page.getByRole("heading", { name: "दैनिक दर्शन" })).toBeVisible();
    await expect(page.getByText("आज का मन्दिर दर्शन")).toBeVisible();
    await expect(page.getByText("आज की प्रेरणा")).toBeVisible();
    await expect(page.getByText(/— श्रीमद्भगवद्गीता|— बृहदारण्यक|— मुण्डक|— महा उपनिषद्|— छान्दोग्य/).first()).toBeVisible();
    await expect(page.getByText("आगामी पर्व")).toBeVisible();
  });

  test("mantra library: search, meaning reveal, copy", async ({ page }) => {
    await page.goto("/mantras");
    await expect(page.getByText("12 मंत्र")).toBeVisible();
    await page.getByLabel("मंत्र खोजें").fill("गायत्री");
    await expect(page.getByText("1 मंत्र")).toBeVisible();
    await page.getByRole("button", { name: "अर्थ एवं स्रोत देखें" }).click();
    await expect(page.getByText("ऋग्वेद 3.62.10")).toBeVisible();
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "मंत्र कॉपी करें" }).click();
    await expect(page.getByText("मंत्र कॉपी हो गया")).toBeVisible();
  });

  test("festivals page shows verified dates with sources", async ({ page }) => {
    await page.goto("/festivals");
    await expect(page.getByText("drikpanchang.com से सत्यापित")).toBeVisible();
    await expect(page.getByText("करवा चौथ").first()).toBeVisible();
    await expect(page.locator("a[href*='drikpanchang.com']").first()).toBeVisible();
  });
});

test.describe("site search", () => {
  test("searches across content with Devanagari and English", async ({ page }) => {
    await page.goto("/search");
    await page.getByLabel("साइट में खोजें").fill("Kalkaji");
    await expect(page.getByText(/परिणाम मिले/)).toBeVisible();
    await expect(page.getByText("श्री कालकाजी मन्दिर").first()).toBeVisible();
  });

  test("empty results show a useful empty state", async ({ page }) => {
    await page.goto("/search");
    await page.getByLabel("साइट में खोजें").fill("zzzzqqqq");
    await expect(page.getByText("कुछ नहीं मिला")).toBeVisible();
  });
});

test.describe("informational pages + shell", () => {
  test("about, privacy, terms, content-sources render", async ({ page }) => {
    for (const [path, heading] of [
      ["/about", "परिचय"],
      ["/privacy", "गोपनीयता नीति"],
      ["/terms", "उपयोग की शर्तें"],
      ["/content-sources", "स्रोत एवं सुधार"],
    ] as const) {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
  });

  test("footer links to legal pages; desktop header nav at 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    // desktop tier: header site-nav visible, bottom tab bar hidden
    await expect(page.getByRole("navigation", { name: "साइट पृष्ठ" })).toBeVisible();
    await expect(page.locator('nav[aria-label="मुख्य नेविगेशन"]')).toBeHidden();
    await page.getByRole("contentinfo").getByRole("link", { name: "गोपनीयता नीति" }).click();
    await expect(page).toHaveURL(/\/privacy/);
  });

  test("sitemap and robots are served", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("/temples/kalkaji-mandir-new-delhi");
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Sitemap:");
  });
});
