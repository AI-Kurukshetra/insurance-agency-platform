import { z } from "zod";
import { CreateClientForm } from "@/components/clients/CreateClientForm";
import { ClientFilters } from "@/components/clients/ClientFilters";
import { ClientTable } from "@/components/clients/ClientTable";
import { clientStatusEnum, clientTypeEnum } from "@/lib/validations/client";
import { fetchClients } from "@/lib/actions/clients";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams?: { search?: string; type?: string; status?: string };
}) {
  const safeType =
    typeof searchParams?.type === "string" &&
    clientTypeEnum.safeParse(searchParams.type).success
      ? (searchParams.type as z.infer<typeof clientTypeEnum>)
      : undefined;
  const safeStatus =
    typeof searchParams?.status === "string" &&
    clientStatusEnum.safeParse(searchParams.status).success
      ? (searchParams.status as z.infer<typeof clientStatusEnum>)
      : undefined;

  const clients = await fetchClients({
    search: searchParams?.search,
    type: safeType,
    status: safeStatus,
  });

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Clients</p>
          <h1 className="text-3xl font-semibold text-slate-900">Client roster</h1>
        </div>
        <form className="flex w-full max-w-xs gap-2" action="/clients" method="get">
          <input
            type="text"
            name="search"
            defaultValue={searchParams?.search ?? ""}
            placeholder="Search clients"
            className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Search
          </button>
        </form>
      </header>

      <ClientFilters
        search={searchParams?.search}
        type={safeType}
        status={safeStatus}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          <ClientTable clients={clients} />
        </div>
        <CreateClientForm />
      </div>
    </section>
  );
}
