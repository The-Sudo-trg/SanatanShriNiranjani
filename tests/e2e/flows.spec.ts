//NAVIGATION.md §6 flows F1–F10 + TESTING.md P0/P1 cases.
// Serial execution (workers=1) because the app persists to one shared SQLite file.
import { expect, type Page, test } from "@playwright/test";

/* ---------------- helpers ---------------- */

// Bottom mobile tab bar only — the header nav and footer navs share labels,
// so scope every tab lookup to the fixed bottom bar (v2 site shell).
const TAB = (name: string) => `nav[aria-label="मुख्य नेविगेशन"] >> text="${name}"`;

// Arm window.confirm handling BEFORE the triggering click. Must NOT be awaited:
// the promise-based pattern (`await page.on('dialog', …)` before the click) can
// never resolve because the dialog only fires after the click happens.
export function armDialog(page: Page, action: "accept" | "dismiss"): void {
  page.once("dialog", (dialog) => {
    void (action === "accept" ? dialog.accept() : dialog.dismiss());
  });
}

async function clearCart(page: Page): Promise<void> {
  const res = await page.request.get("/api/cart");
  const data = (await res.json().catch(() => ({ items: [] }))) as { items?: Array<{ productId: string }> };
  for (const it of data.items ?? []) {
    await page.request.delete("/api/cart", { data: { productId: it.productId } });
  }
}

function futureDate(offsetDays: number): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return d.toISOString().slice(0, 10);
}

/* ---------------- shell (TC-SH-01/02, TC-NT, TC-SR) ---------------- */

test.describe("shell", () => {
  test("TC-SH-02 five bottom tabs render their pages", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("आज का पंचांग")).toBeVisible();
    for (const [tab, url, marker] of [
      ["दर्शन", "/daily-darshan", "आज का मन्दिर दर्शन"],
      ["मंदिर", "/temples", "मंदिर सूची"],
      ["मंत्र", "/mantras", "मंत्र एवं स्तोत्र"],
      ["मेनू", "/menu", "डिजिटल परिचय पत्र"],
    ] as const) {
      await page.locator(TAB(tab)).click();
      await expect(page).toHaveURL(new RegExp(url.replace("/", "/")));
      await expect(page.getByText(marker).first()).toBeVisible();
    }
  });

  test("TC-HM-01 home shows panchang banner", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("आज का पंचांग")).toBeVisible();
    await expect(page.getByText("शुभ मुहूर्त:")).toBeVisible();
    await expect(page.getByText("सूर्योदय:")).toBeVisible();
  });

  test("TC-XC-03 sacred prices appear exactly", async ({ page }) => {
    await page.goto("/gau-seva");
    await expect(page.getByText("₹501")).toBeVisible();
    await expect(page.getByText("₹510")).toBeVisible();
    await expect(page.getByText("₹2100")).toBeVisible();
    await page.goto("/store");
    await expect(page.getByText("₹151")).toBeVisible();
    await expect(page.getByText("₹351")).toBeVisible();
  });

  test("TC-HM-02 all 5 home grid tiles open their modal/page", async ({ page }) => {
    await page.goto("/");
    const grid = page.locator("main");
    // modal-opens (लाइव दर्शन, संत बुकिंग) — grid tiles carry exact tile labels;
    // the रुचि section also links गौ सेवा so scope tightly. (AI जिज्ञासा tile was
    // removed from the landing grid by owner request — chat remains on /jigyasu.)
    await grid.getByText("लाइव दर्शन").click();
    await expect(page.getByText("अखाड़ा मंदिर लाइव दर्शन")).toBeVisible();
    await page.keyboard.press("Escape");
    await grid.getByText("संत बुकिंग").first().click();
    await expect(page.getByText("घर पर संत एवं आचार्य बुकिंग")).toBeVisible();
    await page.keyboard.press("Escape");
    // page-opens (कुंभ 2027, गौ सेवा, पूजा स्टोर) — exact names avoid the
    // "गौ सेवा एवं प्रकृति" interest card added by the v2 homepage.
    await grid.getByText("कुंभ 2027").click();
    await expect(page).toHaveURL(/kumbh-2027/);
    await page.goto("/");
    await grid.getByText("गौ सेवा", { exact: true }).click();
    await expect(page).toHaveURL(/gau-seva/);
    await page.goto("/");
    await grid.getByText("पूजा स्टोर").click();
    await expect(page).toHaveURL(/store/);
  });
});

