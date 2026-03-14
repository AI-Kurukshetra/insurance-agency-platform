import type { z } from "zod";
import { commissionStatusEnum } from "@/lib/validations/commission";
import { cn } from "@/lib/utils";

const statusStyles: Record<z.infer<typeof commissionStatusEnum>, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  voided: "bg-slate-100 text-slate-600",
};

type Props = {
  status: z.infer<typeof commissionStatusEnum>;
};

export function CommissionStatusBadge({ status }: Props) {
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
