import { CertificateForm } from "@/components/certificates/CertificateForm";
import { CertificateTable } from "@/components/certificates/CertificateTable";
import { fetchCertificates } from "@/lib/actions/certificates";

export default async function CertificatesPage() {
  const certificates = await fetchCertificates(20);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-slate-500">Certificates</p>
        <h1 className="text-3xl font-semibold text-slate-900">Certificate registry</h1>
        <p className="text-sm text-slate-500">
          Issue, download, and revoke COIs plus other coverage certificates for clients.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          <CertificateTable certificates={certificates} />
        </div>
        <CertificateForm />
      </div>
    </section>
  );
}
