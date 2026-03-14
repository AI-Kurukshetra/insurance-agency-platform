import type { LeadRow } from "@/lib/actions/leads";

const stageFlow = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "proposal", label: "Proposal" },
  { key: "negotiation", label: "Negotiation" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
];

type Props = {
  leads: LeadRow[];
};

export function LeadPipeline({ leads }: Props) {
  const grouped = stageFlow.map((stage) => {
    const items = leads.filter((lead) => lead.stage === stage.key);
    return { ...stage, count: items.length, preview: items.slice(0, 3) };
  });

  return (
    <div className="grid gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-3">
      {grouped.map((stage) => (
        <div key={stage.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{stage.label}</p>
            <span className="text-sm font-semibold text-slate-900">{stage.count}</span>
          </div>
          <div className="mt-4 space-y-3">
            {stage.preview.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between text-sm text-slate-600">
                <p className="font-semibold text-slate-900">
                  {lead.first_name} {lead.last_name}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{lead.lead_id}</p>
              </div>
            ))}
            {stage.preview.length === 0 && (
              <p className="text-xs text-slate-500">No leads at this stage yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
