"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: uppercase, bold, tracking, no radius, transition
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-xs font-bold uppercase tracking-wider",
    "border-2 cursor-pointer select-none",
    "transition-all duration-100 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
    "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    "rounded-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--color-accent)] text-[var(--color-white)] border-[var(--border-color)]",
          "shadow-brut-md",
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brut-xs",
        ],
        secondary: [
          "bg-[var(--bg-panel)] text-[var(--text-primary)] border-[var(--border-color)]",
          "shadow-brut-md",
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brut-xs",
        ],
        ghost: [
          "bg-transparent text-[var(--text-primary)] border-transparent shadow-none",
          "hover:bg-[var(--bg-inset)] hover:border-[var(--border-muted)]",
        ],
        danger: [
          "bg-[var(--color-red)] text-white border-[var(--border-color)]",
          "shadow-brut-md",
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brut-xs",
        ],
        outline: [
          "bg-transparent text-[var(--text-primary)] border-[var(--border-color)] shadow-none",
          "hover:bg-[var(--bg-inset)]",
        ],
        yellow: [
          "bg-[var(--color-yellow)] text-[var(--color-black)] border-[var(--border-color)]",
          "shadow-brut-md",
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brut-xs",
        ],
      },
      size: {
        sm: "h-8 px-3 text-[11px]",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-sm",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

function LoadingSpinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      className="inline-block h-3 w-3 rounded-full border-2 border-current border-t-transparent"
      aria-hidden
    />
  );
}

export { Button, buttonVariants };
