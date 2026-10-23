import { describe, expect, it } from "vitest";
import { matchSearchKeyword } from "@/lib/search";

// NAVIGATION §5 routing — first match wins, order: मंदिर → गाड़ी → नामकरण → संत/महामंडलेश्वर
describe("search keyword routing (F10)", () => {
  it("routes मंदिर → NEARBY", () => {
    expect(matchSearchKeyword("मंदिर")).toBe("NEARBY");
  });

  it("routes गाड़ी → GADI_PUJA", () => {
    expect(matchSearchKeyword("गाड़ी पूजन")).toBe("GADI_PUJA");
  });

  it("routes नामकरण → NAMKARAN", () => {
    expect(matchSearchKeyword("नामकरण संस्कार")).toBe("NAMKARAN");
  });

  it("routes संत and महामंडलेश्वर → AKHARA_DIRECTORY", () => {
    expect(matchSearchKeyword("संत")).toBe("AKHARA_DIRECTORY");
    expect(matchSearchKeyword("महामंडलेश्वर")).toBe("AKHARA_DIRECTORY");
  });

  it("gibberish → silent (TC-SR-06)", () => {
    expect(matchSearchKeyword("xyzabc")).toBeNull();
    expect(matchSearchKeyword("")).toBeNull();
  });
});
