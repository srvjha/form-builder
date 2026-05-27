"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?:        React.ReactNode;
  title:        string;
  description?: string;
  action?:      { label: string; onClick: () => void };
  className?:   string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-8 text-center",
        "border-2 border-dashed border-[var(--border-muted)] bg-[var(--bg-panel)]",
        className,
      )}
    >
      {icon && (
        <div className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-[var(--border-color)] bg-[var(--bg-inset)]">
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-[var(--text-primary)]">
        {title}
      </h3>
      {description && (
        <p className="mt-3 max-w-sm text-sm text-[var(--text-muted)] leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <Button className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
