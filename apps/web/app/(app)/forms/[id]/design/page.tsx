"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  PublicForm,
  ThemePreview,
  resolveFormTheme,
  type FormTheme,
} from "@/components/form-renderer/public-form";

/* How respondents see this form. Independent of the FormCraft app theme. */
const THEMES: { id: FormTheme; name: string; description: string }[] = [
  { id: "formcraft",  name: "FormCraft",      description: "Dotted dark ground, one blue accent. The default." },
  { id: "brutalist",  name: "Brutalist",      description: "Hard borders, offset shadows, numbered questions." },
  { id: "clean",      name: "Clean card",     description: "White cards and soft shadows, a familiar feel." },
  { id: "playful",    name: "Playful",        description: "Vibrant gradient, springy motion, emoji hints." },
  { id: "minimal",    name: "Notion minimal", description: "Plain white, underlined inputs, editorial." },
  { id: "terminal",   name: "Terminal",       description: "Green on black, monospace, command-line feel." },
  { id: "government", name: "Gov't portal",   description: "Tricolour header and an official table layout." },
  { id: "newspaper",  name: "Newspaper",      description: "Serif type on newsprint, like a printed page." },
  { id: "scribble",   name: "Scribble",       description: "Hand-drawn borders on warm paper." },
];

export default function FormDesignPage() {
  const { id } = useParams<{ id: string }>();
  const utils = trpc.useUtils();

  const { data: form, isLoading } = trpc.forms.get.useQuery({ formId: id }, { enabled: !!id });

  const updateMut = trpc.forms.update.useMutation({
    onSuccess: () => {
      toast.success("Theme applied");
      utils.forms.get.invalidate({ formId: id });
    },
    onError: (e) => toast.error(e.message),
  });

  const savedTheme = resolveFormTheme((form as any)?.settings?.formTheme);
  const [selected, setSelected] = useState<FormTheme>(savedTheme);
  const [hovered, setHovered] = useState<FormTheme | null>(null);
  const previewing = hovered ?? selected;

  /* Start from the saved theme whenever it changes on the server */
  useEffect(() => {
    if (form) setSelected(savedTheme);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedTheme, !!form]);

  const slug = (form as any)?.slug as string | undefined;
  const isPublished = (form as any)?.status === "published";
  const isDirty = selected !== savedTheme;

  function apply() {
    updateMut.mutate({
      formId: id,
      settings: { ...(form as any)?.settings, formTheme: selected },
    });
  }

  return (
    <div className="flex h-full flex-col overflow-hidden lg:flex-row">
      {/* ── Theme list ─────────────────────────────────────── */}
      <aside className="flex shrink-0 flex-col border-[var(--border-color)] bg-[var(--bg-panel)] max-lg:max-h-[46vh] max-lg:border-b lg:w-[360px] lg:border-r">
        <div className="px-5 pb-4 pt-6">
          <h2 className="font-display text-[28px] leading-none text-[var(--text-primary)]">Design</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Choose how respondents see this form. Hover to preview, click to select.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5" role="radiogroup" aria-label="Form theme">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {THEMES.map((t) => {
              const isSelected = selected === t.id;
              const isSaved = savedTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelected(t.id)}
                  onMouseEnter={() => setHovered(t.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(t.id)}
                  onBlur={() => setHovered(null)}
                  className={cn(
                    "group flex gap-3 rounded-xl p-2.5 text-left transition-[background-color,box-shadow] duration-150",
                    isSelected
                      ? "bg-[var(--color-accent-soft)] ring-2 ring-[var(--color-accent)]"
                      : "ring-1 ring-[var(--border-color)] hover:bg-[var(--bg-inset)]",
                  )}
                >
                  {/* Thumbnail of the theme */}
                  <span className="pointer-events-none h-[72px] w-[96px] shrink-0 overflow-hidden rounded-lg ring-1 ring-[var(--border-color)]">
                    <span className="block h-[144px] w-[192px] origin-top-left scale-50">
                      <ThemePreview theme={t.id} />
                    </span>
                  </span>
                  <span className="min-w-0 flex-1 py-0.5">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">{t.name}</span>
                      {isSaved && (
                        <span className="rounded-full bg-[var(--bg-inset)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
                          In use
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-[13px] leading-snug text-[var(--text-secondary)]">
                      {t.description}
                    </span>
                  </span>
                  {isSelected && <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-[var(--border-color)] px-5 py-4">
          <Button
            className="flex-1 !text-white"
            disabled={!isDirty}
            loading={updateMut.isPending}
            onClick={apply}
          >
            {isDirty ? "Apply theme" : "Theme applied"}
          </Button>
          {isPublished && slug && (
            <Button variant="secondary" asChild>
              <a href={`/f/${slug}`} target="_blank" rel="noreferrer" className="gap-1.5">
                <ExternalLink className="h-4 w-4" />
                Open form
              </a>
            </Button>
          )}
        </div>
      </aside>

      {/* ── Live preview of this form in the previewed theme ── */}
      <main className="flex min-h-0 flex-1 flex-col p-3 sm:p-5">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl ring-1 ring-[var(--border-color)]">
          <div className="flex h-10 shrink-0 items-center justify-between gap-3 bg-[var(--bg-panel)] px-4 text-[13px]">
            <span className="truncate text-[var(--text-muted)]">{slug ? `/f/${slug}` : "Form preview"}</span>
            <span className="shrink-0 font-medium text-[var(--text-primary)]">
              {THEMES.find((t) => t.id === previewing)?.name}
              {hovered && hovered !== selected && <span className="text-[var(--text-muted)]"> (preview)</span>}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-auto bg-[var(--bg-page)]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" exit={{ opacity: 0 }} className="mx-auto max-w-xl space-y-4 p-10">
                  <Skeleton className="h-10 w-48" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </motion.div>
              ) : form ? (
                <motion.div
                  key={previewing}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none select-none"
                  aria-hidden
                >
                  <PublicForm
                    form={{ ...(form as any), settings: { ...(form as any)?.settings, showProgressBar: false } }}
                    theme={previewing}
                    values={{}}
                    errors={{}}
                    email=""
                    emailError=""
                    isSubmitting={false}
                    submitError={null}
                    onFieldChange={() => {}}
                    onEmailChange={() => {}}
                    onSubmit={(e) => e.preventDefault()}
                    progress={0}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
