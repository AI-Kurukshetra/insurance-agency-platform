import { fetchLeads } from "@/lib/actions/leads";
import { LeadPipeline } from "@/components/leads/LeadPipeline";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadForm } from "@/components/leads/LeadForm";

export default async function LeadsPage() {
  const leads = await fetchLeads(30);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-slate-500">Leads</p>
        <h1 className="text-3xl font-semibold text-slate-900">Lead pipeline</h1>
        <p className="text-sm text-slate-500">
          Surface every lead stage—from brand-new referrals to signed policies—so you can follow up quickly.
        </p>
      </header>

      <LeadPipeline leads={leads} />

      <div className="grid gap-6 xl:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          <LeadTable leads={leads} />
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
