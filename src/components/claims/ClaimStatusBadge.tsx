import type { z } from "zod";
import { claimStatusEnum } from "@/lib/validations/claim";
import { cn } from "@/lib/utils";

type Props = {
  status: z.infer<typeof claimStatusEnum>;
};

const statusStyles: Record<Props["status"], string> = {
  open: "bg-slate-100 text-slate-700",
  in_review: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  denied: "bg-red-50 text-red-700",
  closed: "bg-slate-200 text-slate-600",
  pending_info: "bg-violet-50 text-violet-700",
};

export function ClaimStatusBadge({ status }: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        statusStyles[status],
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
