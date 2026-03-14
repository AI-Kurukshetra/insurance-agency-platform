type ReportSummaryCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export function ReportSummaryCard({ label, value, helper }: ReportSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}