/* ---------------- search routing (F10, TC-SR-01..05) ---------------- */

test.describe("search", () => {
  test("TC-SR-01 मंदिर → NearbyModal with 3 seeded temples", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("खोजें").fill("मंदिर");
    await page.getByLabel("खोजें").press("Enter");
    await expect(page.getByText("पास के मंदिर एवं अखाड़ा केंद्र")).toBeVisible();
    await expect(page.getByText("श्री सनातन शिव मंदिर")).toBeVisible();
    await expect(page.getByText("पंचमुखी हनुमान मंदिर")).toBeVisible();
    await expect(page.getByText("अखाड़ा निरंजनी शाखा")).toBeVisible();
  });

  test("TC-SR-02 गाड़ी → GadiPujaModal opens", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("खोजें").fill("गाड़ी");
    await page.getByLabel("खोजें").press("Enter");
    await expect(page.getByText("वाहन (गाड़ी) पूजन बुकिंग")).toBeVisible();
  });

  test("TC-SR-03 नामकरण → NamkaranModal", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("खोजें").fill("नामकरण");
    await page.getByLabel("खोजें").press("Enter");
    await expect(page.getByText("नामकरण संस्कार बुकिंग")).toBeVisible();
  });

  test("TC-SR-04 संत → AkharaDirectoryModal", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("खोजें").fill("संत");
    await page.getByLabel("खोजें").press("Enter");
    await expect(page.getByText("पदाधिकारी सूची")).toBeVisible();
  });

  test("TC-SR-05 'पास के मंदिर' chip opens NearbyModal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /पास के मंदिर/ }).click();
    await expect(page.getByText("पास के मंदिर एवं अखाड़ा केंद्र")).toBeVisible();
  });
});

/* ---------------- F1 गाड़ी पूजन booking ---------------- */

