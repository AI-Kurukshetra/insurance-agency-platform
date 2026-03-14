"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PolicyBreakdown } from "@/lib/actions/reports";

type ReportsChartProps = {
  data: PolicyBreakdown[];
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function ReportsChart({ data }: ReportsChartProps) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <p className="text-sm text-slate-500">No policy data available yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Policy breakdown</p>
          <h2 className="text-lg font-semibold text-slate-900">Line of business</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data.sort((a, b) => b.premium - a.premium)} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="line" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 11 }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => currencyFormatter.format(value)}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value, name) =>
              name === "premium"
                ? currencyFormatter.format(Number(value))
                : `${value}`
            }
          />
          <Legend verticalAlign="top" height={36} />
          <Bar yAxisId="left" dataKey="count" name="Policies" fill="#2563EB" radius={[6, 6, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="premium" name="Premium" stroke="#10B981" strokeWidth={3} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
