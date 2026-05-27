"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS }         from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { motion }      from "framer-motion";
import { cn }          from "@/lib/utils";
import { FieldRenderer } from "@/components/form-renderer/field-renderer";
import { useBuilderStore, type BuilderField } from "@/stores/builder-store";
import type { PublicField } from "@/components/form-renderer/field-renderer";

interface Props {
  field:    BuilderField;
  isActive: boolean;
  preview?: boolean;
}

export function FieldCard({ field, isActive, preview }: Props) {
  const { setActiveField, removeField } = useBuilderStore();

  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: field.id });

  const style: React.CSSProperties = {
    transform:  CSS.Transform.toString(transform),
    transition,
    opacity:    isDragging ? 0.4 : 1,
    zIndex:     isDragging ? 50 : undefined,
  };

  /* Cast builder field → public field for the renderer */
  const publicField: PublicField = {
    id:           field.id,
    type:         field.type,
    label:        field.label,
    placeholder:  field.placeholder,
    helpText:     field.helpText,
    required:     field.required,
    options:      field.options,
    minValue:     field.minValue,
    maxValue:     field.maxValue,
    minLabel:     field.minLabel,
    maxLabel:     field.maxLabel,
    validations:  field.validations,
  };

  if (preview) {
    return (
      <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] p-5 shadow-[2px_2px_0_#0A0A0A]">
        <FieldRenderer field={publicField} value="" onChange={() => {}} />
      </div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      onClick={() => setActiveField(field.id)}
      className={cn(
        "group relative border-2 border-[#0A0A0A] bg-[var(--bg-panel)] cursor-pointer transition-all",
        isActive
          ? "shadow-[4px_4px_0_var(--color-accent)] border-[var(--color-accent)]"
          : "shadow-[2px_2px_0_#0A0A0A] hover:shadow-[3px_3px_0_#0A0A0A]",
      )}
    >
      {/* Accent strip when active */}
      {isActive && <div className="absolute left-0 inset-y-0 w-1 bg-[var(--color-accent)]" />}

      <div className={cn("flex items-start gap-3 p-4", isActive && "pl-5")}>
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Field preview */}
        <div className="flex-1 min-w-0 pointer-events-none">
          <FieldRenderer field={publicField} value="" onChange={() => {}} />
        </div>

        {/* Delete */}
        <button
          onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
          className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--color-red)]"
          aria-label="Remove field"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