test.describe("F1 bookings", () => {
  test("F1 गाड़ी पूजन valid booking → success → मेरी बुकिंग row", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /गाड़ी पूजन/ }).click();
    await page.locator("#gadi-name").fill("रमेश कुमार");
    await page.locator("#gadi-no").fill("UP-16-AB-1234");
    await page.locator("#gadi-date").fill(futureDate(14));
    await page.getByRole("button", { name: /पूजन बुक करें/ }).click();
    await expect(
      page.getByText("गाड़ी पूजन अनुरोध प्रशासन को भेज दिया गया है"),
    ).toBeVisible();
    await expect(page.getByText("वाहन (गाड़ी) पूजन बुकिंग")).toBeHidden();

    await page.goto("/bookings");
    const row = page
      .locator("div.rounded-2xl")
      .filter({ hasText: "UP-16-AB-1234" })
      .filter({ hasText: "प्रतीक्षारत" });
    await expect(row).toBeVisible();
  });

  test("TC-BK-02 invalid vehicle number → inline Hindi error", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /गाड़ी पूजन/ }).click();
    await page.locator("#gadi-name").fill("रमेश कुमार");
    await page.locator("#gadi-no").fill("abc123");
    await page.locator("#gadi-date").fill(futureDate(14));
    await page.getByRole("button", { name: /पूजन बुक करें/ }).click();
    await expect(page.getByText(/गाड़ी नंबर सही प्रारूप में लिखें/)).toBeVisible();
    // modal stays open; no success toast
    await expect(page.getByText("गाड़ी पूजन अनुरोध प्रशासन को भेज दिया गया है")).toHaveCount(0);
  });

  test("TC-BK-03 empty date blocked with Hindi validation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /नामकरण संस्कार/ }).click();
    await page.locator("#namkaran-name").fill("सीता एवं राम");
    await page.getByRole("button", { name: "संस्कार बुकिंग भेजें" }).click();
    await expect(page.getByText(/कृपया दिनांक चुनें/)).toBeVisible();
  });

  test("TC-BK-04 नामकरण valid booking → row type NAMKARAN", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /नामकरण संस्कार/ }).click();
    await page.locator("#namkaran-name").fill("सीता एवं राम");
    await page.locator("#namkaran-date").fill(futureDate(20));
    await page.getByRole("button", { name: "संस्कार बुकिंग भेजें" }).click();
    await expect(
      page.getByText("नामकरण संस्कार हेतु आपका अनुरोध प्रशासन को भेज दिया गया है"),
    ).toBeVisible();
    await page.goto("/bookings");
    const row = page
      .locator("div.rounded-2xl")
      .filter({ hasText: "नामकरण संस्कार" })
      .filter({ hasText: "सीता एवं राम" });
    await expect(row).toBeVisible();
  });

  test("TC-BK-05 संत बुकिंग valid → row type SANT", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /संत बुकिंग/ }).first().click();
    await page.locator("#sant-name").fill("अरुण शर्मा");
    await page.locator("#sant-phone").fill("9876543210");
    await page.locator("#sant-date").fill(futureDate(10));
    await page.getByRole("button", { name: "बुकिंग अनुरोध भेजें" }).click();
    await expect(page.getByText("संत बुकिंग हेतु आपका अनुरोध प्रशासन को भेज दिया गया है")).toBeVisible();
    await page.goto("/bookings");
    const row = page
      .locator("div.rounded-2xl")
      .filter({ hasText: "संत बुकिंग" })
      .filter({ hasText: "अरुण शर्मा" });
    await expect(row).toBeVisible();
  });

  test("TC-BK-08 short phone rejected", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /संत बुकिंग/ }).first().click();
    await page.locator("#sant-name").fill("अरुण शर्मा");
    await page.locator("#sant-phone").fill("12345");
    await page.locator("#sant-date").fill(futureDate(10));
    await page.getByRole("button", { name: "बुकिंग अनुरोध भेजें" }).click();
    await expect(page.getByText(/कृपया 10 अंकों का मोबाइल नंबर लिखें/)).toBeVisible();
  });

  test("TC-BK-06 rapid double submit creates exactly one row", async ({ page }) => {
    // no DELETE API (public) — assert relative to the pre-test count instead
    const before = (await (await page.request.get("/api/bookings")).json())
      .bookings.filter((b: { vehicleNo: string | null }) => b.vehicleNo === "MH-02-CD-5678")
      .length;
    await page.goto("/");
    await page.getByRole("button", { name: /गाड़ी पूजन/ }).click();
    await page.locator("#gadi-name").fill("द्रोपदी रानी");
    await page.locator("#gadi-no").fill("MH-02-CD-5678");
    await page.locator("#gadi-date").fill(futureDate(21));
    // two rapid parallel clicks; isSubmitting guard + disabled button must absorb the second
    const submit = page.getByRole("button", { name: /पूजन बुक करें/ });
    const rapidClicks = Promise.allSettled([submit.click(), submit.click()]);
    await expect(page.getByText(/गाड़ी पूजन अनुरोध प्रशासन को भेज दिया गया है/)).toBeVisible();
    await rapidClicks;

    await page.goto("/bookings");
    const rows = page.getByText("MH-02-CD-5678");
    await expect(rows).toHaveCount(before + 1);
  });
});

/* ---------------- F2/F3 गौ सेवा ---------------- */

