import { expect, test } from "@playwright/test";

// Day-2 auth frontend (DEVELOPMENT_PLAN Day 2): register → profile → logout →
// login → profile, plus Hindi validation and generic-credential errors.
// Against the real API + real SQLite DB (Playwright webServer on :3100).

function uniqueEmail() {
  return `e2e-auth-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}@example.com`;
}

const PASSWORD = "e2ePassword123";

test.describe("auth frontend", () => {
  test("register → profile → logout → login → profile", async ({ page }) => {
    const email = uniqueEmail();

    await page.goto("/register");
    await page.getByLabel("पूरा नाम").fill("ई२ई भक्त");
    await page.getByLabel("ईमेल पता").fill(email);
    await page.getByLabel("पासवर्ड").fill(PASSWORD);
    await page.getByRole("radio", { name: /भक्त/ }).check();
    await page.getByRole("button", { name: "खाता बनाएँ" }).click();

    await expect(page).toHaveURL(/\/profile/);
    await expect(page.getByRole("heading", { name: "मेरी प्रोफ़ाइल" })).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
    await expect(page.getByText("भक्त", { exact: true }).first()).toBeVisible();

    // logout from the header (session cookie cleared) → home. The mobile
    // duplicate sits earlier in the DOM but is hidden at the desktop viewport,
    // so restrict to visible buttons.
    await page
      .getByRole("button", { name: "लॉग आउट" })
      .filter({ visible: true })
      .first()
      .click();
    await expect(page).toHaveURL(/\/$/);

    // protected route now redirects to login with a safe next path
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "लॉग इन करें" })).toBeVisible();

    await page.getByLabel("ईमेल पता").fill(email);
    await page.getByLabel("पासवर्ड").fill(PASSWORD);
    await page.getByRole("button", { name: "लॉग इन" }).click();

    await expect(page).toHaveURL(/\/profile/);
    // the name legitimately appears twice now (profile + डिजिटल परिचय पत्र)
    await expect(page.getByText("ई२ई भक्त").first()).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
  });

  test("register form shows Hindi validation errors client-side", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("button", { name: "खाता बनाएँ" }).click();

    await expect(page.getByText("कृपया अपना पूरा नाम लिखें।")).toBeVisible();
    await expect(page.getByText("कृपया सही ईमेल पता लिखें।")).toBeVisible();
    await expect(page.getByText("पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।")).toBeVisible();
  });

  test("login with wrong password shows the generic Hindi error", async ({ page, request }) => {
    const email = uniqueEmail();
    const created = await request.post("/api/auth/register", {
      data: { name: "गलत पासवर्ड भक्त", email, password: PASSWORD },
    });
    expect(created.status()).toBe(201);

    await page.goto("/login");
    await page.getByLabel("ईमेल पता").fill(email);
    await page.getByLabel("पासवर्ड").fill("wrong-password-123");
    await page.getByRole("button", { name: "लॉग इन" }).click();

    await expect(page.getByRole("alert").filter({ hasText: "ईमेल या पासवर्ड गलत है।" })).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("guest /profile redirects to /login and ?next is honoured after login", async ({
    page,
    request,
  }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login\?next=(%2F|\/)profile/);

    // A safe same-origin next target round-trips: the real login must land on
    // the requested page (/menu), not the /profile default.
    await page.goto("/login?next=%2Fmenu");
    await expect(page.getByRole("heading", { name: "लॉग इन करें" })).toBeVisible();

    const email = uniqueEmail();
    const created = await request.post("/api/auth/register", {
      data: { name: "अगला मंज़िल भक्त", email, password: PASSWORD },
    });
    expect(created.status()).toBe(201);

    await page.getByLabel("ईमेल पता").fill(email);
    await page.getByLabel("पासवर्ड").fill(PASSWORD);
    await page.getByRole("button", { name: "लॉग इन" }).click();

    await expect(page).toHaveURL(/\/menu/);
    // name renders twice on /menu (profile block + डिजिटल परिचय पत्र)
    await expect(page.getByText("अगला मंज़िल भक्त").first()).toBeVisible();
  });

  test("sadhu registration via the role picker shows सत्यापन लंबित on /profile", async ({
    page,
  }) => {
    const email = uniqueEmail();

    await page.goto("/register");
    await page.getByLabel("पूरा नाम").fill("ई२ई श्री स्वामी");
    await page.getByLabel("ईमेल पता").fill(email);
    await page.getByLabel("पासवर्ड").fill(PASSWORD);
    await page.getByRole("radio", { name: /संत/ }).check();

    // Choosing संत must surface the live "verification pending" note.
    await expect(page.getByText(/सत्यापन तक/)).toBeVisible();

    await page.getByRole("button", { name: "खाता बनाएँ" }).click();

    await expect(page).toHaveURL(/\/profile/);
    // "संत" legitimately matches multiple elements now (profile body + डिजिटल परिचय पत्र role badge)
    await expect(page.getByText("संत", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("सत्यापन लंबित")).toBeVisible();
  });

  test("volunteer registration via the role picker lands on /profile as स्वयंसेवक", async ({
    page,
  }) => {
    const email = uniqueEmail();

    await page.goto("/register");
    await page.getByLabel("पूरा नाम").fill("ई२ई सेवा स्वयंसेवक");
    await page.getByLabel("ईमेल पता").fill(email);
    await page.getByLabel("पासवर्ड").fill(PASSWORD);
    await page.getByRole("radio", { name: /स्वयंसेवक/ }).check();
    await page.getByRole("button", { name: "खाता बनाएँ" }).click();

    await expect(page).toHaveURL(/\/profile/);
    await expect(page.getByText("स्वयंसेवक", { exact: true }).first()).toBeVisible();
  });

  test("Day-3 roles: admin APIs 403 for USER, 401 for guests; volunteers POST is account-based", async ({
    request,
  }) => {
    const email = uniqueEmail();
    // Playwright's request fixture persists Set-Cookie like a browser — assert
    // the guest 401 BEFORE registering (register auto-stores the session).
    expect((await request.get("/api/admin/sadhus")).status()).toBe(401);

    const created = await request.post("/api/auth/register", {
      data: { name: "भूमिका परीक्षक", email, password: PASSWORD, role: "VOLUNTEER" },
    });
    expect(created.status()).toBe(201);
    const createdBody = (await created.json()) as { user: { id: string } };

    const login = await request.post("/api/auth/login", {
      data: { email, password: PASSWORD },
    });
    expect(login.status()).toBe(200);
    const cookie = (login.headers()["set-cookie"] ?? "").split(";")[0] ?? "";
    expect(cookie).toContain("__Host-sn_session");

    // wrong-role API access → 403 ( DEVELOPMENT_PLAN Day-3 "done when" )
    const deniedList = await request.get("/api/admin/sadhus", { headers: { cookie } });
    expect(deniedList.status()).toBe(403);
    const deniedPatch = await request.patch(`/api/admin/sadhus/${createdBody.user.id}`, {
      data: { sadhuVerified: true },
      headers: { cookie },
    });
    expect(deniedPatch.status()).toBe(403);

    // volunteers: pass request attaches to the account
    const vol = await request.post("/api/volunteers", {
      data: { whatsapp: "9112345678" },
      headers: { cookie },
    });
    expect(vol.status()).toBe(201);
    const volBody = (await vol.json()) as { volunteer: { userId: string | null; name: string } };
    expect(volBody.volunteer.userId).toBe(createdBody.user.id);
    expect(volBody.volunteer.name).toBe("भूमिका परीक्षक");
  });

  test("mobile header exposes logout (full auth flow on device)", async ({ page }) => {
    const email = uniqueEmail();
    // explicit device-flow viewport (TC-SH-01 tier)
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/register");
    await page.getByLabel("पूरा नाम").fill("ई२ई मोबाइल भक्त");
    await page.getByLabel("ईमेल पता").fill(email);
    await page.getByLabel("पासवर्ड").fill(PASSWORD);
    await page.getByRole("radio", { name: /भक्त/ }).check();
    await page.getByRole("button", { name: "खाता बनाएँ" }).click();
    await expect(page).toHaveURL(/\/profile/);

    // the mobile-only header logout button
    await page
      .getByRole("button", { name: "लॉग आउट" })
      .filter({ visible: true })
      .first()
      .click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("language toggle switches the auth chrome to English and persists via cookie", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "भाषा बदलें (English)" }).click();
    await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();

    // cookie persisted → still English after reload / direct navigation
    await page.reload();
    await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // switch back to Hindi
    await page.getByRole("button", { name: "Switch language (हिन्दी)" }).click();
    await expect(page.getByRole("heading", { name: "लॉग इन करें" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  });
});
