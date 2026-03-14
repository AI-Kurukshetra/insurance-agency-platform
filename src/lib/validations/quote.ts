import { z } from "zod";
import { lineOfBusinessEnum } from "@/lib/validations/policy";

export const quoteStatusEnum = z.enum([
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
  "bound",
]);

export const quoteSchema = z.object({
  quote_number: z
    .string()
    .max(32, "Quote number is too long")
    .trim()
    .optional()
    .or(z.literal("")),
  client_id: z.string().uuid("Select a client"),
  carrier_id: z.string().uuid("Select a carrier"),
  line_of_business: lineOfBusinessEnum,
  status: quoteStatusEnum,
  premium: z
    .number()
    .nonnegative("Premium must be zero or more"),
  coverage_limit: z.number().nonnegative().optional(),
  deductible: z.number().nonnegative().optional(),
  valid_until: z.preprocess((value) => {
    if (typeof value === "string" && value) return new Date(value);
    return null;
  }, z.date("Valid until date is required")),
  notes: z.string().max(1000).optional(),
});

export const quoteUpdateSchema = quoteSchema.extend({
  id: z.string().uuid(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
export type QuoteUpdateInput = z.infer<typeof quoteUpdateSchema>;
