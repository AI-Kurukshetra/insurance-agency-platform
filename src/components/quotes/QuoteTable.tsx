import Link from "next/link";
import { QuoteStatusBadge } from "@/components/quotes/QuoteStatusBadge";
import { QuoteRow } from "@/lib/actions/quotes";
import { cn } from "@/lib/utils";

type Props = {
  quotes: QuoteRow[];
};

export function QuoteTable({ quotes }: Props) {
  if (!quotes.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No quotes yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Quote Number</th>
            <th className="px-4 py-3">Line</th>
            <th className="px-4 py-3">Valid Until</th>
            <th className="px-4 py-3">Premium</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-700">
                {quote.quote_number}
              </td>
              <td className="px-4 py-3 text-slate-600">{quote.line_of_business}</td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(quote.valid_until).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-slate-700">
                ₹{quote.premium ? quote.premium.toLocaleString() : "0"}
              </td>
              <td className="px-4 py-3">
                <QuoteStatusBadge status={quote.status} />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/quotes/${quote.id}`}
                  className={cn(
                    "inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300",
                  )}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
