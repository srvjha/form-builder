"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS }         from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { motion }      from "framer-motion";
import { cn }          from "@/lib/utils";
import { FieldRenderer } from "@/components/form-renderer/field-renderer";
import { getFieldDef } from "@/components/builder/field-palette";
import { useBuilderStore, type BuilderField } from "@/stores/builder-store";
import type { PublicField } from "@/components/form-renderer/field-renderer";

interface Props {
  field:     BuilderField;
  isActive:  boolean;
  preview?:  boolean;
  /** When provided, the parent handles both store removal AND the DB mutation. */
  onRemove?: (id: string) => void;
}

/* Cast builder field → public field for the renderer */
function toPublicField(field: BuilderField): PublicField {
  return {
    id:          field.id,
    type:        field.type,
    label:       field.label,
    placeholder: field.placeholder,
    helpText:    field.helpText,
    required:    field.required,
    options:     field.options,
    minValue:    field.minValue,
    maxValue:    field.maxValue,
    minLabel:    field.minLabel,
    maxLabel:    field.maxLabel,
    validations: field.validations,
  };
}

export function FieldCard({ field, isActive, preview, onRemove }: Props) {
  const { setActiveField, removeField } = useBuilderStore();

  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: field.id });

  const style: React.CSSProperties = {
    transform:  CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms ease",
  };

  const publicField = toPublicField(field);
  const def  = getFieldDef(field.type);
  const Icon = def.icon;

  /* ── Preview mode (no drag) ──────────────────────────────── */
  if (preview) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-5">
        <FieldRenderer field={publicField} value="" onChange={() => {}} />
      </div>
    );
  }

  /* ── Sortable card: a solid piece sitting on the dotted canvas ── */
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, scale: isDragging ? 1.01 : 1 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      onClick={(e) => { e.stopPropagation(); setActiveField(field.id); }}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border-1 bg-[var(--bg-panel)] transition-[box-shadow,border-color] duration-150",
        isActive
          ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]"
          : "border-[var(--border-color)] hover:border-[var(--text-muted)]",
        isDragging && "z-10 shadow-soft-xl",
      )}
    >
      {/* Header: handle, type, delete */}
      <div
        className={cn(
          "flex h-9 items-center gap-1.5 border-b-1 pl-1.5 pr-1.5 text-xs transition-colors",
          isActive
            ? "border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
            : "border-[var(--border-muted)] text-[var(--text-muted)]",
        )}
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          className={cn(
            "flex h-7 w-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md transition-colors active:cursor-grabbing",
            isActive ? "hover:bg-[var(--bg-panel)]" : "hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]",
          )}
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="truncate font-medium">{def.label}</span>
        {field.required && (
          <span
            className={cn(
              "ml-1 shrink-0 rounded-full border-1 px-1.5 text-2xs leading-4",
              isActive ? "border-[var(--color-accent)]/40" : "border-[var(--border-color)]",
            )}
          >
            Required
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) { onRemove(field.id); } else { removeField(field.id); }
          }}
          className={cn(
            "ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-[opacity,color,background-color]",
            "hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)] focus-visible:opacity-100",
            isActive ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100",
          )}
          aria-label="Remove field"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Field preview */}
      <div className="pointer-events-none p-4 sm:p-5">
        <FieldRenderer field={publicField} value="" onChange={() => {}} />
      </div>
    </motion.div>
  );
}
