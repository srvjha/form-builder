"use client";

import { Plus, Trash2, X } from "lucide-react";
import { nanoid }  from "nanoid";
import { Input }   from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label }   from "@/components/ui/label";
import { Switch }  from "@/components/ui/switch";
import { Button }  from "@/components/ui/button";
import { useBuilderStore, type BuilderField } from "@/stores/builder-store";

interface Props {
  field: BuilderField;
  /** When provided, parent handles store update + debounced DB mutation. */
  onUpdate?: (id: string, patch: Partial<BuilderField>) => void;
  /** When provided, parent handles store removal + DB mutation. */
  onRemove?: (id: string) => void;
}

function LabeledInput({ label, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input {...props} />
    </div>
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

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] px-4 py-3">
        <p className="label-overline">Field settings</p>
        <button onClick={() => setActiveField(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {/* Label */}
        <LabeledInput
          label="Label"
          value={field.label}
          onChange={(e) => up({ label: e.target.value })}
        />

        {/* Placeholder */}
        {!hasOptions && field.type !== "rating" && field.type !== "scale" && field.type !== "checkbox" && field.type !== "file_upload" && (
          <LabeledInput
            label="Placeholder"
            value={field.placeholder ?? ""}
            onChange={(e) => up({ placeholder: e.target.value })}
          />
        )}

        {/* Help text */}
        <LabeledInput
          label="Help text"
          placeholder="Optional hint shown below the field"
          value={field.helpText ?? ""}
          onChange={(e) => up({ helpText: e.target.value })}
        />

        {/* Required */}
        <div className="flex items-center justify-between border-2 border-[#0A0A0A] px-4 py-3">
          <Label className="cursor-pointer">Required</Label>
          <Switch
            checked={field.required}
            onCheckedChange={(v) => up({ required: v })}
          />
        </div>

        {/* Options for select / multi_select */}
        {hasOptions && (
          <div className="space-y-2">
            <Label>Options</Label>
            {(field.options ?? []).map((opt, i) => (
              <div key={opt.value} className="flex gap-2">
                <Input
                  value={opt.label}
                  placeholder={`Option ${i + 1}`}
                  onChange={(e) => {
                    const opts = [...(field.options ?? [])];
                    opts[i] = { ...opt, label: e.target.value };
                    up({ options: opts });
                  }}
                  className="flex-1"
                />
                <button
                  onClick={() => up({ options: (field.options ?? []).filter((_, j) => j !== i) })}
                  className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-[#0A0A0A] hover:bg-[var(--color-red)] hover:text-white transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => up({ options: [...(field.options ?? []), { value: nanoid(), label: "" }] })}
              className="gap-1.5 mt-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add option
            </Button>
          </div>
        )}

        {/* Rating max */}
        {hasRatingMax && (
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Min" type="number" value={String(field.minValue ?? 1)} onChange={(e) => up({ minValue: Number(e.target.value) })} />
            <LabeledInput label="Max stars" type="number" value={String(field.maxValue ?? 5)} min={2} max={10} onChange={(e) => up({ maxValue: Number(e.target.value) })} />
          </div>
        )}

        {/* Scale min/max + labels */}
        {hasMinMax && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput label="Min value" type="number" value={String(field.minValue ?? 1)}  onChange={(e) => up({ minValue: Number(e.target.value) })} />
              <LabeledInput label="Max value" type="number" value={String(field.maxValue ?? 10)} onChange={(e) => up({ maxValue: Number(e.target.value) })} />
            </div>
            {field.type === "scale" && (
              <div className="grid grid-cols-2 gap-3">
                <LabeledInput label="Min label" placeholder="e.g. Not likely"  value={field.minLabel ?? ""} onChange={(e) => up({ minLabel: e.target.value })} />
                <LabeledInput label="Max label" placeholder="e.g. Very likely" value={field.maxLabel ?? ""} onChange={(e) => up({ maxLabel: e.target.value })} />
              </div>
            )}
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
              placeholder="∞"
              value={String(field.validations?.maxLength ?? "")}
              onChange={(e) => up({ validations: { ...field.validations, maxLength: Number(e.target.value) || undefined } })}
            />
          </div>
        )}
      </div>

      {/* Delete field */}
      <div className="border-t-2 border-[#0A0A0A] p-4">
        <Button
          variant="danger"
          size="sm"
          className="w-full gap-1.5"
          onClick={() => { if (onRemove) { onRemove(field.id); } else { removeField(field.id); } }}
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove field
        </Button>
      </div>
    </div>
  );
}
