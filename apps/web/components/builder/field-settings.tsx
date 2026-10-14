"use client";

import { Plus, Trash2, X } from "lucide-react";
import { nanoid }  from "nanoid";
import { Input }   from "@/components/ui/input";
import { Label }   from "@/components/ui/label";
import { Switch }  from "@/components/ui/switch";
import { getFieldDef } from "@/components/builder/field-palette";
import { useBuilderStore, type BuilderField } from "@/stores/builder-store";

interface Props {
  field: BuilderField;
  /** When provided, parent handles store update + debounced DB mutation. */
  onUpdate?: (id: string, patch: Partial<BuilderField>) => void;
  /** When provided, parent handles store removal + DB mutation. */
  onRemove?: (id: string) => void;
}

function LabeledInput({ label, id, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  const inputId = id ?? `fs-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId} className="text-xs font-medium text-[var(--text-secondary)]">{label}</Label>
      <Input id={inputId} {...props} />
    </div>
  );
}

/* A titled group of controls; groups are separated by a hairline */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-b-1 border-[var(--border-muted)] px-4 py-4 last:border-b-0">
      <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">{title}</h3>
      {children}
    </section>
  );
}

export function FieldSettings({ field, onUpdate, onRemove }: Props) {
  const { updateField, removeField, setActiveField } = useBuilderStore();
  const up = (patch: Partial<BuilderField>) => {
    if (onUpdate) { onUpdate(field.id, patch); } else { updateField(field.id, patch); }
  };

  const hasOptions    = field.type === "select"  || field.type === "multi_select";
  const hasMinMax     = field.type === "number"  || field.type === "scale";
  const hasRatingMax  = field.type === "rating";
  const hasTextLimits = field.type === "short_text" || field.type === "long_text";
  const hasPlaceholder =
    !hasOptions && field.type !== "rating" && field.type !== "scale" && field.type !== "checkbox" && field.type !== "file_upload";

  const def  = getFieldDef(field.type);
  const Icon = def.icon;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b-1 border-[var(--border-color)] px-4 py-3">
        <div className="min-w-0">
          <h2 className="font-sans text-sm font-semibold leading-tight tracking-normal text-[var(--text-primary)]">
            Field settings
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Icon className="h-3.5 w-3.5" aria-hidden /> {def.label}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveField(null)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]"
          aria-label="Close field settings"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Question ───────────────────────────────────────── */}
        <Group title="Question">
          <LabeledInput
            label="Label"
            value={field.label}
            onChange={(e) => up({ label: e.target.value })}
          />
          {hasPlaceholder && (
            <LabeledInput
              label="Placeholder"
              value={field.placeholder ?? ""}
              onChange={(e) => up({ placeholder: e.target.value })}
            />
          )}
          <LabeledInput
            label="Help text"
            placeholder="Optional hint shown below the field"
            value={field.helpText ?? ""}
            onChange={(e) => up({ helpText: e.target.value })}
          />
        </Group>

        {/* ── Options for select / multi_select ──────────────── */}
        {hasOptions && (
          <Group title="Options">
            <div className="space-y-2">
              {(field.options ?? []).map((opt, i) => (
                <div key={opt.value} className="flex gap-2">
                  <Input
                    value={opt.label}
                    placeholder={`Option ${i + 1}`}
                    aria-label={`Option ${i + 1}`}
                    onChange={(e) => {
                      const opts = [...(field.options ?? [])];
                      opts[i] = { ...opt, label: e.target.value };
                      up({ options: opts });
                    }}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => up({ options: (field.options ?? []).filter((_, j) => j !== i) })}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)]"
                    aria-label={`Remove option ${i + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const opts = field.options ?? [];
                up({ options: [...opts, { value: nanoid(), label: `Option ${opts.length + 1}` }] });
              }}
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-soft)]"
            >
              <Plus className="h-3.5 w-3.5" /> Add option
            </button>
          </Group>
        )}

        {/* ── Rules ──────────────────────────────────────────── */}
        <Group title="Rules">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="fs-required" className="cursor-pointer text-sm font-medium">Required</Label>
              <p className="text-xs text-[var(--text-muted)]">Respondents must answer this.</p>
            </div>
            <Switch
              id="fs-required"
              checked={field.required}
              onCheckedChange={(v) => up({ required: v })}
            />
          </div>

          {/* Rating range */}
          {hasRatingMax && (
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput label="Min" type="number" value={String(field.minValue ?? 1)} onChange={(e) => up({ minValue: Number(e.target.value) })} />
              <LabeledInput label="Max stars" type="number" value={String(field.maxValue ?? 5)} min={2} max={10} onChange={(e) => up({ maxValue: Number(e.target.value) })} />
            </div>
          )}

          {/* Number / scale range */}
          {hasMinMax && (
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput label="Min value" type="number" value={String(field.minValue ?? 1)}  onChange={(e) => up({ minValue: Number(e.target.value) })} />
              <LabeledInput label="Max value" type="number" value={String(field.maxValue ?? 10)} onChange={(e) => up({ maxValue: Number(e.target.value) })} />
            </div>
          )}

          {/* Text length limits */}
          {hasTextLimits && (
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput
                label="Min length"
                type="number"
                placeholder="0"
                value={String(field.validations?.minLength ?? "")}
                onChange={(e) => up({ validations: { ...field.validations, minLength: Number(e.target.value) || undefined } })}
              />
              <LabeledInput
                label="Max length"
                type="number"
                placeholder="No limit"
                value={String(field.validations?.maxLength ?? "")}
                onChange={(e) => up({ validations: { ...field.validations, maxLength: Number(e.target.value) || undefined } })}
              />
            </div>
          )}
        </Group>

        {/* ── Scale end labels ───────────────────────────────── */}
        {field.type === "scale" && (
          <Group title="Scale labels">
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput label="Low end" placeholder="e.g. Not likely"  value={field.minLabel ?? ""} onChange={(e) => up({ minLabel: e.target.value })} />
              <LabeledInput label="High end" placeholder="e.g. Very likely" value={field.maxLabel ?? ""} onChange={(e) => up({ maxLabel: e.target.value })} />
            </div>
          </Group>
        )}
      </div>

      {/* Delete field */}
      <div className="shrink-0 border-t-1 border-[var(--border-color)] p-3">
        <button
          type="button"
          onClick={() => { if (onRemove) { onRemove(field.id); } else { removeField(field.id); } }}
          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md text-sm font-medium text-[var(--color-red)] transition-colors hover:bg-[var(--color-red)]/10"
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove field
        </button>
      </div>
    </div>
  );
}
