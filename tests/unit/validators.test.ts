import { describe, expect, it } from "vitest";
import {
  bookingSchema,
  gauSevaSchema,
  volunteerSchema,
  orderSchema,
} from "@/lib/validators";

// TC-BK-02/03/08, TC-VL-02 — validation contract
describe("bookingSchema", () => {
  it("accepts a valid gadi puja booking", () => {
    const ok = bookingSchema.safeParse({
      type: "GADI_PUJA",
      personName: "रामेश जी",
      vehicleNo: "UP-16-AB-1234",
      date: "2027-01-14",
    });
    expect(ok.success).toBe(true);
  });

  it("rejects bad vehicle number with Hindi error", () => {
    const res = bookingSchema.safeParse({
      type: "GADI_PUJA",
      personName: "रामेश जी",
      vehicleNo: "abc123",
      date: "2027-01-14",
    });
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.issues[0].message).toContain("गाड़ी नंबर");
  });

  it("rejects empty date", () => {
    const res = bookingSchema.safeParse({
      type: "NAMKARAN",
      personName: "सीता जी",
      date: "",
    });
    expect(res.success).toBe(false);
  });

  it("rejects phone with fewer than 10 digits (sant booking)", () => {
    const res = bookingSchema.safeParse({
      type: "SANT",
      personName: "रामेश जी",
      phone: "123",
      date: "2027-01-14",
    });
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.issues[0].message).toContain("10 अंकों");
  });
});

describe("gauSevaSchema", () => {
  it("defaults empty donor to श्रद्धालु (TC-GS-02)", () => {
    const res = gauSevaSchema.parse({ kind: "TREE", treeType: "बेलपत्र (Belpatra)" });
    expect(res.donorName).toBe("श्रद्धालु");
  });
});

describe("volunteerSchema", () => {
  it("rejects short whatsapp number", () => {
    const res = volunteerSchema.safeParse({ name: "अर्जुन", whatsapp: "123" });
    expect(res.success).toBe(false);
  });
});

describe("volunteerSchema (Day 3 — account-based)", () => {
  it("strips any client-supplied name; only WhatsApp is form input", () => {
    const res = volunteerSchema.parse({ whatsapp: "9112345678", name: "evil researched name" });
    expect(res).toEqual({ whatsapp: "9112345678" });
  });
});

describe("orderSchema", () => {
  it("requires name and phone (TC-ST-04)", () => {
    const res = orderSchema.safeParse({ buyerName: "", phone: "9999999999" });
    expect(res.success).toBe(false);
  });
});
