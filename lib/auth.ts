// lib/auth.ts — Day 1 auth foundation (AGENT.md §2.6 locked decision)
//
// ⚠️ ZERO NEW DEPENDENCIES. Password hashing = node:crypto scrypt (random salt +
// timingSafeEqual). Session tokens = HMAC-SHA256 JWT built from node:crypto.
// Cookies are serialised by hand and attached to a plain Web `Response`, so this
// module stays framework-pure (no next/server import) and is directly unit-testable.
//
// Roles live in the DB as a String column because Prisma's SQLite connector does
// not support enums (see prisma/schema.prisma). The Role union below is the single
// source of truth in app code; anything unknown is normalised to "USER".
import { createHmac, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import { jsonError } from "./api";

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number }
) => Promise<Buffer>;

// ---------------------------------------------------------------------------
// Roles (DB stores a string; this union is the app-level contract)
// ---------------------------------------------------------------------------
export const ROLES = ["USER", "SADHU", "VOLUNTEER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export function normalizeRole(value: string): Role {
  return (ROLES as readonly string[]).includes(value) ? (value as Role) : "USER";
}

// ---------------------------------------------------------------------------
// Passwords — scrypt with per-password random salt
// ---------------------------------------------------------------------------
// Cost parameters are persisted inside the hash string, so they can be raised
// later without invalidating existing passwords.
// OWASP-recommended scrypt work factor: N=2^17, r=8, p=1 (≈128 MiB, ~350 ms).
const SCRYPT_N = 2 ** 17;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SCRYPT_SALT_BYTES = 16;
// Explicit ceiling — Node's 32 MiB default is below N=2^17,r=8 and would throw
// "Invalid scrypt params". Centralised so a future cost increase stays safe.
const SCRYPT_MAXMEM = 256 * 1024 * 1024;

/** NFC-normalise so Devanagari passwords typed on any keyboard hash identically. */
function normalizePassword(password: string): string {
  return password.normalize("NFC");
}

/** PHC-style encoding: scrypt$N$r$p$saltHex$hashHex */
export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("hashPassword: password required");
  }
  const salt = randomBytes(SCRYPT_SALT_BYTES);
  const derived = await scrypt(normalizePassword(password), salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: SCRYPT_MAXMEM,
  });
  return ["scrypt", SCRYPT_N, SCRYPT_R, SCRYPT_P, salt.toString("hex"), derived.toString("hex")].join("$");
}

/**
 * Timing-safe password check. Never throws: a malformed/absent stored hash simply
 * fails closed (so a corrupted row can never 500 the login route or leak a crash
 * signal to an attacker).
 */
export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  if (typeof password !== "string" || typeof stored !== "string" || stored.length === 0) return false;
  try {
    const parts = stored.split("$");
    if (parts.length !== 6) return false;
    const [scheme, nRaw, rRaw, pRaw, saltHex, hashHex] = parts;
    if (scheme !== "scrypt") return false;

    const N = Number(nRaw);
    const r = Number(rRaw);
    const p = Number(pRaw);
    // Bound the KDF parameters: a tampered hash must not become a CPU DoS vector.
    if (!Number.isInteger(N) || N < 2 || N > 2 ** 20) return false;
    if (!Number.isInteger(r) || r < 1 || r > 16) return false;
    if (!Number.isInteger(p) || p < 1 || p > 16) return false;
    if (!/^[0-9a-f]+$/i.test(saltHex) || saltHex.length % 2 !== 0) return false;
    if (!/^[0-9a-f]+$/i.test(hashHex) || hashHex.length % 2 !== 0) return false;

    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    if (salt.length === 0 || expected.length === 0) return false;

    const derived = await scrypt(normalizePassword(password), salt, expected.length, {
      N,
      r,
      p,
      maxmem: SCRYPT_MAXMEM,
    });
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/**
 * A syntactically valid but never-matching hash. Login runs a dummy verify against
 * this when the e-mail is unknown so response timing does not enumerate users.
 */
export const DUMMY_PASSWORD_HASH = `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${"0".repeat(
  SCRYPT_SALT_BYTES * 2
)}$${"0".repeat(SCRYPT_KEYLEN * 2)}`;

// ---------------------------------------------------------------------------
// JWT (HS256) — signed/verified with node:crypto
// ---------------------------------------------------------------------------
export const SESSION_COOKIE = "__Host-sn_session";
/** 7 days, in seconds (JWT `exp` + cookie `Max-Age`). */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

// Dev-only fallback keeps `npm run dev` and Vitest working with zero setup.
// Any other environment (production, staging with NODE_ENV unset, …) must supply
// AUTH_SECRET (documented in .env.example) — we fail closed.
const DEV_ONLY_SECRET = "sn-dev-only-auth-secret-change-me";

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET ?? process.env.JWT_SECRET;
  if (secret && secret.length >= 16) return secret;
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === "development" || nodeEnv === "test") return DEV_ONLY_SECRET;
  // AGENT.md §2.9 — secrets come from the environment, never from source.
  throw new Error("AUTH_SECRET (min 16 chars) is required outside local development");
}