test.describe("gau seva", () => {
  test("F2 tree plantation names donor + tree (TC-GS-01)", async ({ page }) => {
    await page.goto("/gau-seva");
    await page.locator("#tree-donor").fill("रामप्रसाद");
    await page.locator("#tree-type").selectOption({ label: "बेलपत्र (Belpatra)" });
    await page.getByRole("button", { name: /Book Now/ }).click();
    // one assertion on the full toast — sonner toasts unmount after ~4s
    await expect(page.getByText(/धन्यवाद रामप्रसाद!.*स्मृति वृक्षारोपण अनुरोध स्वीकार/)).toBeVisible();
    await expect(page.getByText(/आपका सहयोग दर्ज हो गया है, रामप्रसाद।/)).toBeVisible();
  });

  test("TC-GS-02 empty donor defaults to श्रद्धालु", async ({ page }) => {
    await page.goto("/gau-seva");
    await page.getByRole("button", { name: /Book Now/ }).click();
    await expect(page.getByText(/धन्यवाद श्रद्धालु!/)).toBeVisible();
  });

  test("F3 chara seva ₹510 and ₹2100 tiers succeed", async ({ page }) => {
    await page.goto("/gau-seva");
    await page.getByRole("button", { name: /1 दिन का हरा चारा दान/ }).click();
    await expect(page.getByText("1 दिन का हरा चारा दान (₹510) हेतु आपका सहयोग सफलतापूर्वक प्राप्त हो गया है।")).toBeVisible();
    await page.getByRole("button", { name: /गोवंश गोद लें/ }).click();
    await expect(page.getByText("गोवंश गोद लें (Monthly Adoption) (₹2100) हेतु आपका सहयोग सफलतापूर्वक प्राप्त हो गया है।")).toBeVisible();
  });

  test("TC-GS-05 लाइव गौ-दर्शन opens LiveGauModal with LIVE FEED", async ({ page }) => {
    await page.goto("/gau-seva");
    await page.getByText(/लाइव गौ-दर्शन/).click();
    await expect(page.getByText("श्री निरंजनी गौशाला लाइव कैमरा")).toBeVisible();
    await expect(page.getByText("● LIVE FEED")).toBeVisible();
  });
});

/* ---------------- F4 जप माला ---------------- */

test.describe("F4 jap mala", () => {
  // The counter syncs optimistically: arm a POST /api/mala listener BEFORE the
  // click and await its response, otherwise a reload's GET can read the server
  // before the tap/reset commits (observed as count+1 after reload).
  const malaPost = (page: import("@playwright/test").Page) =>
    page
      .waitForResponse(
        (r) => r.url().includes("/api/mala") && r.request().method() === "POST",
        { timeout: 5000 }
      )
      .catch(() => undefined);

  test("tap ×5 → refresh → 5 → reset(accept) → 0 (TC-ML-01..03)", async ({ page }) => {
    await page.goto("/granth");
    const counter = page.locator("div.text-3xl.tabular-nums");
    const tap = page.getByRole("button", { name: "मंत्र जप करें (+1)" });

    // isolate from any state left by earlier runs/retries (counter persists per day)
    armDialog(page, "accept");
    let sync = malaPost(page);
    await page.getByRole("button", { name: "रीसेट" }).click();
    await sync;
    await expect(counter).toHaveText("0");
    await page.reload();
    await expect(counter).toHaveText("0"); // reset persisted

    for (let i = 0; i < 5; i++) {
      sync = malaPost(page);
      await tap.click();
      await sync;
    }
    await expect(counter).toHaveText("5");

    await page.reload();
    await expect(counter).toHaveText("5"); // persisted by day (TC-ML-02)

    armDialog(page, "accept"); // "क्या आप वाकई काउंट रीसेट करना चाहते हैं?"
    sync = malaPost(page);
    await page.getByRole("button", { name: "रीसेट" }).click();
    await expect(counter).toHaveText("0");
    await sync;

    await page.reload();
    await expect(counter).toHaveText("0"); // reset persisted
  });

  test("TC-ML-04 reset → cancel keeps count", async ({ page }) => {
    await page.goto("/granth");
    const counter = page.locator("div.text-3xl.tabular-nums");
    const tap = page.getByRole("button", { name: "मंत्र जप करें (+1)" });

    // isolate: clean slate regardless of earlier test state
    armDialog(page, "accept");
    await page.getByRole("button", { name: "रीसेट" }).click();
    await expect(counter).toHaveText("0");

    await tap.click();
    await tap.click();
    await expect(counter).toHaveText("2");

    armDialog(page, "dismiss");
    await page.getByRole("button", { name: "रीसेट" }).click();
    await expect(counter).toHaveText("2");
  });

  test("TC-GR-01/02 Gita: 18 chapters listed; verse + meaning render", async ({ page }) => {
    await page.goto("/granth");
    const chapterLinks = page.getByRole("link", { name: "पढ़ें" });
    await expect(chapterLinks).toHaveCount(18);

    await page.goto("/granth?chapter=2");
    await expect(page.getByText("अध्याय 2: सांख्य योग")).toBeVisible();
    await expect(page.getByText(/सञ्जय उवाच/)).toBeVisible();
    await expect(page.getByText(/अर्थ:/)).toBeVisible();
    // no tofu boxes
    const body = await page.locator("main").innerText();
    expect(body).not.toContain("□");
    expect(body).not.toContain("\uFFFD");
  });
});

