// lib/next-path.ts — shared open-redirect guard for the login/register `next`
// query parameter (single source of truth; previously duplicated in both pages
// and drifted apart — one page forgot the other's loop guard was code, not a
// "contract").
//
// After a successful login/registration we only ever navigate to a same-origin
// relative path. Absolute URLs, protocol-relative ("//host"),
// backslash/encoded-slash tricks, control characters and looping back to the
// page itself are rejected, falling back to the caller's default.

const MAX_NEXT_LENGTH = 512;

export function safeNextPath(
  value: string | string[] | undefined,
  /** The page hosting the form — a `next` pointing back at it would loop. */
  selfPath: string
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  if (raw.length > MAX_NEXT_LENGTH) return undefined;
  if (!raw.startsWith("/") || raw.startsWith("//")) return undefined;
  if (raw.includes("\\")) return undefined;
  if (/[\u0000-\u001f\u007f]/.test(raw)) return undefined;
  if (/^\/%2f|^\/%5c/i.test(raw)) return undefined;
  if (
    raw === selfPath ||
    raw.startsWith(`${selfPath}?`) ||
    raw.startsWith(`${selfPath}/`)
  ) {
    return undefined;
  }
  return raw;
}
