"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* A solid panel on the dot ground. Flat at rest: the border does the
   separating; shadows are reserved for things that float. */
const cardVariants = cva(
  "bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl",
  {
    variants: {
      interactive: {
        true: [
          "cursor-pointer",
          "transition-colors duration-150",
          "hover:border-[var(--color-accent)]",
          "focus-visible:outline-none focus-visible:border-[var(--color-accent)]",
        ],
        false: "",
      },
      accent: {
        blue: "border-l-4 border-l-[var(--color-accent)]",
        none: "",
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
      shadow: "none",
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
        "flex items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border-muted)]",
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
      className={cn("font-sans text-[15px] font-semibold leading-snug text-[var(--text-primary)]", className)}
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
        "flex items-center gap-3 border-t border-[var(--border-muted)] px-6 py-4",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
