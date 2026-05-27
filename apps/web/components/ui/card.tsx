"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  [
    "bg-[var(--bg-panel)] border-2 border-[var(--border-color)]",
    "rounded-none",
  ],
  {
    variants: {
      interactive: {
        true: [
          "cursor-pointer",
          "shadow-brut-md",
          "transition-all duration-100",
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brut-xs",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
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
        sm:   "shadow-brut-sm",
        md:   "shadow-brut-md",
        lg:   "shadow-brut-lg",
      },
    },
    defaultVariants: {
      interactive: false,
      accent: "none",
      shadow: "md",
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
        "flex items-center justify-between px-6 py-4 border-b-2 border-[var(--border-color)]",
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
      className={cn("text-base font-bold uppercase tracking-wide leading-none", className)}
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
        "flex items-center border-t-2 border-[var(--border-color)] px-6 py-4",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
