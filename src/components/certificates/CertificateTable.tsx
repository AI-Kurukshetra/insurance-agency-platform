import Link from "next/link";
import { deleteCertificateAction, type CertificateRow } from "@/lib/actions/certificates";
import { CertificateStatusBadge } from "@/components/certificates/CertificateStatusBadge";
import { cn } from "@/lib/utils";

type Props = {
  certificates: CertificateRow[];
};

async function handleDelete(formData: FormData) {
  "use server";
  const id = formData.get("certificateId");
  if (typeof id !== "string") return;
  await deleteCertificateAction(id);
}

export function CertificateTable({ certificates }: Props) {
  if (!certificates.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No certificates yet. Issue one to start tracking coverage.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Certificate #</th>
            <th className="px-4 py-3">Holder</th>
            <th className="px-4 py-3">Valid</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert) => (
            <tr key={cert.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-700">{cert.certificate_number}</td>
              <td className="px-4 py-3 text-slate-600">{cert.holder_name}</td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(cert.issued_date).toLocaleDateString()} — {new Date(cert.expiry_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <CertificateStatusBadge status={cert.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                {cert.file_url ? (
                  <Link
                    href={cert.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300",
                    )}
                  >
                    Download
                  </Link>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                    No file
                  </span>
                )}
                  <form action={handleDelete} className="inline">
                    <input type="hidden" name="certificateId" value={cert.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-400"
                    >
                      Revoke
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
