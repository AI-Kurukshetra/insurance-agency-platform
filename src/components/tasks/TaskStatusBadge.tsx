import type { z } from "zod";
import { taskStatusEnum } from "@/lib/validations/task";
import { cn } from "@/lib/utils";

type Props = {
  status: z.infer<typeof taskStatusEnum>;
};

const statusStyles: Record<Props["status"], string> = {
  open: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-600",
};

export function TaskStatusBadge({ status }: Props) {
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        statusStyles[status],
      )}
    >
      {label}
    </span>
  );
}
