"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Layers } from "lucide-react";
import { AppShell }  from "@/components/layout/app-shell";
import { Button }    from "@/components/ui/button";
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import { Textarea }  from "@/components/ui/textarea";
import { cn }        from "@/lib/utils";
import { DEFAULT_MAX_FIELDS } from "@/stores/builder-store";
import { TEMPLATES, getTemplate, type TemplateField, type TemplateId } from "@/lib/templates";
import { useCreateForm } from "@/lib/use-create-form";

// ── Page ───────────────────────────────────────────────────────────────────────
export default function NewFormPage() {
  // useSearchParams needs a Suspense boundary on a statically rendered route
  return (
    <Suspense fallback={null}>
      <NewFormContent />
    </Suspense>
  );
}

function NewFormContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  // ?template=<id> preselects that template and names the form after it
  const initialTemplate = getTemplate(searchParams.get("template"));

  const [title,       setTitle]       = useState(
    initialTemplate && initialTemplate.id !== "blank" ? initialTemplate.label : "",
  );
  const [description, setDescription] = useState("");
  const [template,    setTemplate]    = useState<TemplateId>(initialTemplate?.id ?? "blank");
  const [maxFields,   setMaxFields]   = useState<string>(String(DEFAULT_MAX_FIELDS));

  const { createForm, isPending, seeding } = useCreateForm();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedMax = Math.max(1, Math.min(100, parseInt(maxFields, 10) || DEFAULT_MAX_FIELDS));
    await createForm({
      title,
      description,
      templateId: template,
      maxFields:  parsedMax,
    });
  }

  const selectedTemplate = TEMPLATES.find((t) => t.id === template)!;
  const previewFields    = selectedTemplate.fields as readonly TemplateField[];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl pb-10">
        <h1 className="font-display text-4xl text-[var(--text-primary)] sm:text-5xl">New form</h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          Name it, pick a starting point, and you will land in the builder.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* ── Name ─────────────────────────────────────────────── */}
          <section className="space-y-2">
            <h2 className="px-1 font-sans text-[13px] font-semibold leading-tight tracking-normal text-[var(--text-primary)]">
              Details
            </h2>
            <div className="space-y-4 rounded-xl border-1 border-[var(--border-color)] bg-[var(--bg-panel)] p-4 sm:p-5">
              <div className="space-y-1.5">
                <Label htmlFor="form-title">Title</Label>
                <Input
                  id="form-title"
                  placeholder="e.g. Customer feedback, Q4"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="form-desc">Description</Label>
                <Textarea
                  id="form-desc"
                  placeholder="Optional. Shown to respondents at the top of the form."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* ── Template list ─────────────────────────────────────── */}
          <section className="space-y-2">
            <h2 className="px-1 font-sans text-[13px] font-semibold leading-tight tracking-normal text-[var(--text-primary)]">
              Start from
            </h2>
            {/* Each template is its own tile with room around it */}
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Template">
              {TEMPLATES.map((t) => {
                const Icon     = t.icon;
                const isActive = template === t.id;
                const count    = t.fields.length;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setTemplate(t.id)}
                    className={cn(
                      "relative flex items-start gap-4 rounded-xl p-5 text-left transition-[background-color,box-shadow] duration-150 active:scale-[0.99]",
                      isActive
                        ? "bg-[var(--color-accent-soft)] ring-2 ring-[var(--color-accent)]"
                        : "bg-[var(--bg-panel)] ring-1 ring-[var(--border-color)] hover:bg-[var(--bg-inset)]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        isActive
                          ? "bg-[var(--color-action)] text-white"
                          : "bg-[var(--bg-inset)] text-[var(--text-secondary)]",
                      )}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="text-[15px] font-medium text-[var(--text-primary)]">{t.label}</span>
                        <span
                          className={cn(
                            "shrink-0 text-xs tabular-nums",
                            isActive ? "text-[var(--color-accent)]" : "text-[var(--text-muted)]",
                          )}
                        >
                          {count === 0 ? "No fields" : `${count} fields`}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-[13px] leading-relaxed text-[var(--text-secondary)]">
                        {t.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Template field preview */}
            <AnimatePresence mode="wait">
              {previewFields.length > 0 && (
                <motion.div
                  key={template}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-xl border-1 border-[var(--border-color)] bg-[var(--bg-panel)] px-4 py-3 sm:px-5"
                >
                  <p className="text-xs font-medium text-[var(--text-secondary)]">
                    Adds these {previewFields.length} fields
                  </p>
                  <ol className="mt-2 grid gap-x-6 gap-y-1 text-sm text-[var(--text-primary)] sm:grid-cols-2">
                    {previewFields.map((f, i) => (
                      <li key={i} className="flex min-w-0 items-baseline gap-2">
                        <span className="w-4 shrink-0 text-right text-xs tabular-nums text-[var(--text-muted)]">{i + 1}</span>
                        <span className="truncate">{f.label}</span>
                        {f.required && <span className="shrink-0 text-xs text-[var(--color-accent)]">Required</span>}
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ── Field limit ──────────────────────────────────────── */}
          <section className="space-y-2">
            <h2 className="px-1 font-sans text-[13px] font-semibold leading-tight tracking-normal text-[var(--text-primary)]">
              Limits
            </h2>
            <div className="flex flex-col gap-3 rounded-xl border-1 border-[var(--border-color)] bg-[var(--bg-panel)] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-5">
              <div className="min-w-0">
                <Label htmlFor="max-fields" className="text-sm font-medium">Field limit</Label>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-muted)]">
                  The most fields this form can hold. The builder stops adding fields once it is reached. Default is {DEFAULT_MAX_FIELDS}.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Input
                  id="max-fields"
                  type="number"
                  min={1}
                  max={100}
                  value={maxFields}
                  onChange={(e) => setMaxFields(e.target.value)}
                  className="w-24 tabular-nums"
                  leftSlot={<Layers className="h-4 w-4" />}
                />
                {maxFields !== String(DEFAULT_MAX_FIELDS) && (
                  <button
                    type="button"
                    onClick={() => setMaxFields(String(DEFAULT_MAX_FIELDS))}
                    className="text-xs text-[var(--text-secondary)] underline underline-offset-2 transition-colors hover:text-[var(--text-primary)]"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={isPending}
              className="h-10 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={!title.trim() || isPending}
              className="h-10 px-5 text-sm font-medium !bg-[var(--color-action)] !text-white shadow-none hover:!bg-[var(--color-action-hover)] hover:shadow-none hover:brightness-100"
            >
              {seeding ? "Adding fields…" : "Create form"}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
