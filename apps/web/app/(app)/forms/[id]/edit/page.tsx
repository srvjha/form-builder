"use client";

import { useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  DndContext, DragEndEvent,
  PointerSensor, useSensor, useSensors, closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { FileText } from "lucide-react";

import { FieldPalette, makeDefaultField } from "@/components/builder/field-palette";
import { FieldCard }     from "@/components/builder/field-card";
import { FieldSettings } from "@/components/builder/field-settings";
import { Skeleton }       from "@/components/ui/skeleton";
import { trpc }           from "@/lib/trpc";
import { useBuilderStore } from "@/stores/builder-store";

export default function FormEditPage() {
  const { id } = useParams<{ id: string }>();
  const utils   = trpc.useUtils();

  const {
    form, fields, activeFieldId, isDirty, previewMode,
    setForm, setFields, setActiveField, reorderFields,
    addField, updateField, removeField,
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
        // keep every saved setting (e.g. formTheme) so autosave never drops one
        ...((data.settings as Record<string, unknown> | null) ?? {}),
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

  /* ── Field CRUD — optimistic store + DB persistence ──────────────────── */

  /** Add a field: update store immediately, persist to DB, swap temp ID → server UUID */
  async function handleAddField(field: Omit<ReturnType<typeof makeDefaultField>, never>) {
    if (!form.id) return;
    const success = addField(field); // optimistic: appears in canvas instantly
    if (!success) return;            // limit hit — toast already shown in palette

    try {
      const serverField = await addFieldMut.mutateAsync({
        formId:      form.id,
        type:        field.type,
        label:       field.label,
        required:    field.required,
        validations: field.validations,
        ...(field.placeholder !== undefined && { placeholder: field.placeholder }),
        ...(field.helpText     !== undefined && { helpText:    field.helpText    }),
        ...(field.options      !== undefined && { options:     field.options     }),
        ...(field.minValue     !== undefined && { minValue:    field.minValue    }),
        ...(field.maxValue     !== undefined && { maxValue:    field.maxValue    }),
        ...(field.minLabel     !== undefined && { minLabel:    field.minLabel    }),
        ...(field.maxLabel     !== undefined && { maxLabel:    field.maxLabel    }),
      });
      // Replace the nanoid temp ID with the real server-assigned UUID so
      // subsequent deletes / updates use the correct identifier.
      const current = useBuilderStore.getState().fields;
      setFields(
        current.map((f) =>
          f.id === field.id
            ? { ...f, id: serverField.id, clientKey: f.clientKey ?? f.id, order: serverField.order }
            : f,
        ),
      );
      setActiveField(serverField.id);
      setDirty(false);
    } catch (e: any) {
      removeField(field.id); // revert optimistic add
      toast.error("Failed to add field: " + (e?.message ?? "Unknown error"));
    }
  }

  /** Delete a field: remove from store immediately, then delete on server */
  async function handleRemoveField(fieldId: string) {
    if (!form.id) return;
    removeField(fieldId); // optimistic
    try {
      await deleteFieldMut.mutateAsync({ formId: form.id, fieldId });
    } catch (e: any) {
      utils.forms.get.invalidate({ formId: form.id }); // revert via refetch
      toast.error("Failed to remove field: " + (e?.message ?? "Unknown error"));
    }
  }

  /** Update a field: patch store immediately, debounce the DB write 800 ms */
  const updateFieldTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  function handleUpdateField(fieldId: string, patch: Parameters<typeof updateField>[1]) {
    updateField(fieldId, patch); // immediate for responsive UI
    if (!form.id) return;

    const existing = updateFieldTimers.current.get(fieldId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(async () => {
      updateFieldTimers.current.delete(fieldId);
      const f = useBuilderStore.getState().fields.find((x) => x.id === fieldId);
      if (!f || !form.id) return;
      // Don't save while the user is mid-edit on required fields
      if (!f.label.trim()) return;
      const cleanOptions = f.options?.map((o, i) => ({
        ...o,
        label: o.label.trim() || `Option ${i + 1}`,
      }));
      try {
        await updateFieldMut.mutateAsync({
          formId:      form.id,
          fieldId:     f.id,
          type:        f.type,
          label:       f.label,
          required:    f.required,
          validations: f.validations,
          placeholder: f.placeholder,
          helpText:    f.helpText,
          options:     cleanOptions,
          minValue:    f.minValue,
          maxValue:    f.maxValue,
          minLabel:    f.minLabel,
          maxLabel:    f.maxLabel,
        });
      } catch (e: any) {
        toast.error("Autosave failed for field: " + (e?.message ?? "Unknown error"));
      }
    }, 800);

    updateFieldTimers.current.set(fieldId, timer);
  }

  /* ── DnD ──────────────────────────────────────────────────── */
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  async function handleDragEnd(e: DragEndEvent) {
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

  const activeField = fields.find((f) => f.id === activeFieldId) ?? null;

  /* ── Preview mode ─────────────────────────────────────────── */
  if (previewMode) {
    return (
      <div className="h-full overflow-y-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="mb-8">
            <h1 className="font-display text-4xl text-[var(--text-primary)] sm:text-5xl">{form.title || "Untitled form"}</h1>
            {form.description && <p className="mt-3 max-w-prose text-[var(--text-secondary)]">{form.description}</p>}
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
    <div className="flex h-full flex-col overflow-hidden md:flex-row">
      {/* ── Left: Field palette (top strip on phones) ───────── */}
      <aside className="shrink-0 border-b-1 border-[var(--border-color)] bg-[var(--bg-panel)] md:w-56 md:border-b-0 md:border-r-1 md:overflow-hidden">
        <FieldPalette onAdd={handleAddField} />
      </aside>

      {/* ── Center: Canvas — transparent so the dotted ground shows ── */}
      <main
        className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-10 md:py-10"
        onClick={() => setActiveField(null)}
        aria-label="Form canvas"
      >
        {isLoading ? (
          <div className="mx-auto max-w-2xl space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-3 pb-16">
            {fields.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl border-1 border-dashed border-[var(--border-color)] bg-[var(--bg-panel)] px-6 py-14 text-center">
                <FileText className="h-6 w-6 text-[var(--text-muted)]" aria-hidden />
                <h2 className="mt-4 font-sans text-base font-semibold leading-snug tracking-normal text-[var(--text-primary)]">
                  Add your first field
                </h2>
                <p className="mt-1 max-w-xs text-sm text-[var(--text-secondary)]">
                  Pick a field type from the list and it will land here. Drag cards to reorder them.
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                  <AnimatePresence>
                    {fields.map((f) => (
                      <FieldCard
                        // Keyed by the id it was created with, so swapping in the server id
                        // does not unmount and re-animate the card (that caused the jump)
                        key={f.clientKey ?? f.id}
                        field={f}
                        isActive={f.id === activeFieldId}
                        onRemove={handleRemoveField}
                      />
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}
      </main>

      {/* ── Right: Settings panel (full-screen sheet on phones) ── */}
      <AnimatePresence>
        {activeField && (
          <motion.aside
            key="settings"
            initial={{ x: 280, opacity: 0 }}
            animate={{ x: 0,   opacity: 1 }}
            exit={{   x: 280,  opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-40 w-full max-w-sm overflow-hidden border-l-1 border-[var(--border-color)] bg-[var(--bg-panel)] shadow-soft-xl md:static md:z-auto md:w-80 md:max-w-none md:shrink-0 md:shadow-none"
          >
            <FieldSettings
              field={activeField}
              onUpdate={handleUpdateField}
              onRemove={handleRemoveField}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
