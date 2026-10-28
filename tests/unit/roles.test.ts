// @vitest-environment node
//
// Day 3 role routes — same contract style as auth.test.ts: real handlers,
// real Prisma (throwaway test.db), no mocks. ADMIN approval + account-based
// volunteers must deny wrong roles with typed Hindi 401/403s.
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { POST as volunteerPost } from "@/app/api/volunteers/route";
import { GET as sadhusGet } from "@/app/api/admin/sadhus/route";
import { PATCH as sadhuPatch } from "@/app/api/admin/sadhus/[id]/route";
import { SESSION_COOKIE, createSessionToken, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

const SUITE = `roles-${Date.now()}-`;
const PASSWORD = "भूमिकापासवर्ड123";

let bhakt: { id: string; email: string; role: string };
let sadhu: { id: string; email: string; role: string };
let admin: { id: string; email: string; role: string };

interface SessionUser {
  id: string;
  email: string;
  role: string;
}

function authed(
  method: "GET" | "PATCH" | "POST",
  path: string,
  session: SessionUser | null,
  body?: unknown
): Request {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (session) {
    headers.cookie = `${SESSION_COOKIE}=${encodeURIComponent(createSessionToken(session))}`;
  }
  return new Request(`http://localhost:3000${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function patchSadhu(id: string, session: SessionUser | null, body?: unknown) {
  return sadhuPatch(authed("PATCH", `/api/admin/sadhus/${id}`, session, body), {
    params: Promise.resolve({ id }),
  });
}

beforeAll(async () => {
  bhakt = await userCreate("रूपेश भक्त", "USER");
  sadhu = await userCreate("स्वामी रूपेश", "SADHU");
  admin = await userCreate("प्रबंधक साहब", "ADMIN");
});

async function userCreate(name: string, role: string): Promise<SessionUser> {
  const created = await prisma.user.create({
    data: {
      name,
      email: `${SUITE}${role.toLowerCase()}-${name}@example.com`,
      passwordHash: await hashPassword(PASSWORD),
      role,
    },
  });
  return { id: created.id, email: created.email, role: created.role };
}

afterAll(async () => {
  await prisma.volunteer.deleteMany({ where: { user: { email: { startsWith: SUITE } } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: SUITE } } });
});

describe("GET /api/admin/sadhus (ADMIN only)", () => {
  it("401 without a session", async () => {
    const res = await sadhusGet(authed("GET", "/api/admin/sadhus", null));
    expect(res.status).toBe(401);
  });

  it("403 with a USER session (wrong role → typed Hindi)", async () => {
    const res = await sadhusGet(authed("GET", "/api/admin/sadhus", bhakt));
    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({ error: "इस कार्य की अनुमति नहीं है।" });
  });

  it("200 for ADMIN; only SADHU rows, public shape only", async () => {
    const res = await sadhusGet(authed("GET", "/api/admin/sadhus", admin));
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      sadhus: Array<{ role: string; sadhuVerified: boolean; passwordHash?: string }>;
    };
    expect(body.sadhus.length).toBeGreaterThanOrEqual(1);
    for (const row of body.sadhus) {
      expect(row.role).toBe("SADHU");
      expect(row).not.toHaveProperty("passwordHash");
    }
  });
});

describe("PATCH /api/admin/sadhus/[id] (ADMIN only)", () => {
  it("401 without a session", async () => {
    const res = await patchSadhu(sadhu.id, null, { sadhuVerified: true });
    expect(res.status).toBe(401);
  });

  it("403 with a USER session — even for their own id", async () => {
    const res = await patchSadhu(bhakt.id, bhakt, { sadhuVerified: true });
    expect(res.status).toBe(403);
  });

  it("404 when the id is not a SADHU row (USER ids untouched)", async () => {
    const res = await patchSadhu(bhakt.id, admin, { sadhuVerified: true });
    expect(res.status).toBe(404);
  });

  it("404 for an unknown id", async () => {
    const res = await patchSadhu("nonexistent0001", admin, { sadhuVerified: true });
    expect(res.status).toBe(404);
  });

  it("400 on an invalid body", async () => {
    const res = await patchSadhu(sadhu.id, admin, { sadhuVerified: "yes" });
    expect(res.status).toBe(400);
  });

  it("ADMIN flips sadhuVerified → 200 + DB row updated", async () => {
    const res = await patchSadhu(sadhu.id, admin, { sadhuVerified: true });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { sadhu: { sadhuVerified: boolean } };
    expect(body.sadhu.sadhuVerified).toBe(true);

    const row = await prisma.user.findUnique({ where: { id: sadhu.id } });
    expect(row?.sadhuVerified).toBe(true);
    expect(row?.role).toBe("SADHU");

    // rejection path flips it back
    const back = await patchSadhu(sadhu.id, admin, { sadhuVerified: false });
    expect(back.status).toBe(200);
  });
});

describe("POST /api/volunteers (account-based — Day 3)", () => {
  it("401 without a session: the anonymous form is gone", async () => {
    const res = await volunteerPost(authed("POST", "/api/volunteers", null, { whatsapp: "9112345678" }));
    expect(res.status).toBe(401);
  });

  it("400 on an invalid WhatsApp number", async () => {
    const res = await volunteerPost(authed("POST", "/api/volunteers", bhakt, { whatsapp: "123" }));
    expect(res.status).toBe(400);
  });

  it("201 for a logged-in USER; name from the account, userId attached", async () => {
    const res = await volunteerPost(authed("POST", "/api/volunteers", bhakt, { whatsapp: "9112345678" }));
    expect(res.status).toBe(201);
    const body = (await res.json()) as { volunteer: { name: string; userId: string | null } };
    expect(body.volunteer.name).toBe("रूपेश भक्त");
    expect(body.volunteer.userId).toBe(bhakt.id);

    const row = await prisma.volunteer.findFirst({ where: { userId: bhakt.id } });
    expect(row?.whatsapp).toBe("9112345678");
  });

  it("400 on a non-JSON content type (request-body contract)", async () => {
    const res = await volunteerPost(
      new Request("http://localhost:3000/api/volunteers", {
        method: "POST",
        headers: {
          "content-type": "text/plain",
          cookie: `${SESSION_COOKIE}=${encodeURIComponent(createSessionToken(bhakt))}`,
        },
        body: '{"whatsapp":"9112345678"}',
      })
    );
    expect(res.status).toBe(400);
  });
});
