import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 px-2 h-6",
    "text-[11px] font-bold uppercase tracking-wider",
    "border-2 rounded-none",
    "whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        default:   "bg-[var(--bg-panel)]    text-[var(--text-primary)]    border-[var(--border-color)]",
        published: "bg-[var(--color-green)] text-[var(--color-black)]     border-[var(--border-color)]",
        draft:     "bg-[var(--color-yellow)] text-[var(--color-black)]    border-[var(--border-color)]",
        closed:    "bg-[var(--color-red)]   text-white                    border-[var(--border-color)]",
        archived:  "bg-[var(--bg-inset)]    text-[var(--text-muted)]      border-[var(--border-muted)]",
        accent:    "bg-[var(--color-accent)] text-[var(--color-white)]    border-[var(--border-color)]",
        outline:   "bg-transparent          text-[var(--text-primary)]    border-[var(--border-color)]",
        muted:     "bg-[var(--bg-inset)]    text-[var(--text-muted)]      border-[var(--border-muted)]",
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
