"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { createCommissionFromPolicy } from "@/lib/actions/commissions";
import {
  policySchema,
  policyUpdateSchema,
  type PolicyInput,
  type PolicyUpdateInput,
} from "@/lib/validations/policy";

export type PolicyRow = Database["public"]["Tables"]["policies"]["Row"];

type ActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function fetchPolicies(limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("policies")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PolicyRow[];
}

const policyIdSchema = z.string().uuid("Invalid policy ID");

export async function createPolicyAction(input: unknown): Promise<ActionResult> {
  const parsed = policySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { count } = await supabase.from("policies").select("id", { head: true, count: "exact" });
  const generatedNumber = `POL-${String((count ?? 0) + 1).padStart(3, "0")}`;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const payload: PolicyInput = {
    ...parsed.data,
    policy_number: parsed.data.policy_number?.trim() || generatedNumber,
    created_by: user.id,
    assigned_agent_id: user.id,
  };

  const { data: policyData, error } = await supabase
    .from("policies")
    .insert(payload)
    .select("id")
    .maybeSingle();
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/policies");
  if (policyData?.id) {
    await createCommissionFromPolicy({
      policyId: policyData.id,
      carrierId: payload.carrier_id,
      agentId: user.id,
      premium: payload.premium,
    });
  }
  return { success: true, message: "Policy created" };
}

export async function deletePolicyAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("policies").delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/policies");
  return { success: true, message: "Policy deleted" };
}

export async function getPolicyById(id: string) {
  const parsedId = policyIdSchema.safeParse(id);
  if (!parsedId.success) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("policies")
    .select("*")
    .eq("id", parsedId.data)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updatePolicyAction(input: unknown): Promise<ActionResult> {
  const parsed = policyUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("policies").update(rest).eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/policies");
  return { success: true, message: "Policy updated" };
}
