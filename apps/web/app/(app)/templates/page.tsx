"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { getFieldDef } from "@/components/builder/field-palette";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { TEMPLATES, getTemplate, type Template, type TemplateField } from "@/lib/templates";
import { useCreateForm } from "@/lib/use-create-form";

const GALLERY = TEMPLATES.filter((t) => t.id !== "blank");
const PREVIEW_COUNT = 4;

function fieldsOf(t: Template) {
  return t.fields as readonly TemplateField[];
}

function fieldCountLabel(n: number) {
  return n === 1 ? "1 field" : `${n} fields`;
}

export default function TemplatesPage() {
  const [openId, setOpenId]         = useState<string | null>(null);
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const { createForm, seeding }     = useCreateForm();

  const openTemplate = getTemplate(openId);

  async function startFromTemplate(t: Template) {
    if (creatingId) return;
    setCreatingId(t.id);
    const ok = await createForm({ title: t.label, templateId: t.id });
    // On success we stay in the loading state until the builder route takes over
    if (!ok) setCreatingId(null);
  }

  function buttonLabel(t: Template) {
    if (creatingId !== t.id) return "Use this template";
    return seeding ? "Adding fields…" : "Creating form…";
  }

  return (
    <AppShell title="Templates">
      <div className="mx-auto w-full max-w-6xl pb-10">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <h1 className="font-display text-4xl text-[var(--text-primary)] sm:text-5xl">Templates</h1>
            <p className="mt-3 max-w-xl text-[var(--text-secondary)]">
              Start with the fields already in place, then change anything in the builder.
            </p>
          </div>
          <Link
            href={ROUTES.formNew}
            className="shrink-0 self-start rounded-md text-sm font-medium text-[var(--color-accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:self-auto"
          >
            Start from a blank form
          </Link>
        </header>

        <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {GALLERY.map((t) => {
            const Icon     = t.icon;
            const fields   = fieldsOf(t);
            const isOpen   = openId === t.id;
            const creating = creatingId === t.id;
            const rest     = fields.length - PREVIEW_COUNT;

            return (
              <li
                key={t.id}
                className={cn(
                  "relative flex flex-col rounded-xl transition-colors duration-150",
                  isOpen || creating
                    ? "bg-[var(--color-accent-soft)] ring-2 ring-[var(--color-accent)]"
                    : "bg-[var(--bg-panel)] ring-1 ring-[var(--border-color)] hover:bg-[var(--bg-inset)]",
                )}
              >
                {/* The whole tile opens the detail; the stretched ::after covers it */}
                <button
                  type="button"
                  onClick={() => setOpenId(t.id)}
                  aria-haspopup="dialog"
                  className="flex items-start gap-4 rounded-xl p-5 pb-4 text-left after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-[var(--color-accent)]"
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      isOpen || creating
                        ? "bg-[var(--color-action)] text-white"
                        : "bg-[var(--bg-inset)] text-[var(--text-secondary)]",
                    )}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium text-[var(--text-primary)]">{t.label}</span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-[var(--text-secondary)]">
                      {t.description}
                    </span>
                  </span>
                </button>

                <ul className="mx-5 space-y-1.5 border-t border-[var(--border-muted)] pt-3" aria-label="First fields">
                  {fields.slice(0, PREVIEW_COUNT).map((f, i) => {
                    const def = getFieldDef(f.type);
                    const FieldIcon = def.icon;
                    return (
                      <li key={i} className="flex min-w-0 items-center gap-2 text-[13px] text-[var(--text-primary)]">
                        <FieldIcon className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" aria-label={def.label} />
                        <span className="truncate">{f.label}</span>
                      </li>
                    );
                  })}
                  {rest > 0 && (
                    <li className="pl-[22px] text-xs text-[var(--text-muted)]">and {rest} more</li>
                  )}
                </ul>

                <div className="mt-auto flex items-center justify-between gap-3 px-5 pb-5 pt-4">
                  <span className="text-xs tabular-nums text-[var(--text-muted)]">
                    {fieldCountLabel(fields.length)}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    loading={creating}
                    disabled={!!creatingId}
                    onClick={() => startFromTemplate(t)}
                    className="relative z-10"
                  >
                    {buttonLabel(t)}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Dialog open={!!openTemplate} onOpenChange={(open) => { if (!open && !creatingId) setOpenId(null); }}>
        {openTemplate && (
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>{openTemplate.label}</DialogTitle>
              <DialogDescription>
                {openTemplate.description} {fieldCountLabel(fieldsOf(openTemplate).length)}.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="pt-1">
              <ol className="divide-y divide-[var(--border-muted)] overflow-hidden rounded-lg ring-1 ring-[var(--border-color)]">
                {fieldsOf(openTemplate).map((f, i) => {
                  const def = getFieldDef(f.type);
                  const FieldIcon = def.icon;
                  return (
                    <li key={i} className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--bg-inset)] text-[var(--text-secondary)]"
                        aria-hidden
                      >
                        <FieldIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-[var(--text-primary)]">{f.label}</span>
                        <span className="block text-xs text-[var(--text-muted)]">{def.label}</span>
                      </span>
                      {f.required ? (
                        <span className="shrink-0 text-xs font-medium text-[var(--color-accent)]">Required</span>
                      ) : (
                        <span className="shrink-0 text-xs text-[var(--text-muted)]">Optional</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={!!creatingId}>
                  Close
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="primary"
                loading={creatingId === openTemplate.id}
                disabled={!!creatingId}
                onClick={() => startFromTemplate(openTemplate)}
              >
                {buttonLabel(openTemplate)}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </AppShell>
  );
}
