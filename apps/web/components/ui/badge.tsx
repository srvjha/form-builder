import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 px-2 h-6",
    "text-[11px] font-medium",
    "border rounded-full",
    "whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        default:   "bg-[var(--bg-inset)] text-[var(--text-primary)] border-[var(--border-muted)]",
        published: "bg-[var(--color-green)]/15 text-[var(--color-green)] border-[var(--color-green)]/25",
        draft:     "bg-[var(--color-yellow)]/15 text-[var(--color-yellow)] border-[var(--color-yellow)]/25",
        closed:    "bg-[var(--color-red)]/12 text-[var(--color-red)] border-[var(--color-red)]/25",
        archived:  "bg-[var(--bg-inset)] text-[var(--text-muted)] border-[var(--border-muted)]",
        accent:    "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-transparent",
        outline:   "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)]",
        muted:     "bg-[var(--bg-inset)] text-[var(--text-muted)] border-[var(--border-muted)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-current"
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
