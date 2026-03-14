import { z } from "zod";

export const policyStatusEnum = z.enum([
  "active",
  "expired",
  "cancelled",
  "pending",
  "renewed",
]);

export const lineOfBusinessEnum = z.enum([
  "auto",
  "home",
  "life",
  "health",
  "commercial",
  "liability",
  "umbrella",
  "other",
]);

const preprocessDate = (value: unknown) => {
  if (typeof value === "string" && value) {
    return new Date(value);
  }
  return value;
};

const preprocessNumber = (message: string) =>
  z.preprocess((value) => {
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }
    return value;
  }, z.number().nonnegative("Must be zero or more"));

export const policySchema = z.object({
  policy_number: z
    .string()
    .max(32, "Policy number is too long")
    .trim()
    .optional()
    .or(z.literal("")),
  client_id: z.string().uuid("Select a client"),
  carrier_id: z.string().uuid("Select a carrier"),
  line_of_business: lineOfBusinessEnum,
  status: policyStatusEnum,
  effective_date: z.preprocess(preprocessDate, z.date("Effective date is required")),
  expiration_date: z.preprocess(preprocessDate, z.date("Expiration date is required")),
  premium: preprocessNumber("Premium is required"),
  coverage_limit: z
    .preprocess((value) => {
      if (typeof value === "string" && value.trim() === "") return undefined;
      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      return value;
    }, z.number().nonnegative().optional()),
  deductible: z
    .preprocess((value) => {
      if (typeof value === "string" && value.trim() === "") return undefined;
      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      return value;
    }, z.number().nonnegative().optional()),
  description: z.string().max(1000).optional(),
});

export const policyUpdateSchema = policySchema.extend({
  id: z.string().uuid(),
});

export type PolicyInput = z.infer<typeof policySchema>;
export type PolicyUpdateInput = z.infer<typeof policyUpdateSchema>;
