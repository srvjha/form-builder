"use client";

import { nanoid } from "nanoid";
import { useState } from "react";
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
  const settings   = useBuilderStore((s) => s.form.settings);
  const setForm    = useBuilderStore((s) => s.setForm);

  /* Raise the limit right here; autosave persists it (the server allows up to 100) */
  const HARD_MAX = 100;
  function setLimit(next: number) {
    setForm({ settings: { ...settings, maxFields: next } });
    toast.success(`Field limit set to ${next}`);
  }
  function raiseLimit(by: number) {
    setLimit(Math.min(HARD_MAX, maxFields + by));
  }

  /* Custom limit: any whole number from the current field count up to the server maximum */
  const [customLimit, setCustomLimit] = useState("");
  const customValue = Number(customLimit);
  const customValid =
    customLimit.trim() !== "" && Number.isInteger(customValue) && customValue > maxFields && customValue <= HARD_MAX;
  function applyCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!customValid) return;
    setLimit(customValue);
    setCustomLimit("");
  }

  const isFull    = fieldCount >= maxFields;
  const remaining = maxFields - fieldCount;
  // warning threshold: last 3 remaining
  const isWarning = !isFull && remaining <= 3;

  function handleAdd(type: FieldType) {
    if (isFull) {
      toast.error(`Field limit reached (${maxFields}). Raise it in the panel on the left.`);
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

      {isFull ? (
        <div className="mx-3 mb-3 shrink-0 rounded-lg bg-[var(--bg-inset)] p-3">
          <p className="text-xs leading-snug text-[var(--text-primary)]">
            {maxFields >= HARD_MAX
              ? `You've used all ${HARD_MAX} fields, the most a form can hold.`
              : `You've used all ${maxFields} fields. Raise the limit to keep adding.`}
          </p>
          {maxFields < HARD_MAX && (
            <div className="mt-2.5 flex gap-2">
              {[...new Set([5, 10].map((n) => Math.min(n, HARD_MAX - maxFields)))].map((by) => (
                <button
                  key={by}
                  type="button"
                  onClick={() => raiseLimit(by)}
                  className="inline-flex h-8 flex-1 items-center justify-center rounded-md bg-[var(--color-action)] text-xs font-medium text-white transition-[transform,background-color] hover:bg-[var(--color-action-hover)] active:scale-[0.97]"
                >
                  +{by} fields
                </button>
              ))}
            </div>
          )}
          {maxFields < HARD_MAX && (
            <form onSubmit={applyCustom} className="mt-2 flex gap-2">
              <label htmlFor="custom-field-limit" className="sr-only">
                Custom field limit
              </label>
              <input
                id="custom-field-limit"
                type="number"
                inputMode="numeric"
                min={maxFields + 1}
                max={HARD_MAX}
                step={1}
                value={customLimit}
                onChange={(e) => setCustomLimit(e.target.value)}
                placeholder={`Custom, up to ${HARD_MAX}`}
                className="h-8 min-w-0 flex-1 rounded-md bg-[var(--bg-panel)] px-2.5 text-xs text-[var(--text-primary)] ring-1 ring-[var(--border-color)] outline-none placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              <button
                type="submit"
                disabled={!customValid}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md px-3 text-xs font-medium text-[var(--text-primary)] ring-1 ring-[var(--border-color)] transition-colors hover:bg-[var(--bg-panel)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Set
              </button>
            </form>
          )}
          {customLimit.trim() !== "" && !customValid && (
            <p className="mt-1.5 text-[11px] text-[var(--text-secondary)]">
              Enter a whole number from {maxFields + 1} to {HARD_MAX}.
            </p>
          )}
        </div>
      ) : isWarning ? (
        <p className="shrink-0 px-4 pb-2 text-xs leading-snug text-[var(--text-secondary)]">
          {`${remaining} field${remaining !== 1 ? "s" : ""} left.`}
        </p>
      ) : null}

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
