import { SEARCH_ROUTES } from "./constants";

export type ModalName =
  | "AKHARA_DIRECTORY"
  | "GOLDEN_BABA"
  | "GADI_PUJA"
  | "NAMKARAN"
  | "NEARBY"
  | "LIVE_DARSHAN"
  | "LIVE_GAU"
  | "AI_CHAT"
  | "BOOKING"
  | "SOUTH_SAINTS"
  | "VOLUNTEER"
  | "NOTIFICATION";

/** NAVIGATION §5 keyword routing — first match wins; no match → null (silent). */
export function matchSearchKeyword(query: string): ModalName | null {
  const q = query.trim();
  if (!q) return null;
  for (const route of SEARCH_ROUTES) {
    if (route.pattern.test(q)) return route.modal as ModalName;
  }
  return null;
}
