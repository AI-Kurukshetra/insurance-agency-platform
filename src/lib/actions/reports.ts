"use server";

import { createClient } from "@/lib/supabase/server";

export type ReportStats = {
  clients: number;
  policies: number;
  quotes: number;
  claims: number;
  leads: number;
  openTasks: number;
  totalPremium: number;
};

export type PolicyBreakdown = {
  line: string;
  count: number;
  premium: number;
};

export async function getReportStats(): Promise<ReportStats> {
  const supabase = await createClient();

  const [clientCount, policyCount, quoteCount, claimCount, leadCount, tasksRes, premiumRes] =
    await Promise.all([
      supabase.from("clients").select("id", { head: true, count: "exact" }),
      supabase.from("policies").select("id", { head: true, count: "exact" }),
      supabase.from("quotes").select("id", { head: true, count: "exact" }),
      supabase.from("claims").select("id", { head: true, count: "exact" }),
      supabase.from("leads").select("id", { head: true, count: "exact" }),
      supabase.from("tasks").select("id", { head: true, count: "exact" }).neq("status", "completed"),
      supabase.from("policies").select("premium"),
    ]);

  if (clientCount.error || policyCount.error || quoteCount.error || claimCount.error || leadCount.error || tasksRes.error || premiumRes.error) {
    const err = clientCount.error ?? policyCount.error ?? quoteCount.error ?? claimCount.error ?? leadCount.error ?? tasksRes.error ?? premiumRes.error;
    throw new Error(err?.message ?? "Unable to load report data");
  }

  const totalPremium = (premiumRes.data ?? []).reduce((acc, row) => acc + Number(row.premium ?? 0), 0);

  return {
    clients: clientCount.count ?? 0,
    policies: policyCount.count ?? 0,
    quotes: quoteCount.count ?? 0,
    claims: claimCount.count ?? 0,
    leads: leadCount.count ?? 0,
    openTasks: tasksRes.count ?? 0,
    totalPremium,
  };
}

export async function getPolicyBreakdown(): Promise<PolicyBreakdown[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("policies").select("line_of_business, premium");

  if (error) {
    throw new Error(error.message);
  }

  const summary = new Map<string, { count: number; premium: number }>();
  (data ?? []).forEach((row) => {
    const line = row.line_of_business ?? "other";
    const current = summary.get(line) ?? { count: 0, premium: 0 };
    summary.set(line, {
      count: current.count + 1,
      premium: current.premium + Number(row.premium ?? 0),
    });
  });

  return Array.from(summary.entries()).map(([line, value]) => ({
    line,
    count: value.count,
    premium: value.premium,
  }));
}
