import { z } from "zod";

export const commissionTypeEnum = z.enum(["new_business", "renewal", "bonus", "adjustment"]);
export const commissionStatusEnum = z.enum(["pending", "paid", "voided"]);

export const commissionSchema = z.object({
  policy_id: z.string().uuid("Policy is required"),
  carrier_id: z.string().uuid("Carrier is required"),
  agent_id: z.string().uuid("Agent is required"),
  type: commissionTypeEnum,
  status: commissionStatusEnum,
  commission_rate: z
    .number({ invalid_type_error: "Commission rate is required" })
    .min(0, "Rate must be zero or more")
    .max(100, "Rate must be 100 or less"),
  gross_premium: z
    .number({ invalid_type_error: "Gross premium is required" })
    .nonnegative("Gross premium must be zero or more"),
  commission_amount: z
    .number({ invalid_type_error: "Commission amount is required" })
    .nonnegative("Commission amount must be zero or more"),
  paid_date: z.preprocess((value) => {
    if (typeof value === "string" && value) return new Date(value);
    return null;
  }, z.date().optional()),
  payment_reference: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

export const commissionUpdateSchema = commissionSchema.extend({
  id: z.string().uuid(),
});

export type CommissionInput = z.infer<typeof commissionSchema>;
export type CommissionUpdateInput = z.infer<typeof commissionUpdateSchema>;
