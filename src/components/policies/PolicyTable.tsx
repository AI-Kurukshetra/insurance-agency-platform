import Link from "next/link";
import { PolicyRow } from "@/lib/actions/policies";
import { PolicyStatusBadge } from "@/components/policies/PolicyStatusBadge";
import { cn } from "@/lib/utils";

type Props = {
  policies: PolicyRow[];
};

export function PolicyTable({ policies }: Props) {
  if (!policies.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No policies yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Policy Number</th>
            <th className="px-4 py-3">Line</th>
            <th className="px-4 py-3">Effective</th>
            <th className="px-4 py-3">Expires</th>
            <th className="px-4 py-3">Premium</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-700">
                {policy.policy_number}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {policy.line_of_business}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(policy.effective_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(policy.expiration_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-slate-700">
                ₹{policy.premium ? policy.premium.toLocaleString() : "0"}
              </td>
              <td className="px-4 py-3">
                <PolicyStatusBadge status={policy.status} />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/policies/${policy.id}`}
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
