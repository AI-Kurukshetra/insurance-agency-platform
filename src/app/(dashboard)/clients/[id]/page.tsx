import { ClientDetailPanel } from "@/components/clients/ClientDetailPanel";
import { EditClientForm } from "@/components/clients/EditClientForm";
import { getClientById } from "@/lib/actions/clients";

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await getClientById(params.id);
  if (!client) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-500">Client not found</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <ClientDetailPanel client={client} />
      <EditClientForm client={client} />
    </section>
  );
}