export interface SessionClaims {
  /** User id (subject). */
  sub: string;
  email?: string;
  role?: Role;
  /** Issued-at, seconds since epoch. */
  iat: number;
  /** Expiry, seconds since epoch. */
  exp: number;
  jti?: string;
  [key: string]: unknown;
}

export type SessionClaimsInput = {
  sub: string;
  email?: string;
  role?: Role;
  jti?: string;
  [key: string]: unknown;
};

function base64UrlEncode(value: Buffer | string): string {
  return Buffer.from(value).toString("base64url");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Sign a 7-day HS256 JWT. `expiresInSeconds` is exposed for tests/expiry cases. */
export function signJwt(
  payload: SessionClaimsInput,
  opts: { expiresInSeconds?: number; now?: number } = {}
): string {
  const now = opts.now ?? Math.floor(Date.now() / 1000);
  const expiresIn = opts.expiresInSeconds ?? SESSION_MAX_AGE;
  const claims: SessionClaims = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };
  const encodedHeader = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = base64UrlEncode(JSON.stringify(claims));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac("sha256", getAuthSecret()).update(signingInput).digest("base64url");
  return `${signingInput}.${signature}`;
}

/**
 * Verify signature + expiry. Returns the claims on success, `null` for ANY failure
 * (tampered, malformed, wrong secret, expired) — callers treat null as "no session".
 */
export function verifyJwt(token: string, opts: { now?: number } = {}): SessionClaims | null {
  if (typeof token !== "string" || token.length === 0 || token.length > 4096) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, signature] = parts;
  if (!encodedHeader || !encodedPayload || !signature) return null;

  let providedSignature: Buffer;
  let expectedSignature: Buffer;
  try {
    providedSignature = Buffer.from(signature, "base64url");
    expectedSignature = createHmac("sha256", getAuthSecret()).update(`${encodedHeader}.${encodedPayload}`).digest();
  } catch {
    return null;
  }
  if (providedSignature.length !== expectedSignature.length) return null;
  if (!timingSafeEqual(providedSignature, expectedSignature)) return null;

  let header: unknown;
  let claims: unknown;
  try {
    header = JSON.parse(Buffer.from(encodedHeader, "base64url").toString("utf8"));
    claims = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!isPlainObject(header) || header.alg !== "HS256") return null;
  if (!isPlainObject(claims)) return null;

  const now = opts.now ?? Math.floor(Date.now() / 1000);
  const exp = claims.exp;
  if (typeof exp !== "number" || !Number.isFinite(exp) || exp <= now) return null;
  if (typeof claims.iat === "number" && claims.iat > now + 60) return null; // small clock skew allowance
  if (typeof claims.sub !== "string" || claims.sub.length === 0) return null;

  return claims as unknown as SessionClaims;
}