/* ---------------- F5 AI जिज्ञासा ---------------- */

test.describe("F5 AI chat", () => {
  test("TC-AI-01/02 intro + disclaimer + ask flow", async ({ page }) => {
    // chat entry stays on the जिज्ञासा page (removed from the landing grid)
    await page.goto("/jigyasu");
    await page.getByRole("button", { name: /अपना नया प्रश्न पूछें/ }).click();
    await expect(page.getByText("AI आध्यात्मिक सहायक")).toBeVisible();
    await expect(page.getByText(/नमस्ते! मैं सनातन संस्कृति/)).toBeVisible();
    // guru disclaimer always visible in intro bubble (PRD M5)
    await expect(page.getByText(/बड़े निर्णय हेतु अपने गुरु\/आचार्य से परामर्श अवश्य लें/)).toBeVisible();

    await page.getByLabel("अपना प्रश्न लिखें").fill("महाकुंभ में स्नान का महत्व क्या है?");
    await page.getByLabel("प्रश्न भेजें").click();
    await expect(page.getByText("उत्तर लिखा जा रहा है…")).toBeVisible(); // typing state
    // either a Hindi assistant reply or a respectful offline error (TC-AI-04 tolerant)
    await expect(async () => {
      const bubbles = await page.locator(".bg-indigo-50.text-indigo-900").allInnerTexts();
      const toast = await page.getByText(/AI सेवा इस समय उपलब्ध नहीं है/).count();
      expect(bubbles.length > 1 || toast > 0).toBe(true);
    }).toPass({ timeout: 20_000 });
  });

  test("TC-AI-03 non-dharmic question → refusal dialog stays usable", async ({ page }) => {
    await page.goto("/jigyasu");
    await page.getByRole("button", { name: /अपना नया प्रश्न पूछें/ }).click();
    await page.getByLabel("अपना प्रश्न लिखें").fill("मुझे HTML कोडिंग में मदद चाहिए");
    await page.getByLabel("प्रश्न भेजें").click();
    // assistant bubble should politely steer back OR offline error; UI stays usable
    await expect(async () => {
      const bubbles = await page.locator(".bg-indigo-50.text-indigo-900").allInnerTexts();
      const toast = await page.getByText(/AI सेवा इस समय उपलब्ध नहीं है/).count();
      expect(bubbles.length > 1 || toast > 0).toBe(true);
    }).toPass({ timeout: 20_000 });
  });

  test("TC-FO-01 forum feed shows seeded पेशवाई Q&A", async ({ page }) => {
    await page.goto("/jigyasu");
    await expect(page.getByText(/पेशवाई का क्या महत्व है/)).toBeVisible();
    await expect(page.getByText(/पेशवाई सनातन संस्कृति के वैभव/)).toBeVisible();
    await expect(page.getByText("प्रश्न").first()).toBeVisible();
  });
});

/* ---------------- F6 स्टोर ---------------- */

