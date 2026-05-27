"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  DndContext, DragEndEvent, DragStartEvent, DragOverlay,
  PointerSensor, useSensor, useSensors, closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { FileText } from "lucide-react";

import { FieldPalette }       from "@/components/builder/field-palette";
import { FieldCard, FieldDragOverlay } from "@/components/builder/field-card";
import { FieldSettings }      from "@/components/builder/field-settings";
import { EmptyState }     from "@/components/shared/empty-state";
import { Skeleton }       from "@/components/ui/skeleton";
import { trpc }           from "@/lib/trpc";
import { useBuilderStore } from "@/stores/builder-store";

export default function FormEditPage() {
  const { id } = useParams<{ id: string }>();
  const utils   = trpc.useUtils();

  const {
    form, fields, activeFieldId, isDirty, previewMode,
    setForm, setFields, setActiveField, reorderFields,
    setDirty, setIsSaving,
  } = useBuilderStore();

  /* ── Load form into store ─────────────────────────────────── */
  const { data, isLoading } = trpc.forms.get.useQuery(
    { formId: id },
    { enabled: !!id, staleTime: Infinity },
  );

  useEffect(() => {
    if (!data) return;
    setForm({
      id:             data.id,
      title:          data.title,
      description:    data.description ?? undefined,
      visibility:     data.visibility,
      collectEmail:   data.collectEmail,
      successMessage: data.successMessage ?? undefined,
      redirectUrl:    data.redirectUrl ?? undefined,
      maxResponses:   data.maxResponses ?? undefined,
      closesAt:       data.closesAt ? String(data.closesAt) : undefined,
      settings: {
        showProgressBar:  data.settings?.showProgressBar  ?? true,
        shuffleFields:    data.settings?.shuffleFields    ?? false,
        oneResponsePerIp: data.settings?.oneResponsePerIp ?? false,
        requireAuth:      data.settings?.requireAuth      ?? false,
        maxFields:        (data.settings as any)?.maxFields ?? 20,
      },
    });
    setFields(
      (data.fields ?? []).map((f: any) => ({
        id:           f.id,
        type:         f.fieldType,
        label:        f.label,
        placeholder:  f.placeholder   ?? undefined,
        helpText:     f.helpText      ?? undefined,
        required:     f.required      ?? false,
        validations:  f.validations   ?? {},
        options:      f.options       ?? undefined,
        minValue:     f.minValue      ?? undefined,
        maxValue:     f.maxValue      ?? undefined,
        minLabel:     f.minLabel      ?? undefined,
        maxLabel:     f.maxLabel      ?? undefined,
        order:        f.order,
      })),
    );
    setDirty(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id]);

  /* ── tRPC mutations ───────────────────────────────────────── */
  const updateFormMut  = trpc.forms.update.useMutation();
  const addFieldMut    = trpc.forms.addField.useMutation();
  const updateFieldMut = trpc.forms.updateField.useMutation();
  const deleteFieldMut = trpc.forms.deleteField.useMutation();
  const reorderMut     = trpc.forms.reorderField.useMutation();

  /* ── Auto-save on dirty ───────────────────────────────────── */
  const prevFieldsRef  = useRef<typeof fields>([]);
  const prevFormRef    = useRef<typeof form>(form);
  const saveTimerRef   = useRef<ReturnType<typeof setTimeout>>(undefined);

  const save = useCallback(async () => {
    if (!isDirty || !form.id) return;
    setIsSaving(true);
    try {
      const prevF = prevFormRef.current;
      if (
        form.title !== prevF.title ||
        form.description !== prevF.description ||
        JSON.stringify(form.settings) !== JSON.stringify(prevF.settings) ||
        form.collectEmail !== prevF.collectEmail ||
        form.successMessage !== prevF.successMessage
      ) {
        await updateFormMut.mutateAsync({
          formId:         form.id,
          title:          form.title,
          description:    form.description,
          collectEmail:   form.collectEmail,
          successMessage: form.successMessage,
          settings:       form.settings,
        });
        prevFormRef.current = { ...form };
      }
      setDirty(false);
      utils.forms.get.invalidate({ formId: form.id });
    } catch (e: any) {
      toast.error("Autosave failed: " + (e?.message ?? "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, form, fields]);

  useEffect(() => {
    if (!isDirty) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(save, 1200);
    return () => clearTimeout(saveTimerRef.current);
  }, [isDirty, save]);

  /* ── DnD ──────────────────────────────────────────────────── */
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  async function handleDragEnd(e: DragEndEvent) {
    setDraggingId(null);
    const { active, over } = e;
    if (!over || active.id === over.id || !form.id) return;
    const fromIdx = fields.findIndex((f) => f.id === active.id);
    const toIdx   = fields.findIndex((f) => f.id === over.id);
    if (fromIdx < 0 || toIdx < 0) return;
    reorderFields(fromIdx, toIdx);
    try {
      await reorderMut.mutateAsync({ formId: form.id, fieldId: String(active.id), newOrder: toIdx });
    } catch {
      // revert handled by cache invalidation
    }
  }

  /* ── Drag overlay state ──────────────────────────────────────── */
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const draggingField = fields.find((f) => f.id === draggingId) ?? null;

  function handleDragStart(e: DragStartEvent) {
    setDraggingId(String(e.active.id));
  }

  const activeField = fields.find((f) => f.id === activeFieldId) ?? null;

  /* ── Preview mode ─────────────────────────────────────────── */
  if (previewMode) {
    return (
      <div className="h-full overflow-y-auto bg-[var(--bg-page)] bg-dot-grid px-6 py-10">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <p className="label-overline mb-2 text-[var(--color-accent)]">Preview</p>
            <h1 className="font-display text-4xl font-black uppercase tracking-tight">{form.title || "Untitled Form"}</h1>
            {form.description && <p className="mt-2 text-[var(--text-muted)]">{form.description}</p>}
          </div>
          {fields.map((f) => (
            <FieldCard key={f.id} field={f} isActive={false} preview />
          ))}
        </div>
      </div>
    );
  }

  /* ── Builder UI ───────────────────────────────────────────── */
  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left: Field palette ─────────────────────────────── */}
      <aside className="w-52 shrink-0 border-r-2 border-[#0A0A0A] bg-[var(--bg-panel)] overflow-hidden">
        <FieldPalette />
      </aside>

      {/* ── Center: Canvas ──────────────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto bg-[var(--bg-page)] p-6"
        onClick={() => setActiveField(null)}
      >
        {isLoading ? (
          <div className="mx-auto max-w-2xl space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-4">
            {fields.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-8 w-8 text-[var(--text-muted)]" />}
                title="No fields yet"
                description="Click a field type on the left to add it to your form."
              />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                  <AnimatePresence>
                    {fields.map((f) => (
                      <FieldCard
                        key={f.id}
                        field={f}
                        isActive={f.id === activeFieldId}
                        isDragOverlay={false}
                      />
                    ))}
                  </AnimatePresence>
                </SortableContext>

                {/* Kanban-style drag overlay — lifted card that follows cursor */}
                <DragOverlay
                  dropAnimation={{
                    duration: 180,
                    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                  }}
                >
                  {draggingField ? (
                    <FieldDragOverlay field={draggingField} />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        )}
      </main>

      {/* ── Right: Settings panel ───────────────────────────── */}
      <AnimatePresence>
        {activeField && (
          <motion.aside
            key="settings"
            initial={{ x: 280, opacity: 0 }}
            animate={{ x: 0,   opacity: 1 }}
            exit={{   x: 280,  opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-72 shrink-0 border-l-2 border-[#0A0A0A] bg-[var(--bg-panel)] overflow-hidden"
          >
            <FieldSettings field={activeField} />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
