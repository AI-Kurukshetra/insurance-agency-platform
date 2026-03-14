import { z } from "zod";

export const leadStageEnum = z.enum([
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
]);

export const leadSourceEnum = z.enum([
  "referral",
  "website",
  "cold_call",
  "social_media",
  "event",
  "other",
]);

const optionalText = (max: number) =>
  z.string().max(max, "Too long").optional().or(z.literal(""));

const preprocessNumber = (message: string) =>
  z.preprocess((value) => {
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }
    return value;
  }, z.number({ invalid_type_error: message }).nonnegative("Must be zero or more").optional());

export const leadSchema = z.object({
  lead_id: z.string().max(30).optional().or(z.literal("")),
  first_name: z.string().min(1).max(50, "First name is too long"),
  last_name: z.string().min(1).max(50, "Last name is too long"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  source: leadSourceEnum.optional(),
  stage: leadStageEnum,
  interested_in: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) =>
      typeof value === "string"
        ? value
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean)
        : []
    ),
  estimated_premium: preprocessNumber("Estimated premium must be a number"),
  notes: optionalText(800),
});

export const leadUpdateSchema = leadSchema.extend({
  id: z.string().uuid(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;
