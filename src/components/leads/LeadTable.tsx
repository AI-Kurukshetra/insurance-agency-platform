import Link from "next/link";
import { z } from "zod";
import { deleteLeadAction, type LeadRow, updateLeadStage } from "@/lib/actions/leads";
import { leadStageEnum } from "@/lib/validations/lead";
import { LeadStageBadge } from "@/components/leads/LeadStageBadge";
import { cn } from "@/lib/utils";

type Props = {
  leads: LeadRow[];
};

export async function archiveLead(formData: FormData) {
  "use server";
  const id = formData.get("leadId");
  if (typeof id !== "string") return;
  await deleteLeadAction(id);
}

export async function winLead(formData: FormData) {
  "use server";
  const id = formData.get("leadId");
  if (typeof id !== "string") return;
  await updateLeadStage(id, "won");
}

export function LeadTable({ leads }: Props) {
  if (!leads.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No leads yet. Add a new lead from the form beside this list.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Lead</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Stage</th>
            <th className="px-4 py-3">Premium</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t border-slate-100">
              <td className="px-4 py-3">
                <Link href={`/leads/${lead.id}`} className="font-semibold text-slate-900 hover:text-brand-600">
                  {lead.first_name} {lead.last_name}
                </Link>
                <p className="text-xs text-slate-500">{lead.lead_id}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{lead.source ?? "—"}</td>
              <td className="px-4 py-3">
                <LeadStageBadge
                  stage={leadStageEnum.safeParse(lead.stage).success ? (lead.stage as z.infer<typeof leadStageEnum>) : "new"}
                />
              </td>
              <td className="px-4 py-3 text-slate-700">
                {lead.estimated_premium ? `₹${lead.estimated_premium.toLocaleString()}` : "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <form action={archiveLead} className="inline">
                    <input type="hidden" name="leadId" value={lead.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-rose-600 transition hover:border-rose-400"
                    >
                      Archive
                    </button>
                  </form>
                  <form action={winLead} className="inline">
                    <input type="hidden" name="leadId" value={lead.id} />
                    <button
                      type="submit"
                      className={cn(
                        "rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 transition hover:border-slate-300",
                      )}
                    >
                      Mark won
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
