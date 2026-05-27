"use client";

import { nanoid } from "nanoid";
import {
  Type, AlignLeft, Mail, Hash, Phone, Link2,
  Calendar, Clock, ChevronDown, CheckSquare, Check,
  Star, Sliders, Upload,
} from "lucide-react";
import type { FieldType, BuilderField } from "@/stores/builder-store";
import { useBuilderStore } from "@/stores/builder-store";

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
  const addField = useBuilderStore((s) => s.addField);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="border-b-2 border-[#0A0A0A] px-4 py-3">
        <p className="label-overline">Add field</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-1 gap-1.5">
          {FIELD_DEFS.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => addField(makeDefaultField(type))}
              className="flex items-center gap-3 border-2 border-[#0A0A0A] bg-[var(--bg-panel)] px-3 py-2.5 text-left transition-all shadow-[2px_2px_0_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-[#0A0A0A]"
                style={{ background: color }}
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
