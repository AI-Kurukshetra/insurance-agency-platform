import { z } from "zod";

export const claimStatusEnum = z.enum([
  "open",
  "in_review",
  "approved",
  "denied",
  "closed",
  "pending_info",
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
  }, z.number({ invalid_type_error: message }).nonnegative("Must be zero or more"));

const optionalText = (max: number) =>
  z.string().max(max, "Too long").optional().or(z.literal(""));

export const claimSchema = z.object({
  claim_number: z
    .string()
    .max(32, "Claim number is too long")
    .trim()
    .optional()
    .or(z.literal("")),
  policy_id: z.string().uuid("Select a policy"),
  client_id: z.string().uuid("Select a client"),
  carrier_id: z.string().uuid("Select a carrier"),
  status: claimStatusEnum,
  incident_date: z.preprocess(preprocessDate, z.date("Incident date is required")),
  reported_date: z.preprocess(preprocessDate, z.date("Reported date is required")),
  description: z
    .string()
    .min(10, "Description is too short")
    .max(2000, "Description is too long"),
  claim_amount: preprocessNumber("Claim amount is required"),
  settled_amount: z
    .preprocess((value) => {
      if (typeof value === "string" && value.trim() === "") return undefined;
      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      return value;
    }, z.number().nonnegative().optional()),
  adjuster_name: optionalText(100),
  adjuster_phone: optionalText(30),
  notes: z.string().max(1000, "Notes are too long").optional().or(z.literal("")),
  assigned_agent_id: z.string().uuid("Assign an agent").optional(),
});

export const claimUpdateSchema = claimSchema.extend({
  id: z.string().uuid(),
});

export type ClaimInput = z.infer<typeof claimSchema>;
export type ClaimUpdateInput = z.infer<typeof claimUpdateSchema>;