test.describe("F6 store", () => {
  const gangajal = (page: Page) => page.locator("div.rounded-2xl").filter({ hasText: "गंगो जल" });
  const rudraksh = (page: Page) => page.locator("div.rounded-2xl").filter({ hasText: "रुद्राक्ष माला" });

  test.beforeEach(async ({ page }) => {
    await clearCart(page); // cart persists server-side — isolate each store case
  });

  test("TC-ST-01 grid shows 6 products with प्रमाणित badges", async ({ page }) => {
    await page.goto("/store");
    await expect(page.getByText("पवित्र गंगो जल (1 लीटर)")).toBeVisible();
    await expect(page.getByText("पाँच मुखी रुद्राक्ष माला")).toBeVisible();
    const cards = page.locator("div.rounded-2xl").filter({ has: page.getByRole("button", { name: "कार्ट में जोड़ें" }) });
    await expect(cards).toHaveCount(6);
  });

  test("TC-ST-02/06 add both → badge 2 → survives reload → total ₹502", async ({ page }) => {
    await page.goto("/store");
    await gangajal(page).getByRole("button", { name: "कार्ट में जोड़ें" }).click();
    await expect(page.getByText("पवित्र गंगो जल (1 लीटर) आपके कार्ट में जोड़ दिया गया है!")).toBeVisible();
    await rudraksh(page).getByRole("button", { name: "कार्ट में जोड़ें" }).click();

    const badge = page.locator("header").getByText("2", { exact: true }).first();
    await expect(badge).toBeVisible();

    await page.reload(); // cart survives refresh (server-persisted)
    await page.getByRole("button", { name: "कार्ट खोलें" }).click();
    await expect(page.getByText("कुल राशि")).toBeVisible();
    await expect(page.locator("span.text-saffron").filter({ hasText: "₹502" })).toBeVisible();
  });

  test("TC-ST-03/04/05 qty edit, empty checkout blocked, valid checkout → mock PAID", async ({ page }) => {
    await page.goto("/store");
    await gangajal(page).getByRole("button", { name: "कार्ट में जोड़ें" }).click();
    await rudraksh(page).getByRole("button", { name: "कार्ट में जोड़ें" }).click();
    await page.getByRole("button", { name: "कार्ट खोलें" }).click();

    // scope to the गंगो जल line — cart ordering is not guaranteed, never use .first()
    const cartDialog = page.getByRole("dialog", { name: "आपका कार्ट" });
    const gangajalLine = cartDialog.locator("div.rounded-xl").filter({ hasText: "पवित्र गंगो जल" }).first();
    const gangajalPlus = gangajalLine.getByRole("button", { name: "मात्रा बढ़ाएँ" });
    const gangajalMinus = gangajalLine.getByRole("button", { name: "मात्रा घटाएँ" });

    // qty + → recomputed total 151×2+351 = ₹653 (exact-match totals: line items/math strings excluded)
    await gangajalPlus.click();
    await expect(page.getByText("₹653", { exact: true })).toBeVisible();
    // qty − removes extra, back to 502
    await gangajalMinus.click();
    await expect(page.getByText("₹502", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: /ऑर्डर करें/ }).click();
    // blocked without name/phone
    await page.getByRole("button", { name: /ऑर्डर पुष्ट करें/ }).click();
    await expect(page.getByText("कृपया अपना नाम और मोबाइल नंबर लिखें।")).toBeVisible();

    await page.getByLabel("आपका नाम").fill("सुनीता देवी");
    await page.getByLabel("मोबाइल नंबर").fill("9123456780");
    await page.getByRole("button", { name: /ऑर्डर पुष्ट करें/ }).click();
    await expect(page.getByRole("heading", { name: "ऑर्डर सफल" })).toBeVisible(); // success dialog (toast text also contains "ऑर्डर सफल…" — heading avoids the strict-mode clash)
    await expect(page.getByText(/आपका ऑर्डर #/)).toBeVisible();
    await expect(page.getByText(/अखाड़ा सेवा दल शीघ्र संपर्क करेगा/)).toBeVisible();

    await page.getByRole("button", { name: "ठीक है" }).click();
    await page.getByRole("button", { name: "कार्ट खोलें" }).click();
    await expect(page.getByText("आपका कार्ट खाली है।")).toBeVisible(); // cart cleared
  });
});

/* ---------------- F7 directory + memorial ---------------- */

test.describe("F7 directory", () => {
  test("F7 अखाड़ा सूची → search महामंडलेश्वर → स्मृति खंड → GoldenBaba", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /अखाड़ा सूची/ }).click();
    await expect(page.getByText("पदाधिकारी सूची")).toBeVisible();

    const search = page.getByLabel("पदाधिकारी खोजें");
    await search.fill("महामंडलेश्वर");
    // Verified directory (lib/data/sadhus.ts) — living Golden Baba + Acharya Kailashanand Giri
    await expect(page.getByText(/गोल्डन बाबा/).first()).toBeVisible();
    await expect(page.getByText(/कैलाशानंद गिरि/).first()).toBeVisible();
    await expect(page.getByText("पद: महामंडलेश्वर — श्री पंचायती अखाड़ा निरंजनी")).toBeVisible();

    await page.getByRole("button", { name: "श्रद्धेय गोल्डन बाबा — जीवन गाथा देखें" }).click();
    const babaDialog = page.locator('[role="dialog"]').filter({ hasText: "गोल्डन बाबा" });
    // modal-only content (home card behind the overlay must not match)
    await expect(babaDialog.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(babaDialog.getByText(/4 किलोग्राम स्वर्ण आभूषण/)).toBeVisible();
    await expect(babaDialog.getByText(/मूल निवास:/)).toBeVisible(); // केरल origin
  });

  test("TC-DR-02 gibberish search shows Hindi empty state", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /अखाड़ा सूची/ }).click();
    await page.getByLabel("पदाधिकारी खोजें").fill("जादूगर");
    await expect(page.getByText("कोई पदाधिकारी नहीं मिला।")).toBeVisible();
  });
});