/** Fresh session token for a logged-in user. */
export function createSessionToken(user: { id: string; email: string; role: string }): string {
  return signJwt({
    sub: user.id,
    email: user.email,
    role: normalizeRole(user.role),
    jti: randomUUID(),
  });
}

// ---------------------------------------------------------------------------
// Session cookie — HttpOnly, SameSite=Lax, Secure, 7-day Max-Age
// ---------------------------------------------------------------------------
export function sessionCookieHeader(token: string, maxAge: number = SESSION_MAX_AGE): string {
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Secure",
    `Max-Age=${maxAge}`,
  ].join("; ");
}

export function clearSessionCookieHeader(): string {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Secure",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ].join("; ");
}

/** Attach the session cookie to an outgoing route-handler response. */
export function setSessionCookie<T extends Response>(res: T, token: string): T {
  res.headers.append("Set-Cookie", sessionCookieHeader(token));
  return res;
}

/** Expire the session cookie (logout / revoke). */
export function clearSessionCookie<T extends Response>(res: T): T {
  res.headers.append("Set-Cookie", clearSessionCookieHeader());
  return res;
}

/** Parse our cookie out of a raw `Cookie` header (returns null when absent). */
export function readSessionToken(req: Request): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    const name = part.slice(0, separator).trim();
    if (name !== SESSION_COOKIE) continue;
    const raw = part.slice(separator + 1).trim();
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return null;
}

/**
 * Cookies from `next/headers` — used when no `Request` is supplied (Server
 * Components). Dynamic import keeps this module free of a next/server dependency
 * and keeps Vitest simple. Returns null outside a request scope.
 */
async function readSessionTokenFromCookieStore(): Promise<string | null> {
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    return store.get(SESSION_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Session user + role guard
// ---------------------------------------------------------------------------
/** The only user shape that may ever leave the server — never includes passwordHash. */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  sadhuVerified: boolean;
  createdAt: Date;
}

export function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  sadhuVerified: boolean;
  createdAt: Date;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: normalizeRole(user.role),
    sadhuVerified: user.sadhuVerified,
    createdAt: user.createdAt,
  };
}

/**
 * Resolve the logged-in user from the session cookie, or null.
 * Pass the route handler's `Request` (recommended); omit it in Server Components
 * and the `next/headers` cookie store is used instead.
 */
export async function getSessionUser(req?: Request): Promise<PublicUser | null> {
  const token = req ? readSessionToken(req) : await readSessionTokenFromCookieStore();
  if (!token) return null;

  const claims = verifyJwt(token);
  if (!claims) return null;

  try {
    // Lazy import: keeps hashing/JWT helpers usable by prisma/seed.ts without
    // dragging the Prisma client (and an extra connection) into the seed process.
    const { prisma } = await import("./db");
    const user = await prisma.user.findUnique({ where: { id: claims.sub } });
    return user ? toPublicUser(user) : null;
  } catch {
    // A DB hiccup must read as "not authenticated", never as a crash/500 leak.
    return null;
  }
}

export type GuardResult = { ok: true; user: PublicUser } | { ok: false; response: Response };

/**
 * Route-handler guard. Usage:
 *   const guard = await requireRole("ADMIN", req);
 *   if (!guard.ok) return guard.response;   // 401 no session / 403 wrong role
 *   const user = guard.user;
 *
 * `required` is a single role or a list of accepted roles (`["ADMIN", "VOLUNTEER"]`);
 * the optional `req` enables request-scoped cookie reading (Server Components omit it).
 */
export async function requireRole(
  required: Role | readonly Role[],
  req?: Request
): Promise<GuardResult> {
  const user = await getSessionUser(req);
  if (!user) return { ok: false, response: jsonError("कृपया पहले लॉग इन करें।", 401) };

  const allowed = typeof required === "string" ? [required] : required;
  if (!allowed.includes(user.role)) {
    return { ok: false, response: jsonError("इस कार्य की अनुमति नहीं है।", 403) };
  }
  return { ok: true, user };
}
