import { fetchDocuments } from "@/lib/actions/documents";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { DocumentUploadForm } from "@/components/documents/DocumentUploadForm";

export default async function DocumentsPage() {
  const documents = await fetchDocuments(15);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-slate-500">Documents</p>
        <h1 className="text-3xl font-semibold text-slate-900">Document vault</h1>
        <p className="text-sm text-slate-500">
          Store and link certificates, policies, claims, and communication archives in one secure repository.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          <DocumentTable documents={documents} />
        </div>
        <DocumentUploadForm />
      </div>
    </section>
  );
}
