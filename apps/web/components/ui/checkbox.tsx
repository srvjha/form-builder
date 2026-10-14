"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-[18px] w-[18px] shrink-0 cursor-pointer rounded-[5px] border border-[var(--border-color)]",
      "bg-[var(--bg-panel)]",
      "transition-colors duration-150",
      "hover:border-[var(--color-accent)]",
      "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-accent)]/25 focus-visible:border-[var(--color-accent)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[var(--color-action)] data-[state=checked]:border-[var(--color-action)]",
      "data-[state=indeterminate]:bg-[var(--color-action)] data-[state=indeterminate]:border-[var(--color-action)]",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
      <Check className="h-3 w-3 stroke-[3.5]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
