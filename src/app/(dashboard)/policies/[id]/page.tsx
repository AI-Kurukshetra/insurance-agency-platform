import { PolicyDetailPanel } from "@/components/policies/PolicyDetailPanel";
import { EditPolicyForm } from "@/components/policies/EditPolicyForm";
import { getPolicyById } from "@/lib/actions/policies";

export default async function PolicyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const policy = await getPolicyById(params.id);
  if (!policy) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-500">Policy not found</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PolicyDetailPanel policy={policy} />
      <EditPolicyForm policy={policy} />
    </section>
  );
}
