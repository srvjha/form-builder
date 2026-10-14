"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  [
    "bg-[var(--bg-panel)] border border-[var(--border-color)]",
    "rounded-xl shadow-soft-sm",
  ],
  {
    variants: {
      interactive: {
        true: [
          "cursor-pointer",
          "transition-[box-shadow,transform,border-color] duration-200",
          "hover:-translate-y-0.5 hover:shadow-soft-md hover:border-[var(--border-muted)]",
          "active:translate-y-0 active:shadow-soft-sm",
        ],
        false: "",
      },
      accent: {
        red:    "accent-strip-left",
        yellow: "yellow-strip-left",
        green:  "green-strip-left",
        none:   "",
      },
      shadow: {
        none: "",
        sm:   "shadow-soft-sm",
        md:   "shadow-soft-md",
        lg:   "shadow-soft-lg",
      },
    },
    defaultVariants: {
      interactive: false,
      accent: "none",
      shadow: "sm",
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asMotion?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, accent, shadow, asMotion, ...props }, ref) => {
    const classes = cn(cardVariants({ interactive, accent, shadow }), className);

    if (asMotion) {
      return (
        <motion.div
          ref={ref as React.Ref<HTMLDivElement>}
          className={classes}
          whileHover={interactive ? { x: 2, y: 2 } : undefined}
          whileTap={interactive ? { x: 4, y: 4 } : undefined}
          transition={{ duration: 0.1 }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        />
      );
    }

    return <div ref={ref} className={classes} {...props} />;
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-base font-bold tracking-wide leading-none", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center border-t border-[var(--border-color)] px-6 py-4",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
