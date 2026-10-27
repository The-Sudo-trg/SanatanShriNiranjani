// @vitest-environment node
//
// Day 1 auth contract — route-level integration tests against a real throwaway
// SQLite database (prisma/test.db, provisioned by tests/unit/setup/global-setup.ts).
// Nothing is mocked: handlers, Prisma, scrypt and the JWT code all run for real.
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

import { POST as registerRoute } from "@/app/api/auth/register/route";
import { POST as loginRoute } from "@/app/api/auth/login/route";
import { POST as logoutRoute } from "@/app/api/auth/logout/route";
import { GET as meRoute } from "@/app/api/auth/me/route";
import { POST as feedbackRoute } from "@/app/api/feedback/route";
import {
  DUMMY_PASSWORD_HASH,
  SESSION_COOKIE,
  createSessionToken,
  hashPassword,
  requireRole,
  signJwt,
  verifyJwt,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/db";

const BASE_URL = "http://localhost:3000";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem?: number }
) => Promise<Buffer>;

interface ErrorBody {
  error: string;
}
interface UserBody {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    sadhuVerified: boolean;
    createdAt: string;
  };
}

const BHAKT = {
  name: "राम भक्त",
  email: "bhakt@example.com",
  password: "अच्छापासवर्ड123",
};

function jsonRequest(path: string, body: unknown, cookie?: string): Request {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (cookie) headers.cookie = cookie;
  return new Request(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

function getRequest(path: string, cookie?: string): Request {
  return new Request(`${BASE_URL}${path}`, {
    headers: cookie ? { cookie } : undefined,
  });
}

function sessionCookieHeaderOf(res: Response): string {
  const setCookies = res.headers.getSetCookie();
  const session = setCookies.find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));
  if (!session) throw new Error(`No ${SESSION_COOKIE} cookie on response: ${setCookies.join(" | ")}`);
  return session;
}

function sessionTokenOf(res: Response): string {
  const firstPair = sessionCookieHeaderOf(res).split(";")[0];
  return decodeURIComponent(firstPair.slice(SESSION_COOKIE.length + 1));
}

