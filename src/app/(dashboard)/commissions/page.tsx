import { CommissionSummary } from "@/components/commissions/CommissionSummary";
import { CommissionTable } from "@/components/commissions/CommissionTable";
import {
  fetchCommissions,
  getCommissionSummary,
} from "@/lib/actions/commissions";

export default async function CommissionsPage() {
  const [summary, commissions] = await Promise.all([
    getCommissionSummary(),
    fetchCommissions(12),
  ]);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-slate-500">Commissions</p>
        <h1 className="text-3xl font-semibold text-slate-900">Payout tracker</h1>
        <p className="text-sm text-slate-500">
          Monitor payouts, follow up on pending approvals, and keep agents in the
          loop with real-time commission totals.
        </p>
      </header>

      <CommissionSummary summary={summary} />

      <div className="space-y-4">
        <CommissionTable commissions={commissions} />
      </div>
    </section>
  );
}
