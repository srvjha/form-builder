"use client";

import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label }    from "@/components/ui/label";
import { cn }       from "@/lib/utils";
import type { FieldType } from "@/stores/builder-store";

export interface FieldOption { value: string; label: string }

export interface PublicField {
  id:           string;
  type:         FieldType;
  label:        string;
  placeholder?: string;
  helpText?:    string;
  required:     boolean;
  options?:     FieldOption[];
  minValue?:    number;
  maxValue?:    number;
  minLabel?:    string;
  maxLabel?:    string;
  validations?: { minLength?: number; maxLength?: number; min?: number; max?: number };
}

interface FieldRendererProps {
  field:    PublicField;
  value:    string | string[];
  onChange: (val: string | string[]) => void;
  error?:   string;
}

/* ── Shared option styles ─────────────────────────────────────── */
const OPTION_BASE =
  "flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]";

const OPTION_ACTIVE =
  "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--text-primary)]";

const OPTION_IDLE =
  "border-[var(--border-color)] bg-[var(--bg-inset)] text-[var(--text-primary)] hover:border-[var(--color-accent)]";

/* ── Rating stars ─────────────────────────────────────────────── */
function RatingInput({ field, value, onChange }: Pick<FieldRendererProps, "field" | "value" | "onChange">) {
  const max   = field.maxValue ?? 5;
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const cur   = Number(value) || 0;
  return (
    <div className="flex flex-wrap gap-1.5">
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(String(n))}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md border text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
            cur >= n
              ? "border-[var(--color-action)] bg-[var(--color-action)] text-white"
              : "border-[var(--border-color)] bg-[var(--bg-inset)] text-[var(--text-muted)] hover:border-[var(--color-accent)]",
          )}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/* ── Scale / NPS ──────────────────────────────────────────────── */
function ScaleInput({ field, value, onChange }: Pick<FieldRendererProps, "field" | "value" | "onChange">) {
  const min = field.minValue ?? 1;
  const max = field.maxValue ?? 10;
  const cur = Number(value) || null;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={cur === n}
            onClick={() => onChange(String(n))}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-md border px-2 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
              cur === n
                ? "border-[var(--color-action)] bg-[var(--color-action)] text-white"
                : "border-[var(--border-color)] bg-[var(--bg-inset)] text-[var(--text-secondary)] hover:border-[var(--color-accent)]",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      {(field.minLabel || field.maxLabel) && (
        <div className="flex justify-between gap-4">
          <span className="text-xs text-[var(--text-muted)]">{field.minLabel}</span>
          <span className="text-xs text-[var(--text-muted)]">{field.maxLabel}</span>
        </div>
      )}
    </div>
  );
}

/* ── Select (single) ──────────────────────────────────────────── */
function SelectInput({ field, value, onChange }: Pick<FieldRendererProps, "field" | "value" | "onChange">) {
  const opts = field.options ?? [];
  return (
    <div className="flex flex-col gap-2">
      {opts.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? "" : opt.value)}
            className={cn(OPTION_BASE, active ? OPTION_ACTIVE : OPTION_IDLE)}
          >
            <span
              className={cn(
                "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border",
                active ? "border-[var(--color-accent)]" : "border-[var(--border-color)]",
              )}
            >
              {active && <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />}
            </span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Multi-select ─────────────────────────────────────────────── */
function MultiSelectInput({ field, value, onChange }: Pick<FieldRendererProps, "field" | "value" | "onChange">) {
  const selected = Array.isArray(value) ? value : [];
  const opts = field.options ?? [];
  function toggle(v: string) {
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
  }
  return (
    <div className="flex flex-col gap-2">
      {opts.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(opt.value)}
            className={cn(OPTION_BASE, active ? OPTION_ACTIVE : OPTION_IDLE)}
          >
            <span
              className={cn(
                "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[4px] border",
                active
                  ? "border-[var(--color-action)] bg-[var(--color-action)]"
                  : "border-[var(--border-color)]",
              )}
            >
              {active && <span className="h-1.5 w-2 -translate-y-px rotate-[-45deg] border-b-2 border-l-2 border-white" />}
            </span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
export function FieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  const strVal = Array.isArray(value) ? "" : (value ?? "");

  const inputProps = {
    id:          field.id,
    placeholder: field.placeholder,
    value:       strVal,
    onChange:    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    error:       !!error,
    className:   "w-full",
  };

  let control: React.ReactNode;

  switch (field.type) {
    case "short_text":
      control = <Input {...inputProps} />;
      break;
    case "long_text":
      control = <Textarea {...inputProps} showCount maxLength={field.validations?.maxLength} />;
      break;
    case "email":
      control = <Input {...inputProps} type="email" />;
      break;
    case "number":
      control = <Input {...inputProps} type="number" min={field.validations?.min} max={field.validations?.max} />;
      break;
    case "phone":
      control = <Input {...inputProps} type="tel" />;
      break;
    case "url":
      control = <Input {...inputProps} type="url" />;
      break;
    case "date":
      control = <Input {...inputProps} type="date" />;
      break;
    case "time":
      control = <Input {...inputProps} type="time" />;
      break;
    case "select":
      control = <SelectInput field={field} value={strVal} onChange={onChange} />;
      break;
    case "multi_select":
      control = <MultiSelectInput field={field} value={value} onChange={onChange} />;
      break;
    case "checkbox":
      control = (
        <div className="flex items-start gap-3">
          <Checkbox
            id={field.id}
            checked={strVal === "true"}
            onCheckedChange={(c) => onChange(c ? "true" : "false")}
          />
          <Label htmlFor={field.id} required={field.required} className="text-sm leading-relaxed cursor-pointer">
            {field.placeholder || field.label}
          </Label>
        </div>
      );
      break;
    case "rating":
      control = <RatingInput field={field} value={strVal} onChange={onChange} />;
      break;
    case "scale":
      control = <ScaleInput field={field} value={strVal} onChange={onChange} />;
      break;
    case "file_upload":
      control = (
        <label
          htmlFor={field.id}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed border-[var(--border-color)] bg-[var(--bg-inset)] p-8 text-center transition-colors hover:border-[var(--color-accent)]"
        >
          <span className="text-sm font-medium text-[var(--text-secondary)]">Click to upload a file</span>
          <input id={field.id} type="file" className="sr-only" onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")} />
          {strVal && <span className="text-[13px] font-medium text-[var(--color-accent)]">{strVal}</span>}
        </label>
      );
      break;
    default:
      control = <Input {...inputProps} />;
  }

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <Label htmlFor={field.id} required={field.required} className="text-[15px] font-medium text-[var(--text-primary)]">
          {field.label}
        </Label>
      )}
      {field.helpText && (
        <p className="-mt-1 text-[13px] text-[var(--text-secondary)]">{field.helpText}</p>
      )}
      {control}
      {error && <p role="alert" className="text-[13px] text-[var(--color-red)]">{error}</p>}
    </div>
  );
}