/* ---------------- F8 volunteer ---------------- */

test.describe("F8 volunteer", () => {
  test("TC-VL-01 guest volunteer modal → login-required CTA (Day 3: no anonymous form)", async ({ page }) => {
    await page.goto("/menu");
    await page.getByRole("button", { name: /सेवा दल \(स्वयंसेवक\) पंजीकरण/ }).click();
    await expect(page.getByText("सेवा दल पास खाते से जुड़ता है — पहले लॉग इन करें।")).toBeVisible();
    const loginLink = page.getByRole("link", { name: /लॉग इन/ }).last();
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute("href", /next=%2Fmenu/);
  });

  test("TC-VL-02 logged-in: account-name note + WhatsApp-only submit → पास toast", async ({ page, request }) => {
    const email = `e2e-vol-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}@example.com`;
    const created = await request.post("/api/auth/register", {
      data: { name: "अर्जुन सिंह", email, password: "e2ePassword123" },
    });
    expect(created.status()).toBe(201);

    await page.goto("/login");
    await page.getByLabel("ईमेल पता").fill(email);
    await page.getByLabel("पासवर्ड").fill("e2ePassword123");
    await page.getByRole("button", { name: "लॉग इन" }).click();
    await expect(page).toHaveURL(/\/profile/);

    await page.goto("/menu");
    await page.getByRole("button", { name: /सेवा दल \(स्वयंसेवक\) पंजीकरण/ }).click();
    await expect(page.getByText(/पास आपके खाते के नाम .अर्जुन सिंह. से जारी होगा/)).toBeVisible();
    await page.locator("#vol-wa").fill("123");
    await page.getByRole("button", { name: "सेवा दल पास प्राप्त करें" }).click();
    await expect(page.getByText(/कृपया 10 अंकों का मोबाइल नंबर लिखें/)).toBeVisible();

    await page.locator("#vol-wa").fill("9112345678");
    await page.getByRole("button", { name: "सेवा दल पास प्राप्त करें" }).click();
    await expect(page.getByText("सेवा दल पास जारी करने की प्रक्रिया प्रारंभ हो गई है। धन्यवाद!")).toBeVisible();
  });
});

/* ---------------- F9 notifications ---------------- */

