"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import {
  commissionSchema,
  commissionUpdateSchema,
  type CommissionInput,
  type CommissionUpdateInput,
} from "@/lib/validations/commission";

type ActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export type CommissionRow = Database["public"]["Tables"]["commissions"]["Row"];

export async function fetchCommissions(limit = 50) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("commissions")
    .select("id, policy_id, carrier_id, agent_id, type, status, gross_premium, commission_rate, commission_amount, paid_date, payment_reference")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CommissionRow[];
}

export async function getCommissionById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("commissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as CommissionRow | null;
}

export async function createCommissionAction(input: unknown): Promise<ActionResult> {
  const parsed = commissionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("commissions").insert(parsed.data);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/commissions");
  return { success: true, message: "Commission created" };
}

export async function createCommissionFromPolicy(options: {
  policyId: string;
  carrierId: string;
  agentId: string;
  premium: number;
  rate?: number;
  type?: z.infer<typeof commissionSchema.shape.type>;
}) {
  const rate = options.rate ?? 10;
  const payload: CommissionInput = {
    policy_id: options.policyId,
    carrier_id: options.carrierId,
    agent_id: options.agentId,
    type: options.type ?? "new_business",
    status: "pending",
    commission_rate: rate,
    gross_premium: options.premium,
    commission_amount: Number(((options.premium * rate) / 100).toFixed(2)),
  };

  const supabase = await createClient();
  const { error } = await supabase.from("commissions").insert(payload);
  if (error) {
    console.error("Failed to create commission", error.message);
  }
}

export async function updateCommissionAction(input: unknown): Promise<ActionResult> {
  const parsed = commissionUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("commissions").update(rest).eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/commissions");
  return { success: true, message: "Commission updated" };
}

export async function deleteCommissionAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("commissions").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/commissions");
  return { success: true, message: "Commission deleted" };
}

export async function getCommissionSummary() {
  const supabase = await createClient();
  const total = await supabase.from("commissions").select("commission_amount");
  const pending = await supabase.from("commissions").select("commission_amount").eq("status", "pending");
  const paid = await supabase.from("commissions").select("commission_amount").eq("status", "paid");

  const sum = (rows: { commission_amount: number }[]) =>
    rows.reduce((acc, row) => acc + (row.commission_amount ?? 0), 0);

  return {
    total: sum(total.data ?? []),
    pending: sum(pending.data ?? []),
    paid: sum(paid.data ?? []),
  };
}
