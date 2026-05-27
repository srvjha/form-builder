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
  field:          BuilderField;
  isActive:       boolean;
  preview?:       boolean;
  isDragOverlay?: boolean;
  /** When provided, the parent handles both store removal AND the DB mutation. */
  onRemove?:      (id: string) => void;
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

/* ── Drag overlay — the "lifted" card that follows the cursor ─────────────── */
export function FieldDragOverlay({ field }: { field: BuilderField }) {
  return (
    <div
      className={cn(
        "relative border-2 border-[var(--color-accent)] bg-[var(--bg-panel)]",
        "shadow-[6px_6px_0_var(--color-accent)]",
        "cursor-grabbing select-none",
      )}
      style={{
        transform: "rotate(1.5deg) scale(1.025)",
        transformOrigin: "top left",
      }}
    >
      {/* Accent strip */}
      <div className="absolute left-0 inset-y-0 w-1 bg-[var(--color-accent)]" />

      <div className="flex items-start gap-3 p-4 pl-5">
        {/* Drag handle — always visible on overlay */}
        <span className="mt-0.5 text-[var(--color-accent)]">
          <GripVertical className="h-4 w-4" />
        </span>

        {/* Field preview */}
        <div className="flex-1 min-w-0 pointer-events-none opacity-90">
          <FieldRenderer field={toPublicField(field)} value="" onChange={() => {}} />
        </div>
      </div>
    </div>
  );
}

/* ── Main sortable card ───────────────────────────────────────────────────── */
export function FieldCard({ field, isActive, preview, isDragOverlay, onRemove }: Props) {
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

  /* ── Preview mode (no drag) ─────────────────────────────────────────── */
  if (preview) {
    return (
      <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] p-5 shadow-[2px_2px_0_#0A0A0A]">
        <FieldRenderer field={publicField} value="" onChange={() => {}} />
      </div>
    );
  }

  /* ── Ghost placeholder shown at original position while dragging ────── */
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "border-2 border-dashed border-[var(--color-accent)] bg-[var(--color-accent)]/5",
          "transition-all duration-150",
        )}
        // Keep the same height as a real card so the list doesn't collapse
        aria-hidden
      >
        {/* Invisible spacer matching roughly one card's height */}
        <div className="flex items-start gap-3 p-4 opacity-0 pointer-events-none select-none">
          <span className="mt-0.5"><GripVertical className="h-4 w-4" /></span>
          <div className="flex-1 min-w-0">
            <FieldRenderer field={publicField} value="" onChange={() => {}} />
          </div>
        </div>
      </div>
    );
  }

  /* ── Normal card ────────────────────────────────────────────────────── */
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
          className="mt-0.5 cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity"
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
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) { onRemove(field.id); } else { removeField(field.id); }
          }}
          className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--color-red)]"
          aria-label="Remove field"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