test.describe("F9 notifications", () => {
  test("badge 3 → open list → badge clears, items persist", async ({ page }) => {
    await page.goto("/");

    const bell = page.getByRole("button", { name: "सूचनाएँ" });
    await expect(bell).toBeVisible();
    const badge = bell.locator("span");
    await expect(badge).toHaveText("3");

    await bell.click();
    await expect(page.getByText("सूचनाएँ एवं शुभ मुहूर्त अलर्ट")).toBeVisible();
    await expect(page.getByText("एकादशी विशेष व्रत कथा")).toBeVisible();
    await expect(page.getByText("आज का पंचांग उपलब्ध")).toBeVisible();
    await expect(page.getByText("गौ सेवा सूचना")).toBeVisible();

    await page.getByRole("button", { name: "ठीक है" }).click();
    await expect(page.getByText("सूचनाएँ एवं शुभ मुहूर्त अलर्ट")).toBeHidden();
    await expect(bell.locator("span")).toHaveCount(0); // badge cleared (marked read)

    // TC-NT-02 reopen — items remain, badge stays 0
    await bell.click();
    await expect(page.getByText("एकादशी विशेष व्रत कथा")).toBeVisible();
    await expect(bell.locator("span")).toHaveCount(0);
    await page.getByRole("button", { name: "ठीक है" }).click();
  });
});

/* ---------------- menu / digital ID / certificate (TC-MN-01, TC-CE-01) ---------------- */

test.describe("menu", () => {
  test("TC-MN-01 menu: session-aware account card, digital ID (SN-2027-9842 + QR), directory, volunteer, cert, bookings", async ({ page }) => {
    await page.goto("/menu");
    // Logged-out visitors get a real login/register invitation — never a fake identity.
    await expect(page.getByRole("heading", { name: "मेरी प्रोफ़ाइल" })).toBeVisible();
    await expect(page.getByRole("link", { name: "लॉग इन" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "पंजीकरण" }).first()).toBeVisible();
    await expect(page.getByText(/SN-2027-9842/).first()).toBeVisible();
    await expect(page.getByText("क्यूआर सत्यापित")).toBeVisible();
    const qrSvg = page.getByLabel("भक्त आईडी क्यूआर कोड");
    await expect(qrSvg).toBeVisible(); // QR placeholder requirement
    await expect(page.getByRole("button", { name: /पदाधिकारी सूची/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /सेवा दल \(स्वयंसेवक\) पंजीकरण/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /संकल्प ई-सर्टिफिकेट डाउनलोड करें/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /मेरी बुकिंग/ })).toBeVisible();
  });

  test("TC-CE-01 sankalp certificate view renders name + ID", async ({ page }) => {
    await page.goto("/menu");
    await page.getByRole("button", { name: /संकल्प ई-सर्टिफिकेट डाउनलोड करें/ }).click();
    await expect(page.getByText(/SN-2027-9842/).first()).toBeVisible();
  });
});

/* ---------------- F-kumbh (TC-KB-01..03) ---------------- */

test.describe("kumbh 2027", () => {
  test("countdown positive + dates from DB + standalone deep link", async ({ page }) => {
    await page.goto("/kumbh-2027");
    await expect(page.getByText("महाकुंभ 2027 नेविगेटर")).toBeVisible();
    await expect(page.getByText("प्रथम शाही स्नान (मकर संक्रांति)")).toBeVisible();
    await expect(page.getByText("द्वितीय शाही स्नान (वसंत पंचमी)")).toBeVisible();
    await expect(page.getByText("अखाड़ा छावनी स्थान")).toBeVisible();
    await expect(page.getByText("पेशवाई मार्ग सूचना")).toBeVisible();

    // countdown number — clean digits, never NaN/undefined/negative (TC-KB-02)
    const daysText = await page.locator("p.text-3xl.tabular-nums").first().innerText();
    expect(daysText.trim()).toMatch(/^\d+$/);

    // standalone render (deep-link safe) — already a direct URL visit
    await page.reload();
    await expect(page.getByText("शाही स्नान तिथियाँ")).toBeVisible();
  });
});
