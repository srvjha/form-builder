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
  { type: "short_text",   label: "Short Text",    icon: Type,         color: "#FF3B00" },
  { type: "long_text",    label: "Long Text",     icon: AlignLeft,    color: "#FF3B00" },
  { type: "email",        label: "Email",         icon: Mail,         color: "#0066CC" },
  { type: "number",       label: "Number",        icon: Hash,         color: "#0066CC" },
  { type: "phone",        label: "Phone",         icon: Phone,        color: "#0066CC" },
  { type: "url",          label: "URL",           icon: Link2,        color: "#0066CC" },
  { type: "date",         label: "Date",          icon: Calendar,     color: "#7B2FBE" },
  { type: "time",         label: "Time",          icon: Clock,        color: "#7B2FBE" },
  { type: "select",       label: "Single Select", icon: ChevronDown,  color: "#00C853" },
  { type: "multi_select", label: "Multi Select",  icon: CheckSquare,  color: "#00C853" },
  { type: "checkbox",     label: "Checkbox",      icon: Check,        color: "#00C853" },
  { type: "rating",       label: "Rating",        icon: Star,         color: "#FFD600" },
  { type: "scale",        label: "Scale / NPS",   icon: Sliders,      color: "#FFD600" },
  { type: "file_upload",  label: "File Upload",   icon: Upload,       color: "#888"   },
];

function makeDefaultField(type: FieldType): Omit<BuilderField, "order"> {
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

export function FieldPalette() {
  const addField   = useBuilderStore((s) => s.addField);
  const fieldCount = useBuilderStore((s) => s.fields.length);
  const maxFields  = useBuilderStore((s) => s.form.settings.maxFields ?? DEFAULT_MAX_FIELDS);

  const isFull    = fieldCount >= maxFields;
  const remaining = maxFields - fieldCount;
  // warning threshold: last 3 remaining
  const isWarning = !isFull && remaining <= 3;

  function handleAdd(type: FieldType) {
    const added = addField(makeDefaultField(type));
    if (!added) {
      toast.error(`Field limit reached (${maxFields}). Remove a field or raise the limit in Settings.`);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header with live counter */}
      <div className="border-b-2 border-[#0A0A0A] px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="label-overline">Add field</p>
          <span
            className={cn(
              "font-mono text-[10px] font-bold px-1.5 py-0.5 border",
              isFull
                ? "border-[var(--color-red)] bg-[var(--color-red)]/10 text-[var(--color-red)]"
                : isWarning
                  ? "border-[var(--color-yellow)] bg-[var(--color-yellow)]/10 text-[#78350F]"
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
          <p className="mt-1.5 font-mono text-[10px] text-[#92400E]">
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
                "flex items-center gap-3 border-2 border-[#0A0A0A] bg-[var(--bg-panel)] px-3 py-2.5 text-left transition-all",
                isFull
                  ? "cursor-not-allowed opacity-40"
                  : "shadow-[2px_2px_0_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center border-2 border-[#0A0A0A]",
                  isFull && "grayscale",
                )}
                style={{ background: isFull ? undefined : color }}
              >
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-display text-xs font-extrabold uppercase tracking-wide">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
