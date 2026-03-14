import { ClientStatusBadge } from "@/components/clients/ClientStatusBadge";
import { type ClientRow } from "@/lib/actions/clients";
import { formatDate } from "@/lib/utils";

type Props = {
  client: ClientRow;
};

export function ClientDetailPanel({ client }: Props) {
  const displayName =
    client.type === "business"
      ? client.business_name
      : `${client.first_name} ${client.last_name}`;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Client</p>
          <h1 className="text-2xl font-semibold text-slate-900">{displayName}</h1>
          <p className="mt-1 text-sm text-slate-500">{client.client_id}</p>
        </div>
        <ClientStatusBadge status={client.status} />
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Type</dt>
          <dd className="text-sm font-semibold text-slate-900">{client.type}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</dt>
          <dd className="text-sm text-slate-700">{client.email}</dd>
        </div>
        {client.phone ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Phone</dt>
            <dd className="text-sm text-slate-700">{client.phone}</dd>
          </div>
        ) : null}
        {client.date_of_birth ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">DOB</dt>
            <dd className="text-sm text-slate-700">
              {formatDate(client.date_of_birth)}
            </dd>
          </div>
        ) : null}
      </dl>

      {(client.address || client.city || client.state || client.zip) && (
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Address
          </p>
          <p className="text-sm text-slate-700">{client.address}</p>
          <p className="text-sm text-slate-700">
            {[client.city, client.state, client.zip].filter(Boolean).join(", ")}
          </p>
        </div>
      )}

      {client.notes ? (
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Notes</p>
          <p className="text-sm text-slate-700">{client.notes}</p>
        </div>
      ) : null}
    </div>
  );
}
