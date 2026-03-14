import Link from "next/link";
import type { DocumentRow } from "@/lib/actions/documents";
import { deleteDocumentAction } from "@/lib/actions/documents";
import { cn } from "@/lib/utils";

type Props = {
  documents: DocumentRow[];
};

async function handleDelete(formData: FormData) {
  "use server";
  const id = formData.get("documentId");
  if (typeof id !== "string") return;
  await deleteDocumentAction(id);
}

export function DocumentTable({ documents }: Props) {
  if (!documents.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No documents uploaded yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Linked to</th>
            <th className="px-4 py-3">Uploaded</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-700">
                <Link
                  href={doc.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-600"
                >
                  {doc.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">{doc.type}</td>
              <td className="px-4 py-3 text-slate-600">
                {[doc.client_id, doc.policy_id, doc.claim_id, doc.quote_id]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(doc.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300",
                    )}
                  >
                    Download
                  </Link>
                  <form action={handleDelete} className="inline">
                    <input type="hidden" name="documentId" value={doc.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-400"
                    >
                      Delete
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
