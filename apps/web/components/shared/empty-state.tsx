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
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-color)]",
        "bg-[var(--bg-panel)] px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-inset)]">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)]">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
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
