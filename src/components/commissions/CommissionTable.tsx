import Link from "next/link";
import { CommissionRow } from "@/lib/actions/commissions";
import { CommissionStatusBadge } from "@/components/commissions/CommissionStatusBadge";
import { cn } from "@/lib/utils";

type Props = {
  commissions: CommissionRow[];
};

export function CommissionTable({ commissions }: Props) {
  if (!commissions.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No commissions yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Agent</th>
            <th className="px-4 py-3">Carrier</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Gross Prem.</th>
            <th className="px-4 py-3">Commission</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map((commission) => (
            <tr key={commission.id} className="border-t border-slate-100">
              <td className="px-4 py-3 text-slate-700">{commission.agent_id ?? "-"}</td>
              <td className="px-4 py-3 text-slate-700">{commission.carrier_id}</td>
              <td className="px-4 py-3 text-slate-600 capitalize">{commission.type}</td>
              <td className="px-4 py-3 text-slate-600">
                ₹{commission.gross_premium?.toLocaleString() ?? "0"}
              </td>
              <td className="px-4 py-3 text-slate-700">
                ₹{commission.commission_amount?.toLocaleString() ?? "0"}
              </td>
              <td className="px-4 py-3">
                <CommissionStatusBadge status={commission.status} />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/commissions/${commission.id}`}
                  className={cn(
                    "inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300",
                  )}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
