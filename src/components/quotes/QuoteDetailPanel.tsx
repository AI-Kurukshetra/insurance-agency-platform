import { QuoteRow } from "@/lib/actions/quotes";
import { QuoteStatusBadge } from "@/components/quotes/QuoteStatusBadge";
import { formatDate } from "@/lib/utils";

type Props = {
  quote: QuoteRow;
};

export function QuoteDetailPanel({ quote }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quote</p>
          <h1 className="text-2xl font-semibold text-slate-900">{quote.quote_number}</h1>
          <p className="text-sm text-slate-500">{quote.line_of_business}</p>
        </div>
        <QuoteStatusBadge status={quote.status} />
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Valid until</dt>
          <dd className="text-sm font-semibold text-slate-900">
            {formatDate(quote.valid_until)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Premium</dt>
          <dd className="text-sm text-slate-700">₹{quote.premium?.toLocaleString() ?? "0"}</dd>
        </div>
        {quote.coverage_limit ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Coverage</dt>
            <dd className="text-sm text-slate-700">₹{quote.coverage_limit.toLocaleString()}</dd>
          </div>
        ) : null}
        {quote.deductible ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Deductible</dt>
            <dd className="text-sm text-slate-700">₹{quote.deductible.toLocaleString()}</dd>
          </div>
        ) : null}
      </dl>

      {quote.notes ? (
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Notes</p>
          <p className="text-sm text-slate-700">{quote.notes}</p>
        </div>
      ) : null}
    </div>
  );
}
