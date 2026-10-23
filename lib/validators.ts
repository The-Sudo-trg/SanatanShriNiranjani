import { z } from "zod";

// Hindi error messages are contractual (AGENT.md §3 Forms / PRD §6)

const phoneSchema = z
  .string()
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
  name: z.string().trim().min(2, "कृपया अपना पूरा नाम लिखें"),
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
