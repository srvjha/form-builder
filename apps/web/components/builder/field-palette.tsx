"use client";

import { nanoid } from "nanoid";
import { toast } from "sonner";
import {
  Type, AlignLeft, Mail, Hash, Phone, Link2,
  Calendar, Clock, ChevronDown, CheckSquare, Check,
  Star, Sliders, Upload, Lock,
} from "lucide-react";
import type { FieldType, BuilderField } from "@/stores/builder-store";
import { useBuilderStore, DEFAULT_MAX_FIELDS } from "@/stores/builder-store";
import { cn } from "@/lib/utils";

const FIELD_DEFS: { type: FieldType; label: string; icon: React.ElementType; color: string }[] = [
  { type: "short_text",   label: "Short Text",    icon: Type,         color: "#2563EB" },
  { type: "long_text",    label: "Long Text",     icon: AlignLeft,    color: "#2563EB" },
  { type: "email",        label: "Email",         icon: Mail,         color: "#0EA5E9" },
  { type: "number",       label: "Number",        icon: Hash,         color: "#0EA5E9" },
  { type: "phone",        label: "Phone",         icon: Phone,        color: "#0EA5E9" },
  { type: "url",          label: "URL",           icon: Link2,        color: "#0EA5E9" },
  { type: "date",         label: "Date",          icon: Calendar,     color: "#64748B" },
  { type: "time",         label: "Time",          icon: Clock,        color: "#64748B" },
  { type: "select",       label: "Single Select", icon: ChevronDown,  color: "#10B981" },
  { type: "multi_select", label: "Multi Select",  icon: CheckSquare,  color: "#10B981" },
  { type: "checkbox",     label: "Checkbox",      icon: Check,        color: "#10B981" },
  { type: "rating",       label: "Rating",        icon: Star,         color: "#0369A1" },
  { type: "scale",        label: "Scale / NPS",   icon: Sliders,      color: "#0369A1" },
  { type: "file_upload",  label: "File Upload",   icon: Upload,       color: "#94A3B8" },
];

export function makeDefaultField(type: FieldType): Omit<BuilderField, "order"> {
  const base: Omit<BuilderField, "order"> = {
    id:          nanoid(),
    type,
    label:       FIELD_DEFS.find((f) => f.type === type)?.label ?? type,
    required:    false,
    validations: {},
  };
  if (type === "select" || type === "multi_select") {
    base.options = [
      { value: "option_1", label: "Option 1" },
      { value: "option_2", label: "Option 2" },
    ];
  }
  if (type === "rating")  { base.minValue = 1; base.maxValue = 5; }
  if (type === "scale")   { base.minValue = 1; base.maxValue = 10; base.minLabel = "Not likely"; base.maxLabel = "Very likely"; }
  return base;
}

interface FieldPaletteProps {
  /** When provided, the parent handles both the store update AND the DB mutation. */
  onAdd?: (field: Omit<BuilderField, "order">) => void;
}

export function FieldPalette({ onAdd }: FieldPaletteProps) {
  const addField   = useBuilderStore((s) => s.addField);
  const fieldCount = useBuilderStore((s) => s.fields.length);
  const maxFields  = useBuilderStore((s) => s.form.settings.maxFields ?? DEFAULT_MAX_FIELDS);

  const isFull    = fieldCount >= maxFields;
  const remaining = maxFields - fieldCount;
  // warning threshold: last 3 remaining
  const isWarning = !isFull && remaining <= 3;

  function handleAdd(type: FieldType) {
    if (isFull) {
      toast.error(`Field limit reached (${maxFields}). Remove a field or raise the limit in Settings.`);
      return;
    }
    const field = makeDefaultField(type);
    if (onAdd) {
      onAdd(field); // parent handles store + DB mutation
    } else {
      // Fallback: store only (e.g. in preview/storybook)
      addField(field);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header with live counter */}
      <div className="border-b border-[var(--border-color)] px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="label-overline">Add field</p>
          <span
            className={cn(
              "font-mono text-[10px] font-bold px-1.5 py-0.5 border",
              isFull
                ? "border-[var(--color-red)] bg-[var(--color-red)]/10 text-[var(--color-red)]"
                : isWarning
                  ? "border-[var(--color-yellow)]/40 bg-[var(--color-yellow)]/10 text-[var(--color-yellow)]"
                  : "border-[var(--border-muted)] bg-[var(--bg-inset)] text-[var(--text-muted)]",
            )}
          >
            {fieldCount}/{maxFields}
          </span>
        </div>

        {/* Limit reached banner */}
        {isFull && (
          <div className="mt-2 flex items-center gap-1.5 border border-[var(--color-red)] bg-[var(--color-red)]/10 px-2 py-1.5">
            <Lock className="h-3 w-3 text-[var(--color-red)] shrink-0" />
            <p className="font-mono text-[10px] text-[var(--color-red)] leading-tight">
              Limit reached. Remove a field or update the limit in Settings.
            </p>
          </div>
        )}

        {/* Warning when almost full */}
        {isWarning && (
          <p className="mt-1.5 text-[10px] text-[var(--text-muted)]">
            {remaining} field{remaining !== 1 ? "s" : ""} remaining.
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-1 gap-1.5">
          {FIELD_DEFS.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => handleAdd(type)}
              disabled={isFull}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] px-3 py-2.5 text-left shadow-soft-xs transition-all duration-150",
                isFull
                  ? "cursor-not-allowed opacity-40"
                  : "hover:border-[var(--border-muted)] hover:bg-[var(--bg-inset)] hover:shadow-soft-sm active:scale-[0.99]",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                  isFull && "grayscale",
                )}
                style={{ background: isFull ? undefined : color }}
              >
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-display text-xs font-semibold tracking-wide">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
