import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Pills are neutral unless something is live. Blue marks active / published;
   every other status reads as a quieter neutral, so one hue carries meaning. */
const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 px-2.5 h-6",
    "font-sans text-xs font-medium",
    "border rounded-full",
    "whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        default:   "bg-[var(--bg-inset)] text-[var(--text-secondary)] border-transparent",
        published: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-transparent",
        draft:     "bg-[var(--bg-inset)] text-[var(--text-secondary)] border-transparent",
        closed:    "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)]",
        archived:  "bg-transparent text-[var(--text-muted)] border-[var(--border-muted)]",
        accent:    "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-transparent",
        outline:   "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)]",
        muted:     "bg-[var(--bg-inset)] text-[var(--text-muted)] border-transparent",
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
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current"
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
