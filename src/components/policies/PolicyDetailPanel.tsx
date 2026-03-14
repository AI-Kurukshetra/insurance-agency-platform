import { PolicyRow } from "@/lib/actions/policies";
import { PolicyStatusBadge } from "@/components/policies/PolicyStatusBadge";
import { formatDate } from "@/lib/utils";

type Props = {
  policy: PolicyRow;
};

export function PolicyDetailPanel({ policy }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Policy</p>
          <h1 className="text-2xl font-semibold text-slate-900">{policy.policy_number}</h1>
          <p className="text-sm text-slate-500">{policy.line_of_business}</p>
        </div>
        <PolicyStatusBadge status={policy.status} />
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Effective</dt>
          <dd className="text-sm font-semibold text-slate-900">{formatDate(policy.effective_date)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Expires</dt>
          <dd className="text-sm font-semibold text-slate-900">{formatDate(policy.expiration_date)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Premium</dt>
          <dd className="text-sm text-slate-700">
            ₹{policy.premium ? policy.premium.toLocaleString() : "0"}
          </dd>
        </div>
        {policy.coverage_limit ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Coverage</dt>
            <dd className="text-sm text-slate-700">₹{policy.coverage_limit.toLocaleString()}</dd>
          </div>
        ) : null}
        {policy.deductible ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Deductible</dt>
            <dd className="text-sm text-slate-700">₹{policy.deductible.toLocaleString()}</dd>
          </div>
        ) : null}
      </dl>

      {policy.description ? (
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Notes</p>
          <p className="text-sm text-slate-700">{policy.description}</p>
        </div>
      ) : null}
    </div>
  );
}
