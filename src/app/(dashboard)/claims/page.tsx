import { ClaimTable } from "@/components/claims/ClaimTable";
import { CreateClaimForm } from "@/components/claims/CreateClaimForm";
import { fetchClaims } from "@/lib/actions/claims";

export default async function ClaimsPage() {
  const claims = await fetchClaims(15);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-slate-500">Claims</p>
        <h1 className="text-3xl font-semibold text-slate-900">Claims roundup</h1>
        <p className="text-sm text-slate-500">
          Track incident dates, claim amounts, and status updates in one place.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          <ClaimTable claims={claims} />
        </div>
        <CreateClaimForm />
      </div>
    </section>
  );
}
