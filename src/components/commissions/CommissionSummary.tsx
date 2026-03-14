import { cn } from "@/lib/utils";

type CommissionSummaryResult = {
  total: number;
  pending: number;
  paid: number;
};

type CommissionSummaryProps = {
  summary: CommissionSummaryResult;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value ?? 0);
}

const cards = [
  {
    key: "total",
    label: "Total commissions",
    helper: "All tracked policies",
    accent: "border-slate-200 bg-white",
  },
  {
    key: "pending",
    label: "Pending payouts",
    helper: "Awaiting carrier payment",
    accent: "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    key: "paid",
    label: "Paid",
    helper: "Settled commissions",
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
];

export function CommissionSummary({ summary }: CommissionSummaryProps) {
  const entries = [
    { ...cards[0], value: summary.total },
    { ...cards[1], value: summary.pending },
    { ...cards[2], value: summary.paid },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {entries.map((entry) => (
        <div
          key={entry.key}
          className={cn(
            "rounded-2xl border px-5 py-5 shadow-sm",
            entry.accent,
            "space-y-1",
          )}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            {entry.label}
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatCurrency(entry.value)}
          </p>
          <p className="text-xs text-slate-500">{entry.helper}</p>
        </div>
      ))}
    </div>
  );
}
