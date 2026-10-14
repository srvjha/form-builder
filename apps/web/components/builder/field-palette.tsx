"use client";

import { nanoid } from "nanoid";
import { toast } from "sonner";
import {
  Type, AlignLeft, Mail, Hash, Phone, Link2,
  Calendar, Clock, ChevronDown, CheckSquare, Check,
  Star, Sliders, Upload, Plus,
} from "lucide-react";
import type { FieldType, BuilderField } from "@/stores/builder-store";
import { useBuilderStore, DEFAULT_MAX_FIELDS } from "@/stores/builder-store";
import { cn } from "@/lib/utils";

const FIELD_DEFS: { type: FieldType; label: string; icon: React.ElementType }[] = [
  { type: "short_text",   label: "Short text",    icon: Type        },
  { type: "long_text",    label: "Long text",     icon: AlignLeft   },
  { type: "email",        label: "Email",         icon: Mail        },
  { type: "number",       label: "Number",        icon: Hash        },
  { type: "phone",        label: "Phone",         icon: Phone       },
  { type: "url",          label: "URL",           icon: Link2       },
  { type: "date",         label: "Date",          icon: Calendar    },
  { type: "time",         label: "Time",          icon: Clock       },
  { type: "select",       label: "Single select", icon: ChevronDown },
  { type: "multi_select", label: "Multi select",  icon: CheckSquare },
  { type: "checkbox",     label: "Checkbox",      icon: Check       },
  { type: "rating",       label: "Rating",        icon: Star        },
  { type: "scale",        label: "Scale / NPS",   icon: Sliders     },
  { type: "file_upload",  label: "File upload",   icon: Upload      },
];

/** Display name + icon for a field type (used by the canvas card header). */
export function getFieldDef(type: FieldType) {
  return FIELD_DEFS.find((f) => f.type === type) ?? { type, label: type, icon: Type };
}

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
    <div className="flex h-full flex-col">
      {/* Header with live counter */}
      <div className="flex shrink-0 items-baseline justify-between gap-3 px-4 pb-2 pt-3 md:pt-4">
        <h2 className="font-sans text-[13px] font-semibold leading-tight tracking-normal text-[var(--text-primary)]">
          Add a field
        </h2>
        <span
          className={cn(
            "text-xs tabular-nums",
            isFull ? "font-medium text-[var(--color-red)]" : "text-[var(--text-muted)]",
          )}
          title={`${fieldCount} of ${maxFields} fields used`}
        >
          {fieldCount} of {maxFields}
        </span>
      </div>

      {(isFull || isWarning) && (
        <p
          className={cn(
            "shrink-0 px-4 pb-2 text-xs leading-snug",
            isFull ? "text-[var(--color-red)]" : "text-[var(--text-secondary)]",
          )}
        >
          {isFull
            ? "Limit reached. Remove a field or raise the limit in Settings."
            : `${remaining} field${remaining !== 1 ? "s" : ""} left.`}
        </p>
      )}

      {/* Types: a horizontal strip on phones, a plain list from md up */}
      <ul
        className="flex min-h-0 flex-1 gap-1.5 overflow-x-auto px-3 pb-3 md:flex-col md:gap-0.5 md:overflow-y-auto md:overflow-x-hidden md:px-2"
        aria-label="Field types"
      >
        {FIELD_DEFS.map(({ type, label, icon: Icon }) => (
          <li key={type} className="shrink-0">
            <button
              type="button"
              onClick={() => handleAdd(type)}
              disabled={isFull}
              className={cn(
                "group flex w-full items-center gap-2.5 whitespace-nowrap rounded-md text-left text-sm text-[var(--text-primary)] transition-colors",
                "border border-[var(--border-color)] bg-[var(--bg-panel)] px-3 py-1.5",
                "md:border-transparent md:bg-transparent md:px-2.5 md:py-2",
                isFull
                  ? "cursor-not-allowed opacity-40"
                  : "hover:bg-[var(--bg-inset)] md:hover:bg-[var(--bg-inset)]",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-primary)]" />
              <span className="flex-1">{label}</span>
              <Plus
                className="hidden h-3.5 w-3.5 shrink-0 text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