function sessionCookieOf(res: Response): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(sessionTokenOf(res))}`;
}

async function register(overrides: Record<string, unknown> = {}) {
  return registerRoute(jsonRequest("/api/auth/register", { ...BHAKT, ...overrides }));
}

beforeEach(async () => {
  // Isolated per test: users cascade their relations (SetNull / Cascade), feedback is standalone.
  await prisma.user.deleteMany();
  await prisma.feedback.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ---------------------------------------------------------------------------
// #1–#4 Registration
// ---------------------------------------------------------------------------
describe("POST /api/auth/register", () => {
  it("#1 registers a valid भक्त: 201, USER row with scrypt hash, session cookie", async () => {
    const res = await register();
    expect(res.status).toBe(201);

    const body = (await res.json()) as UserBody;
    expect(body.user.email).toBe(BHAKT.email);
    expect(body.user.role).toBe("USER");
    expect(body.user.sadhuVerified).toBe(false);
    // The password hash must never leave the server.
    expect(JSON.stringify(body)).not.toContain("passwordHash");
    expect(JSON.stringify(body)).not.toContain(BHAKT.password);

    const row = await prisma.user.findUnique({ where: { email: BHAKT.email } });
    expect(row).not.toBeNull();
    expect(row?.role).toBe("USER");
    expect(row?.passwordHash).not.toBe(BHAKT.password);
    expect(row?.passwordHash.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword(BHAKT.password, row?.passwordHash)).toBe(true);

    const cookie = sessionCookieHeaderOf(res);
    expect(cookie.startsWith(`${SESSION_COOKIE}=`)).toBe(true);
    expect(cookie.startsWith("__Host-sn_session=")).toBe(true);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("Max-Age=604800");
    expect(cookie).toContain("Path=/");

    const claims = verifyJwt(sessionTokenOf(res));
    expect(claims?.sub).toBe(row?.id);
    expect(claims?.role).toBe("USER");
  });

  it("#2 rejects a duplicate email with 409 + Hindi message", async () => {
    await register();
    const res = await register({ name: "दूसरा भक्त" });
    expect(res.status).toBe(409);
    const body = (await res.json()) as ErrorBody;
    expect(body.error).toContain("पहले से पंजीकृत");
    expect(await prisma.user.count({ where: { email: BHAKT.email } })).toBe(1);
  });

  it("#2b treats email case-insensitively (no duplicate via uppercase)", async () => {
    await register();
    const res = await register({ email: BHAKT.email.toUpperCase() });
    expect(res.status).toBe(409);
    expect(await prisma.user.count()).toBe(1);
  });

  it("#3 rejects a weak password with 400 + Hindi message and creates no row", async () => {
    const res = await register({ email: "weak@example.com", password: "short" });
    expect(res.status).toBe(400);
    const body = (await res.json()) as ErrorBody;
    expect(body.error).toContain("पासवर्ड");
    expect(await prisma.user.count({ where: { email: "weak@example.com" } })).toBe(0);
  });

  it("#3b rejects a missing password with a Hindi message (not English Zod default)", async () => {
    const res = await register({ email: "missing@example.com", password: undefined });
    expect(res.status).toBe(400);
    const body = (await res.json()) as ErrorBody;
    expect(body.error).toContain("पासवर्ड");
    expect(await prisma.user.count({ where: { email: "missing@example.com" } })).toBe(0);
  });

  it("#3c rejects invalid email / missing name in Hindi", async () => {
    const badEmail = await register({ email: "not-an-email" });
    expect(badEmail.status).toBe(400);
    expect(((await badEmail.json()) as ErrorBody).error).toContain("ईमेल");

    const missingName = await register({ name: undefined });
    expect(missingName.status).toBe(400);
    expect(((await missingName.json()) as ErrorBody).error).toContain("नाम");
  });

  it("#4 registers a SADHU unverified: role=SADHU, sadhuVerified=false", async () => {
    const res = await register({ email: "sadhu@example.com", name: "संत जी", role: "SADHU" });
    expect(res.status).toBe(201);
    const body = (await res.json()) as UserBody;
    expect(body.user.role).toBe("SADHU");
    expect(body.user.sadhuVerified).toBe(false);

    const row = await prisma.user.findUnique({ where: { email: "sadhu@example.com" } });
    expect(row?.role).toBe("SADHU");
    expect(row?.sadhuVerified).toBe(false);
  });

  it("#4b refuses self-assignment of the privileged ADMIN role", async () => {
    const res = await register({ email: "admin@example.com", role: "ADMIN" });
    expect(res.status).toBe(400);
    expect(((await res.json()) as ErrorBody).error).toContain("भूमिका");
    expect(await prisma.user.count()).toBe(0);
  });

  it("#4b2 registers a VOLUNTEER (स्वयंसेवक) account", async () => {
    const res = await register({ email: "sevak@example.com", role: "VOLUNTEER" });
    expect(res.status).toBe(201);
    const body = (await res.json()) as UserBody;
    expect(body.user.role).toBe("VOLUNTEER");
    const row = await prisma.user.findUnique({ where: { email: "sevak@example.com" } });
    expect(row?.role).toBe("VOLUNTEER");
  });

  it("#4c stores an empty optional phone as NULL and rejects a bad phone in Hindi", async () => {
    const ok = await register({ email: "nophone@example.com", phone: "" });
    expect(ok.status).toBe(201);
    const row = await prisma.user.findUnique({ where: { email: "nophone@example.com" } });
    expect(row?.phone).toBeNull();

    const bad = await register({ email: "badphone@example.com", phone: "12345" });
    expect(bad.status).toBe(400);
    expect(((await bad.json()) as ErrorBody).error).toContain("मोबाइल");
  });

  it("#4d rejects malformed / non-object bodies with a Hindi message (not English Zod text)", async () => {
    const malformed = new Request(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not json",
    });
    const malformedRes = await registerRoute(malformed);
    expect(malformedRes.status).toBe(400);
    expect(((await malformedRes.json()) as ErrorBody).error).toBe("अमान्य अनुरोध।");

    const nonObject = await registerRoute(jsonRequest("/api/auth/register", null));
    expect(nonObject.status).toBe(400);
    expect(((await nonObject.json()) as ErrorBody).error).toMatch(/[\u0900-\u097F]/);
  });

  it("#4e ignores privilege fields sent in the body (role / sadhuVerified are not trusted)", async () => {
    const res = await register({ email: "inject@example.com", role: "USER", sadhuVerified: true });
    expect(res.status).toBe(201);
    const row = await prisma.user.findUnique({ where: { email: "inject@example.com" } });
    expect(row?.role).toBe("USER");
    expect(row?.sadhuVerified).toBe(false);
  });

  it("#4f rejects oversized bodies with 413 (bounded read before parsing)", async () => {
    const res = await register({ email: "huge@example.com", name: "क".repeat(9000) });
    expect(res.status).toBe(413);
    expect(((await res.json()) as ErrorBody).error).toContain("बड़ा");
  });
});

// ---------------------------------------------------------------------------
// #5–#7 Login
// ---------------------------------------------------------------------------
describe("POST /api/auth/login", () => {
  it("#5 logs in with the correct password: 200 + a valid session cookie", async () => {
    await register();
    const res = await loginRoute(
      jsonRequest("/api/auth/login", { email: BHAKT.email, password: BHAKT.password })
    );
    expect(res.status).toBe(200);

    const body = (await res.json()) as UserBody;
    expect(body.user.email).toBe(BHAKT.email);
    expect(JSON.stringify(body)).not.toContain("passwordHash");

    const claims = verifyJwt(sessionTokenOf(res));
    const row = await prisma.user.findUnique({ where: { email: BHAKT.email } });
    expect(claims?.sub).toBe(row?.id);
    expect(sessionCookieHeaderOf(res)).toContain("HttpOnly");
  });

  it("#5b accepts an email in any case (normalisation round-trip)", async () => {
    await register();
    const res = await loginRoute(
      jsonRequest("/api/auth/login", { email: "  BHAKT@Example.COM ", password: BHAKT.password })
    );
    expect(res.status).toBe(200);
  });

  it("#6 wrong password: generic 401 Hindi message, no crash in timing-safe compare", async () => {
    await register();
    const res = await loginRoute(
      jsonRequest("/api/auth/login", { email: BHAKT.email, password: "गलतपासवर्ड123" })
    );
    expect(res.status).toBe(401);
    expect(((await res.json()) as ErrorBody).error).toBe("ईमेल या पासवर्ड गलत है।");
    expect(res.headers.getSetCookie().some((c) => c.startsWith(`${SESSION_COOKIE}=`))).toBe(false);

    // verifyPassword must fail closed (never throw) on malformed stored hashes.
    expect(await verifyPassword("anything", "not-a-hash")).toBe(false);
    expect(await verifyPassword("anything", "scrypt$1$2$3$zz$zz")).toBe(false);
    expect(await verifyPassword("anything", null)).toBe(false);
    expect(await verifyPassword("anything", DUMMY_PASSWORD_HASH)).toBe(false);
  });

  it("#7 unknown email: identical status + message to #6 (no user enumeration)", async () => {
    await register();
    const unknown = await loginRoute(
      jsonRequest("/api/auth/login", { email: "nobody@example.com", password: BHAKT.password })
    );
    const wrongPassword = await loginRoute(
      jsonRequest("/api/auth/login", { email: BHAKT.email, password: "गलतपासवर्ड123" })
    );

    expect(unknown.status).toBe(wrongPassword.status);
    expect(unknown.status).toBe(401);
    const unknownBody = (await unknown.json()) as ErrorBody;
    const wrongBody = (await wrongPassword.json()) as ErrorBody;
    expect(unknownBody.error).toBe(wrongBody.error);
    expect(unknownBody.error).toBe("ईमेल या पासवर्ड गलत है।");
  });
});

// ---------------------------------------------------------------------------
// #8–#10 /api/auth/me
// ---------------------------------------------------------------------------
describe("GET /api/auth/me", () => {
  it("#8 returns the current user without passwordHash when the cookie is valid", async () => {
    const registered = await register();
    const cookie = sessionCookieOf(registered);

    const res = await meRoute(getRequest("/api/auth/me", cookie));
    expect(res.status).toBe(200);
    const body = (await res.json()) as UserBody;
    expect(body.user.email).toBe(BHAKT.email);
    expect(body.user.role).toBe("USER");
    expect(body).not.toHaveProperty("passwordHash");
    expect(JSON.stringify(body)).not.toContain("passwordHash");
  });

  it("#8b marks auth responses as non-cacheable (private, no-store)", async () => {
    const registered = await register();
    const res = await meRoute(getRequest("/api/auth/me", sessionCookieOf(registered)));
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("vary")).toBe("Cookie");
  });

  it("#9 returns 401 without a cookie", async () => {
    const res = await meRoute(getRequest("/api/auth/me"));
    expect(res.status).toBe(401);
    expect(((await res.json()) as ErrorBody).error).toContain("लॉग इन");
  });

  it("#10 returns 401 for a tampered JWT", async () => {
    const registered = await register();
    const token = sessionTokenOf(registered);
    const [header, payload, signature] = token.split(".");
    const flipped = signature.slice(0, -1) + (signature.endsWith("A") ? "B" : "A");

    const tamperedSignature = await meRoute(
      getRequest("/api/auth/me", `${SESSION_COOKIE}=${header}.${payload}.${flipped}`)
    );
    expect(tamperedSignature.status).toBe(401);

    const tamperedPayload = `${header}.${payload.slice(0, -2)}xx.${signature}`;
    const tamperedPayloadRes = await meRoute(
      getRequest("/api/auth/me", `${SESSION_COOKIE}=${tamperedPayload}`)
    );
    expect(tamperedPayloadRes.status).toBe(401);
  });

  it("#10b returns 401 for an expired JWT", async () => {
    const registered = await register();
    const { user } = (await registered.json()) as UserBody;
    const expired = signJwt({ sub: user.id, email: user.email, role: "USER" }, { expiresInSeconds: -60 });

    const res = await meRoute(getRequest("/api/auth/me", `${SESSION_COOKIE}=${expired}`));
    expect(res.status).toBe(401);
    expect(verifyJwt(expired)).toBeNull();
  });

  it("#10c returns 401 for a structurally invalid token", async () => {
    const res = await meRoute(getRequest("/api/auth/me", `${SESSION_COOKIE}=not.a.jwt`));
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// #11 requireRole guard
// ---------------------------------------------------------------------------
describe("requireRole", () => {
  it("#11 denies a USER on an ADMIN-only guard with 403", async () => {
    const registered = await register();
    const cookie = sessionCookieOf(registered);

    const guard = await requireRole("ADMIN", getRequest("/api/auth/me", cookie));
    expect(guard.ok).toBe(false);
    if (!guard.ok) {
      expect(guard.response.status).toBe(403);
      expect(((await guard.response.json()) as ErrorBody).error).toContain("अनुमति");
    }
  });

  it("#11b allows the matching role and rejects a missing session with 401", async () => {
    const registered = await register();
    const cookie = sessionCookieOf(registered);

    const allowed = await requireRole("USER", getRequest("/api/auth/me", cookie));
    expect(allowed.ok).toBe(true);
    if (allowed.ok) expect(allowed.user.email).toBe(BHAKT.email);

    const unauthenticated = await requireRole("ADMIN", getRequest("/api/auth/me"));
    expect(unauthenticated.ok).toBe(false);
    if (!unauthenticated.ok) expect(unauthenticated.response.status).toBe(401);
  });

  it("#11c allows a seeded ADMIN through an ADMIN guard", async () => {
    const admin = await prisma.user.create({
      data: {
        name: "प्रबंधक",
        email: "admin@test.local",
        passwordHash: await hashPassword("AdminPass123"),
        role: "ADMIN",
        sadhuVerified: true,
      },
    });
    const token = createSessionToken(admin);

    const guard = await requireRole("ADMIN", getRequest("/api/auth/me", `${SESSION_COOKIE}=${token}`));
    expect(guard.ok).toBe(true);
    if (guard.ok) expect(guard.user.role).toBe("ADMIN");
  });
  it("#11d accepts a list of accepted roles", async () => {
    const registered = await register();
    const guard = await requireRole(
      ["ADMIN", "VOLUNTEER"],
      getRequest("/api/auth/me", sessionCookieOf(registered))
    );
    expect(guard.ok).toBe(false);
    if (!guard.ok) expect(guard.response.status).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// #12 Logout
// ---------------------------------------------------------------------------
describe("POST /api/auth/logout", () => {
  it("#12 clears the session cookie and /api/auth/me becomes 401", async () => {
    const registered = await register();
    const cookie = sessionCookieOf(registered);
    expect((await meRoute(getRequest("/api/auth/me", cookie))).status).toBe(200);

    const logoutRes = await logoutRoute();
    expect(logoutRes.status).toBe(200);

    const cleared = sessionCookieHeaderOf(logoutRes);
    expect(cleared).toContain("Max-Age=0");
    expect(cleared).toContain("Expires=Thu, 01 Jan 1970");
    expect(cleared).toContain("HttpOnly");
    expect(cleared.split(";")[0]).toBe(`${SESSION_COOKIE}=`);

    // A browser that applied the cleared cookie sends an empty session value…
    expect((await meRoute(getRequest("/api/auth/me", `${SESSION_COOKIE}=`))).status).toBe(401);
    // …and after dropping it entirely the request is unauthenticated too.
    expect((await meRoute(getRequest("/api/auth/me"))).status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// /api/feedback (Day 8 pre-wiring)
// ---------------------------------------------------------------------------
describe("POST /api/feedback", () => {
  it("stores a feedback row and returns 201", async () => {
    const res = await feedbackRoute(
      jsonRequest("/api/feedback", {
        name: "भक्त",
        email: "Seva@Example.com",
        message: "मंदिर की जानकारी बहुत उपयोगी है।",
        templeSlug: "shri-niranjani-akhara",
      })
    );
    expect(res.status).toBe(201);

    const row = await prisma.feedback.findFirst();
    expect(row).not.toBeNull();
    expect(row?.name).toBe("भक्त");
    expect(row?.email).toBe("seva@example.com");
    expect(row?.message).toContain("उपयोगी");
    expect(row?.templeSlug).toBe("shri-niranjani-akhara");
  });

  it("stores optional blanks as NULL and rejects a too-short message in Hindi", async () => {
    const ok = await feedbackRoute(
      jsonRequest("/api/feedback", { name: "", email: "", message: "बहुत अच्छा अनुभव रहा" })
    );
    expect(ok.status).toBe(201);
    const row = await prisma.feedback.findFirst();
    expect(row?.name).toBeNull();
    expect(row?.email).toBeNull();

    const invalid = await feedbackRoute(jsonRequest("/api/feedback", { message: "ok" }));
    expect(invalid.status).toBe(400);
    expect(((await invalid.json()) as ErrorBody).error).toContain("संदेश");
    expect(await prisma.feedback.count()).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Primitive contract: hashing + JWT
// ---------------------------------------------------------------------------
describe("lib/auth primitives", () => {
  it("hashPassword salts every hash and verifyPassword is timing-safe", async () => {
    const a = await hashPassword("एकहीपासवर्ड");
    const b = await hashPassword("एकहीपासवर्ड");
    expect(a).not.toBe(b); // random salt
    expect(await verifyPassword("एकहीपासवर्ड", a)).toBe(true);
    expect(await verifyPassword("दूसरापासवर्ड", a)).toBe(false);
  });

  it("signJwt/verifyJwt round-trip with exp = 7 days", () => {
    const now = Math.floor(Date.now() / 1000);
    const token = signJwt({ sub: "user-1", email: "a@b.com", role: "SADHU" });
    const claims = verifyJwt(token);
    expect(claims).not.toBeNull();
    expect(claims?.sub).toBe("user-1");
    expect(claims?.role).toBe("SADHU");
    expect(claims?.exp).toBeGreaterThanOrEqual(now + 7 * 24 * 60 * 60 - 5);
  });

  it("verifyJwt rejects tampering, expiry and garbage", () => {
    const token = signJwt({ sub: "user-1" });
    expect(verifyJwt(`${token}x`)).toBeNull();
    expect(verifyJwt("")).toBeNull();
    expect(verifyJwt("a.b.c")).toBeNull();
    expect(verifyJwt(signJwt({ sub: "user-1" }, { expiresInSeconds: -1 }))).toBeNull();
  });

  it("verifies hashes created with earlier scrypt cost parameters (no lockout on upgrade)", async () => {
    // The Day-1 v0 hashes used N=2^14; raising the cost must not invalidate them.
    const salt = randomBytes(16);
    const key = await scrypt("legacy-password", salt, 64, { N: 16384, r: 8, p: 1 });
    const legacy = `scrypt$16384$8$1$${salt.toString("hex")}$${key.toString("hex")}`;
    expect(await verifyPassword("legacy-password", legacy)).toBe(true);
    expect(await verifyPassword("wrong-password", legacy)).toBe(false);
  });
});
