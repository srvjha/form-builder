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

/* ── Rating stars ─────────────────────────────────────────────── */
function RatingInput({ field, value, onChange }: Pick<FieldRendererProps, "field" | "value" | "onChange">) {
  const max   = field.maxValue ?? 5;
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const cur   = Number(value) || 0;
  return (
    <div className="flex gap-1">
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(String(n))}
          className={cn(
            "h-10 w-10 border-2 border-[#0A0A0A] font-display text-lg font-black transition-all",
            "hover:translate-x-[1px] hover:translate-y-[1px]",
            cur >= n
              ? "bg-[var(--color-accent)] text-white shadow-[2px_2px_0_#0A0A0A]"
              : "bg-[var(--bg-inset)] text-[var(--text-muted)] shadow-[2px_2px_0_#0A0A0A]",
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
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(String(n))}
            className={cn(
              "h-10 w-10 border-2 border-[#0A0A0A] font-mono text-sm font-bold transition-all",
              "hover:translate-x-[1px] hover:translate-y-[1px]",
              cur === n
                ? "bg-[var(--color-accent)] text-white shadow-[2px_2px_0_#0A0A0A]"
                : "bg-[var(--bg-inset)] text-[var(--text-muted)] shadow-[2px_2px_0_#0A0A0A]",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      {(field.minLabel || field.maxLabel) && (
        <div className="flex justify-between">
          <span className="font-mono text-xs text-[var(--text-muted)]">{field.minLabel}</span>
          <span className="font-mono text-xs text-[var(--text-muted)]">{field.maxLabel}</span>
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
            onClick={() => onChange(active ? "" : opt.value)}
            className={cn(
              "flex items-center gap-3 border-2 border-[#0A0A0A] px-4 py-3 text-left text-sm font-semibold transition-all",
              "hover:translate-x-[1px] hover:translate-y-[1px]",
              active
                ? "bg-[var(--color-accent)] text-white shadow-[2px_2px_0_#0A0A0A]"
                : "bg-[var(--bg-inset)] shadow-[2px_2px_0_#0A0A0A]",
            )}
          >
            <span className={cn("h-4 w-4 border-2 border-current flex-shrink-0", active && "bg-white/30")} />
            {opt.label}
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
            onClick={() => toggle(opt.value)}
            className={cn(
              "flex items-center gap-3 border-2 border-[#0A0A0A] px-4 py-3 text-left text-sm font-semibold transition-all",
              "hover:translate-x-[1px] hover:translate-y-[1px]",
              active
                ? "bg-[var(--color-accent)] text-white shadow-[2px_2px_0_#0A0A0A]"
                : "bg-[var(--bg-inset)] shadow-[2px_2px_0_#0A0A0A]",
            )}
          >
            <span className={cn(
              "h-4 w-4 border-2 border-current flex-shrink-0 flex items-center justify-center",
            )}>
              {active && <span className="block h-2 w-2 bg-current" />}
            </span>
            {opt.label}
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
          <Label htmlFor={field.id} className="text-sm leading-relaxed cursor-pointer">
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
          className="flex cursor-pointer flex-col items-center gap-3 border-2 border-dashed border-[#0A0A0A] p-8 transition-colors hover:bg-[var(--bg-inset)]"
        >
          <span className="font-mono text-xs text-[var(--text-muted)]">Click to upload a file</span>
          <input id={field.id} type="file" className="sr-only" onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")} />
          {strVal && <span className="font-mono text-xs font-bold text-[var(--color-accent)]">{strVal}</span>}
        </label>
      );
      break;
    default:
      control = <Input {...inputProps} />;
  }

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <Label htmlFor={field.id} required={field.required} className="text-sm">
          {field.label}
        </Label>
      )}
      {field.helpText && (
        <p className="text-xs text-[var(--text-muted)] -mt-1">{field.helpText}</p>
      )}
      {control}
      {error && <p className="font-mono text-xs text-[var(--color-red)]">{error}</p>}
    </div>
  );
}
