import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: totalClients }, { count: totalPolicies }, { count: openClaims }] =
    await Promise.all([
      supabase.from("clients").select("id", { head: true, count: "exact" }),
      supabase.from("policies").select("id", { head: true, count: "exact" }),
      supabase
        .from("claims")
        .select("id", { head: true, count: "exact" })
        .in("status", ["open", "in_review", "pending_info"]),
    ]);

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <p className="text-sm text-slate-500">Total Clients</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {totalClients ?? 0}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <p className="text-sm text-slate-500">Policies</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {totalPolicies ?? 0}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <p className="text-sm text-slate-500">Open Claims</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {openClaims ?? 0}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <p className="text-sm text-slate-500">System Status</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">Live</p>
        </article>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <h2 className="font-[var(--font-display)] text-2xl font-semibold text-slate-900">
          Welcome
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Core modules are now mounted on the protected dashboard shell with
          responsive sidebar navigation. Next steps are implementing each module
          page and replacing placeholders with live workflows.
        </p>
      </div>
    </section>
  );
}
