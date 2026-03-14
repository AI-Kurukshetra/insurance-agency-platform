import { fetchPolicies } from "@/lib/actions/policies";
import { CreatePolicyForm } from "@/components/policies/CreatePolicyForm";
import { PolicyTable } from "@/components/policies/PolicyTable";

export default async function PoliciesPage() {
  const policies = await fetchPolicies(10);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Policies</p>
          <h1 className="text-3xl font-semibold text-slate-900">Policy tracker</h1>
        </div>
        <button
          type="button"
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          + New Policy
        </button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          <PolicyTable policies={policies} />
        </div>
        <CreatePolicyForm />
      </div>
    </section>
  );
}
