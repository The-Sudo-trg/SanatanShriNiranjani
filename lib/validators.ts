import { z } from "zod";

// Hindi error messages are contractual (AGENT.md §3 Forms / PRD §6)

const phoneSchema = z
  .string({ error: "कृपया 10 अंकों का मोबाइल नंबर लिखें" })
  .trim()
  .regex(/^[6-9]\d{9}$/, "कृपया 10 अंकों का मोबाइल नंबर लिखें");

const vehicleNoSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^[A-Z]{2}-\d{1,2}-[A-Z]{1,3}-\d{4}$/,
    "गाड़ी नंबर सही प्रारूप में लिखें (जैसे UP-16-XX-0000)"
  );

const dateStringSchema = z
  .string()
  .min(1, "कृपया दिनांक चुनें")
  .refine((v) => !Number.isNaN(new Date(v).getTime()), "कृपया सही दिनांक चुनें");

const emailSchema = z
  .string({ error: "कृपया ईमेल पता लिखें" })
  .trim()
  .toLowerCase()
  .email("कृपया सही ईमेल पता लिखें");

// Empty form fields arrive as "" — treat those as "not provided".
const optionalPhoneSchema = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  phoneSchema.optional()
);

export const gadiPujaSchema = z.object({
  type: z.literal("GADI_PUJA"),
  personName: z.string().trim().min(2, "कृपया वाहन स्वामी का नाम लिखें"),
  vehicleNo: vehicleNoSchema,
  date: dateStringSchema,
});

export const namkaranSchema = z.object({
  type: z.literal("NAMKARAN"),
  personName: z.string().trim().min(2, "कृपया माता/पिता का नाम लिखें"),
  date: dateStringSchema,
});

export const santBookingSchema = z.object({
  type: z.literal("SANT"),
  personName: z.string().trim().min(2, "कृपया अपना नाम लिखें"),
  phone: phoneSchema,
  date: dateStringSchema,
});

export const bookingSchema = z.discriminatedUnion("type", [
  gadiPujaSchema,
  namkaranSchema,
  santBookingSchema,
]);

export const gauSevaSchema = z.object({
  donorName: z.string().trim().optional().default("श्रद्धालु"),
  kind: z.enum(["TREE", "CHARA_DAILY", "CHARA_MONTHLY"]),
  treeType: z.string().trim().optional(),
});

export const volunteerSchema = z.object({
  // Day 3 — the pass is account-based: name comes from the session user
  // (server-side), only the WhatsApp number is supplied by the form.
  whatsapp: phoneSchema,
});

export const orderSchema = z.object({
  buyerName: z.string().trim().min(2, "कृपया अपना नाम लिखें"),
  phone: phoneSchema,
});

export const forumPostSchema = z.object({
  authorName: z.string().trim().min(2, "कृपया अपना नाम लिखें"),
  kind: z.enum(["QUESTION", "ANSWER"]),
  body: z.string().trim().min(5, "कृपया अपना संदेश विस्तार से लिखें"),
  parentId: z.string().trim().optional(),
});

export const chatSchema = z.object({
  sessionId: z.string().trim().min(1),
  content: z.string().trim().min(2, "कृपया अपना प्रश्न लिखें"),
});

export const malaDeltaSchema = z.object({
  delta: z.number().int().min(-100000).max(100000),
});

export const cartAddSchema = z.object({ productId: z.string().min(1) });
export const cartUpdateSchema = z.object({
  productId: z.string().min(1),
  qty: z.number().int().min(0).max(99),
});
export const cartRemoveSchema = z.object({ productId: z.string().min(1) });

// ---------------------------------------------------------------------------
// Authentication (Day 1) — Hindi messages are contractual (AGENT.md §3)
// ---------------------------------------------------------------------------

// Self-registration may only ever create these roles. ADMIN is assigned by an
// administrator and is never trusted from the request body.
export const SELF_REGISTER_ROLES = ["USER", "SADHU", "VOLUNTEER"] as const;

const passwordSchema = z
  .string({ error: "कृपया पासवर्ड लिखें" })
  .min(8, "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए")
  .max(200, "पासवर्ड बहुत लंबा है");

export const registerSchema = z.object({
  name: z
    .string({ error: "कृपया अपना नाम लिखें" })
    .trim()
    .min(2, "कृपया अपना नाम लिखें")
    .max(80, "नाम बहुत लंबा है"),
  email: emailSchema,
  password: passwordSchema,
  phone: optionalPhoneSchema,
  role: z.enum(SELF_REGISTER_ROLES, "यह भूमिका स्वयं चुनना संभव नहीं है").optional().default("USER"),
});

export const loginSchema = z.object({
  email: emailSchema,
  // Do not reveal the registration password policy on login.
  password: z
    .string({ error: "कृपया पासवर्ड लिखें" })
    .min(1, "कृपया पासवर्ड लिखें")
    .max(200, "पासवर्ड बहुत लंबा है"),
});

// Day 3 — admin sadhu approval state; only ever PATCHed through an ADMIN session.
export const sadhuApprovalSchema = z.object({
  sadhuVerified: z.boolean("अमान्य अनुरोध।"),
});

// Day 8 pre-wiring: feedback rows can be written from the very first day.
export const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .max(80, "नाम बहुत लंबा है")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("कृपया सही ईमेल पता लिखें")
    .optional()
    .or(z.literal("")),
  message: z
    .string({ error: "कृपया अपना संदेश लिखें" })
    .trim()
    .min(5, "कृपया अपना संदेश विस्तार से लिखें")
    .max(2000, "संदेश बहुत लंबा है"),
  templeSlug: z
    .string({ error: "मंदिर का नाम बहुत लंबा है" })
    .trim()
    .max(120, "मंदिर का नाम बहुत लंबा है")
    .optional()
    .or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
