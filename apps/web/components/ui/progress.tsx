"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  label?: string;
  showPercent?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, label, showPercent, ...props }, ref) => (
  <div className="w-full space-y-1.5">
    {(label || showPercent) && (
      <div className="flex items-center justify-between">
        {label && (
          <span className="text-sm text-[var(--text-secondary)]">
            {label}
          </span>
        )}
        {showPercent && (
          <span className="text-sm font-medium tabular-nums text-[var(--text-primary)]">
            {value ?? 0}%
          </span>
        )}
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        "bg-[var(--bg-inset)]",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator asChild>
        <motion.div
          className="h-full rounded-full bg-[var(--color-action)]"
          initial={{ width: 0 }}
          animate={{ width: `${value ?? 0}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
