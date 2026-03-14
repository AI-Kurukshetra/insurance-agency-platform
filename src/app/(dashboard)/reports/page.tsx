import { LeadStageBadge } from "@/components/leads/LeadStageBadge";
import { ReportSummaryCard } from "@/components/reports/ReportSummaryCard";
import { ReportsChart } from "@/components/reports/ReportsChart";
import { fetchLeads } from "@/lib/actions/leads";
import { getPolicyBreakdown, getReportStats } from "@/lib/actions/reports";
import { leadStageEnum } from "@/lib/validations/lead";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function ReportsPage() {
  const [stats, policyBreakdown, leads] = await Promise.all([
    getReportStats(),
    getPolicyBreakdown(),
    fetchLeads(6),
  ]);

  const summaryCards = [
    { label: "Clients", value: String(stats.clients), helper: "Active profiles" },
    { label: "Policies", value: String(stats.policies), helper: "Total policies" },
    { label: "Quotes", value: String(stats.quotes), helper: "Quotes in system" },
    { label: "Claims", value: String(stats.claims), helper: "Open + in review" },
    { label: "Leads", value: String(stats.leads), helper: "Captured leads" },
    { label: "Open tasks", value: String(stats.openTasks), helper: "Needs follow-up" },
    { label: "Total premium", value: currencyFormatter.format(stats.totalPremium), helper: "All policies" },
  ];

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <div>
          <p className="text-sm text-slate-500">Reports</p>
          <h1 className="text-3xl font-semibold text-slate-900">Business insights</h1>
        </div>
        <p className="text-sm text-slate-500 max-w-2xl">
          Monitor agency performance with high-level KPIs, pipeline snapshots, and premium trends.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <ReportSummaryCard key={card.label} label={card.label} value={card.value} helper={card.helper} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <ReportsChart data={policyBreakdown} />
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Pipeline</p>
              <h2 className="text-lg font-semibold text-slate-900">Recent leads</h2>
            </div>
            <p className="text-sm text-slate-500">Latest {leads.length}</p>
          </div>
          <div className="mt-4 space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/40 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {lead.first_name} {lead.last_name}
                  </p>
                  <p className="text-xs text-slate-500">{lead.lead_id ?? "–"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Premium</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {lead.estimated_premium ? currencyFormatter.format(lead.estimated_premium) : "—"}
                  </p>
                </div>
                <LeadStageBadge
                  stage={leadStageEnum.safeParse(lead.stage).success ? (lead.stage as Parameters<typeof LeadStageBadge>[0]["stage"]) : "new"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
