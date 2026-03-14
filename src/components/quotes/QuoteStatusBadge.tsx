import type { z } from "zod";
import { quoteStatusEnum } from "@/lib/validations/quote";
import { cn } from "@/lib/utils";

const statusStyles: Record<z.infer<typeof quoteStatusEnum>, string> = {
  draft: "bg-slate-100 text-slate-700",
  sent: "bg-blue-50 text-blue-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  expired: "bg-amber-50 text-amber-700",
  bound: "bg-purple-50 text-purple-700",
};

type Props = {
  status: z.infer<typeof quoteStatusEnum>;
};

export function QuoteStatusBadge({ status }: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
}
