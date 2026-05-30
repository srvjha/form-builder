"use client";

import { useParams }     from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast }         from "sonner";
import { Check, Sparkles, ExternalLink, Globe } from "lucide-react";
import { Button }        from "@/components/ui/button";
import { Skeleton }      from "@/components/ui/skeleton";
import { trpc }          from "@/lib/trpc";
import { cn }            from "@/lib/utils";
import {
  PublicForm,
  type FormTheme,
} from "@/components/form-renderer/public-form";

/* ── Theme definitions ──────────────────────────────────────── */
const THEMES: {
  id:       FormTheme;
  name:     string;
  tagline:  string;
  tags:     string[];
  accent:   string;
}[] = [
  {
    id:      "brutalist",
    name:    "Brutalist Pro",
    tagline: "Hard borders, offset shadows, numbered questions",
    tags:    ["Bold", "Minimal", "On-brand"],
    accent:  "#FF3B00",
  },
  {
    id:      "clean",
    name:    "Clean Card",
    tagline: "White cards, soft shadows, blue accent",
    tags:    ["Professional", "Modern", "Familiar"],
    accent:  "#3B82F6",
  },
  {
    id:      "playful",
    name:    "Animated Playful",
    tagline: "Vibrant gradient, spring animations, emoji hints",
    tags:    ["Fun", "Lively", "Engaging"],
    accent:  "#7C3AED",
  },
  {
    id:      "minimal",
    name:    "Notion Minimal",
    tagline: "Clean white, underline inputs, editorial feel",
    tags:    ["Clean", "Focus", "Distraction-free"],
    accent:  "#111827",
  },
];

/* ── Page ───────────────────────────────────────────────────── */
export default function FormDesignPage() {
  const { id } = useParams<{ id: string }>();
  const utils  = trpc.useUtils();

  const { data: form, isLoading } = trpc.forms.get.useQuery(
    { formId: id },
    { enabled: !!id },
  );

  const updateMut = trpc.forms.update.useMutation({
    onSuccess: () => {
      toast.success("Theme applied!");
      utils.forms.get.invalidate({ formId: id });
    },
    onError: (e) => toast.error(e.message),
  });

  const [selected,   setSelected]   = useState<FormTheme>("brutalist");
  const [previewing, setPreviewing] = useState<FormTheme>("brutalist");

  /* Seed from server — re-runs when settings change */
  useEffect(() => {
    if (!form) return;
    const saved = ((form as any).settings?.formTheme as FormTheme) ?? "brutalist";
    setSelected(saved);
    setPreviewing(saved);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(form as any)?.settings?.formTheme]);

  function handleApply() {
    updateMut.mutate({
      formId: id,
      settings: {
        ...(form as any)?.settings,
        formTheme: selected,
      },
    });
  }

  const slug       = (form as any)?.slug as string | undefined;
  const isPublished = (form as any)?.status === "published";
  const savedTheme  = ((form as any)?.settings?.formTheme as FormTheme) ?? "brutalist";
  const isDirty     = selected !== savedTheme;

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Left: theme list ──────────────────────────────────── */}
      <aside className="w-72 shrink-0 flex flex-col border-r-2 border-[#0A0A0A] bg-[var(--bg-panel)] overflow-hidden">
        {/* Header */}
        <div className="border-b-2 border-[#0A0A0A] px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" />
            <p className="label-overline">Choose a theme</p>
          </div>
          <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">
            Hover to preview · click to select
          </p>
        </div>

        {/* Theme list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))
            : THEMES.map((t) => {
                const isSelected = selected === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setSelected(t.id); setPreviewing(t.id); }}
                    onMouseEnter={() => setPreviewing(t.id)}
                    onMouseLeave={() => setPreviewing(selected)}
                    className={cn(
                      "group w-full text-left border-2 transition-all p-3 space-y-1",
                      isSelected
                        ? "border-[var(--color-accent)] shadow-[3px_3px_0_var(--color-accent)] bg-[var(--bg-inset)]"
                        : "border-[#0A0A0A] shadow-[2px_2px_0_#0A0A0A] bg-[var(--bg-panel)] hover:shadow-[3px_3px_0_#0A0A0A] hover:bg-[var(--bg-inset)]",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-extrabold uppercase tracking-wide">
                        {t.name}
                      </span>
                      {isSelected && (
                        <span
                          className="flex h-4 w-4 items-center justify-center"
                          style={{ background: t.accent }}
                        >
                          <Check className="h-2.5 w-2.5 text-white" />
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] leading-snug">
                      {t.tagline}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {t.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[9px] border border-[var(--border-muted)] px-1.5 py-0.5 text-[var(--text-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
        </div>

        {/* Apply CTA */}
        <div className="border-t-2 border-[#0A0A0A] p-4 space-y-2">
          <Button
            size="sm"
            loading={updateMut.isPending}
            disabled={!isDirty}
            onClick={handleApply}
            className="w-full gap-2"
          >
            <Check className="h-3.5 w-3.5" />
            {isDirty ? "Apply theme" : "Theme applied"}
          </Button>

          {slug ? (
            isPublished ? (
              <a
                href={`/f/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                View live form
              </a>
            ) : (
              <div className="flex items-center justify-center gap-1.5 w-full font-mono text-[10px] text-[var(--text-muted)]">
                <Globe className="h-3 w-3" />
                Publish form to view live
              </div>
            )
          ) : null}
        </div>
      </aside>

      {/* ── Right: live preview ───────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-page)]">
        {/* Preview label bar */}
        <div className="flex h-10 shrink-0 items-center justify-between border-b-2 border-[#0A0A0A] bg-[var(--bg-panel)] px-5">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-red)] border border-[#0A0A0A]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-yellow)] border border-[#0A0A0A]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-green)] border border-[#0A0A0A]" />
            <span className="ml-2 font-mono text-[10px] text-[var(--text-muted)]">
              {slug ? `/f/${slug}` : "form preview"}
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
            {THEMES.find((t) => t.id === previewing)?.name}
          </span>
        </div>

        {/* Real form preview with the current previewing theme */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-10 space-y-4 max-w-xl mx-auto"
              >
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-24 w-full" />
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
      </main>
    </div>
  );
}
