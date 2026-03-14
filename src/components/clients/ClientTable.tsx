import Link from "next/link";
import { Eye, Pen, Trash2 } from "lucide-react";
import { deleteClientAction, type ClientRow } from "@/lib/actions/clients";
import { ClientStatusBadge } from "@/components/clients/ClientStatusBadge";
import { cn } from "@/lib/utils";

type ClientTableProps = {
  clients: ClientRow[];
};

async function handleDelete(formData: FormData) {
  "use server";
  const id = formData.get("clientId");
  if (typeof id !== "string") return;
  await deleteClientAction(id);
}

export function ClientTable({ clients }: ClientTableProps) {
  if (!clients.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No clients yet. Add a new account above to see it listed here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Client ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              className="border-t border-slate-100 transition hover:bg-slate-50"
            >
              <td className="px-4 py-3 font-medium text-slate-700">
                {client.client_id}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {client.type === "business"
                  ? client.business_name
                  : `${client.first_name} ${client.last_name}`}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                    client.type === "business"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-emerald-50 text-emerald-700",
                  )}
                >
                  {client.type}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{client.email}</td>
              <td className="px-4 py-3">
                <ClientStatusBadge status={client.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/clients/${client.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300"
                    aria-label="View client"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/clients/${client.id}#edit`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300"
                    aria-label="Edit client"
                  >
                    <Pen className="h-4 w-4" />
                  </Link>
                  <form action={handleDelete} className="inline">
                    <input type="hidden" name="clientId" value={client.id} />
                    <button
                      type="submit"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300"
                      aria-label="Delete client"
                    >
                      <Trash2 className="h-4 w-4" />
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
