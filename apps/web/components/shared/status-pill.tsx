import { FORM_STATUS_COLORS, FORM_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Status = keyof typeof FORM_STATUS_COLORS;

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const c = FORM_STATUS_COLORS[status as Status];
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-px text-xs font-medium",
        c?.bg,
        c?.text,
        c?.border,
        className,
      )}
    >
      {FORM_STATUS_LABELS[status as Status] ?? status}
    </span>
  );
}
