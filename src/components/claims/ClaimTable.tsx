import Link from "next/link";
import { deleteClaimAction, type ClaimRow } from "@/lib/actions/claims";
import { ClaimStatusBadge } from "@/components/claims/ClaimStatusBadge";
import { cn } from "@/lib/utils";

type ClaimTableProps = {
  claims: ClaimRow[];
};

async function handleDelete(formData: FormData) {
  "use server";
  const id = formData.get("claimId");
  if (typeof id !== "string") return;
  await deleteClaimAction(id);
}

export function ClaimTable({ claims }: ClaimTableProps) {
  if (!claims.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No claims filed yet. Start by creating a new claim to populate this list.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Claim #</th>
            <th className="px-4 py-3">Policy</th>
            <th className="px-4 py-3">Incident</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id} className="border-t border-slate-100 transition hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-700">
                {claim.claim_number}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {claim.policy_id}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(claim.incident_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-slate-700">
                ₹{claim.claim_amount?.toLocaleString() ?? "0"}
              </td>
              <td className="px-4 py-3">
                <ClaimStatusBadge status={claim.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/claims/${claim.id}`}
                    className={cn(
                      "inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300",
                    )}
                  >
                    View
                  </Link>
                  <form action={handleDelete} className="inline">
                    <input type="hidden" name="claimId" value={claim.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-400"
                    >
                      Archive
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
