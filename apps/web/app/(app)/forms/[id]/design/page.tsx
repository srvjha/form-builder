"use client";

import { useParams }     from "next/navigation";
import { useState, useEffect } from "react";
import { motion }        from "framer-motion";
import { toast }         from "sonner";
import { Check, Sparkles, ExternalLink } from "lucide-react";
import { Button }        from "@/components/ui/button";
import { Skeleton }      from "@/components/ui/skeleton";
import { trpc }          from "@/lib/trpc";
import { cn }            from "@/lib/utils";
import {
  type FormTheme,
  ThemePreview,
} from "@/components/form-renderer/public-form";

/* ── Theme definitions ──────────────────────────────────────── */
const THEMES: {
  id:       FormTheme;
  name:     string;
  tagline:  string;
  tags:     string[];
  accent:   string; // for the "active" ring
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

  const [selected, setSelected] = useState<FormTheme>("brutalist");
  const [previewing, setPreviewing] = useState<FormTheme>("brutalist");

  /* Seed from server */
  useEffect(() => {
    if (!form) return;
    const saved = ((form.settings as any)?.formTheme as FormTheme) ?? "brutalist";
    setSelected(saved);
    setPreviewing(saved);
  }, [form?.id]);

  function handleApply() {
    updateMut.mutate({
      formId: id,
      settings: {
        ...(form?.settings as any),
        formTheme: selected,
      },
    });
  }

  const slug = (form as any)?.slug;
  const isDirty = selected !== (((form?.settings as any)?.formTheme as FormTheme) ?? "brutalist");

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
                const isSelected  = selected   === t.id;
                const isPreviewed = previewing === t.id;
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
                          className="flex h-4 w-4 items-center justify-center rounded-none"
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

          {slug && (
            <a
              href={`/f/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              View live form
            </a>
          )}
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

        {/* Theme preview fills the rest */}
        <div className="flex-1 overflow-hidden relative">
          {THEMES.map((t) => (
            <motion.div
              key={t.id}
              initial={false}
              animate={{ opacity: previewing === t.id ? 1 : 0, scale: previewing === t.id ? 1 : 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-0 overflow-auto"
              style={{ pointerEvents: previewing === t.id ? "auto" : "none" }}
            >
              <ThemePreviewFull theme={t.id} formTitle={form?.title} formDescription={(form as any)?.description} />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* ── Full-size theme preview (mock form, not functional) ─────── */
function ThemePreviewFull({
  theme,
  formTitle,
  formDescription,
}: {
  theme: FormTheme;
  formTitle?: string;
  formDescription?: string | null;
}) {
  const title = formTitle || "Customer Feedback";
  const desc  = formDescription || "We'd love to hear what you think. It only takes a minute.";

  switch (theme) {
    case "clean":    return <CleanFull title={title} desc={desc} />;
    case "playful":  return <PlayfulFull title={title} desc={desc} />;
    case "minimal":  return <MinimalFull title={title} desc={desc} />;
    default:         return <BrutalistFull title={title} desc={desc} />;
  }
}

/* ─ Shared mock fields ─ */
const MOCK_FIELDS = [
  { label: "What did you enjoy most?",          type: "text",   placeholder: "Tell us the highlights…" },
  { label: "How likely are you to recommend?",  type: "scale",  placeholder: ""                        },
  { label: "Any other feedback?",               type: "text",   placeholder: "Optional…"               },
];

function ScaleMock({ accent }: { accent: string }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          className="h-9 w-9 border-2 border-[#0A0A0A] flex items-center justify-center font-mono text-xs font-bold"
          style={n <= 7 ? { background: accent, borderColor: "#0A0A0A", color: "#fff" } : {}}
        >
          {n}
        </div>
      ))}
    </div>
  );
}

function BrutalistFull({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="min-h-full bg-[var(--bg-page)] bg-dot-grid px-8 py-10">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center border-2 border-[#0A0A0A] bg-[#FF3B00] px-3 py-1 shadow-[2px_2px_0_#0A0A0A]">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white">
              {MOCK_FIELDS.length} questions
            </span>
          </div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight">{title}</h1>
          <p className="mt-2 text-[var(--text-muted)]">{desc}</p>
        </div>

        {MOCK_FIELDS.map((f, i) => (
          <div key={i} className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A]">
            <div className="flex items-center gap-2 border-b-2 border-[#0A0A0A] px-4 py-1.5">
              <span className="font-mono text-[10px] font-bold text-[#FF3B00]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="p-4 space-y-2">
              <p className="font-display text-sm font-bold uppercase tracking-wide">{f.label}</p>
              {f.type === "scale"
                ? <ScaleMock accent="#FF3B00" />
                : <div className="h-9 w-full border-2 border-[#0A0A0A] bg-[var(--bg-inset)] px-3 flex items-center">
                    <span className="font-mono text-xs text-[var(--text-muted)]">{f.placeholder}</span>
                  </div>
              }
            </div>
          </div>
        ))}

        <div className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#FF3B00] px-6 py-2.5 shadow-[3px_3px_0_#0A0A0A] font-display text-xs font-extrabold uppercase tracking-wider text-white">
          Submit Response →
        </div>
      </div>
    </div>
  );
}

function CleanFull({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="min-h-full bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-xl space-y-3">
        <div className="rounded-2xl bg-white shadow-md border-t-8 border-blue-500 p-7 mb-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="mt-2 text-gray-500 text-sm">{desc}</p>
        </div>

        {MOCK_FIELDS.map((f, i) => (
          <div key={i} className="rounded-2xl bg-white shadow-sm border border-gray-200 p-5 space-y-2">
            <p className="text-sm font-semibold text-gray-800">{f.label}</p>
            {f.type === "scale"
              ? <div className="flex gap-1 flex-wrap">
                  {Array.from({ length: 10 }, (_, n) => n + 1).map((n) => (
                    <div
                      key={n}
                      className={cn(
                        "h-9 w-9 rounded-lg border text-xs font-semibold flex items-center justify-center",
                        n <= 7 ? "bg-blue-500 border-blue-500 text-white" : "border-gray-200 text-gray-400",
                      )}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              : <div className="h-9 w-full rounded-lg border border-gray-200 px-3 flex items-center">
                  <span className="text-sm text-gray-400">{f.placeholder}</span>
                </div>
            }
          </div>
        ))}

        <button className="rounded-lg bg-blue-600 px-7 py-2.5 text-sm font-semibold text-white shadow-sm">
          Submit →
        </button>
      </div>
    </div>
  );
}

const PASTEL = ["bg-violet-50 border-violet-200", "bg-pink-50 border-pink-200", "bg-sky-50 border-sky-200"];

function PlayfulFull({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      className="min-h-full px-6 py-10"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)" }}
    >
      <div className="mx-auto max-w-xl space-y-4">
        <div className="text-center mb-6">
          <span className="text-4xl">🎉</span>
          <h1 className="mt-2 text-2xl font-extrabold text-white">{title}</h1>
          <p className="mt-1 text-purple-100 text-sm">{desc}</p>
        </div>

        {MOCK_FIELDS.map((f, i) => (
          <div key={i} className={cn("rounded-2xl border-2 p-5", PASTEL[i % PASTEL.length])}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{i === 0 ? "✏️" : i === 1 ? "📊" : "📝"}</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Question {i + 1}</span>
            </div>
            <p className="text-sm font-bold text-gray-800 mb-2">{f.label}</p>
            {f.type === "scale"
              ? <div className="flex gap-1 flex-wrap">
                  {Array.from({ length: 10 }, (_, n) => n + 1).map((n) => (
                    <div
                      key={n}
                      className="h-9 w-9 border-2 border-[#0A0A0A] flex items-center justify-center font-mono text-xs font-bold"
                      style={n <= 7 ? { background: "#7C3AED", color: "#fff" } : {}}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              : <div className="h-9 w-full rounded-xl border-2 border-violet-200 bg-white px-3 flex items-center">
                  <span className="text-sm text-gray-400">{f.placeholder}</span>
                </div>
            }
          </div>
        ))}

        <button className="w-full rounded-2xl bg-white px-8 py-4 text-base font-extrabold text-purple-700 shadow-lg">
          🚀 Submit Response
        </button>
      </div>
    </div>
  );
}

function MinimalFull({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="min-h-full bg-white px-10 py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">{desc}</p>
        <div className="mt-8 h-px bg-gray-200" />

        <div className="space-y-12 mt-10">
          {MOCK_FIELDS.map((f, i) => (
            <div key={i}>
              <p className="text-sm font-medium text-gray-700 mb-3">{f.label}</p>
              {f.type === "scale"
                ? <div className="flex gap-1 flex-wrap">
                    {Array.from({ length: 10 }, (_, n) => n + 1).map((n) => (
                      <div
                        key={n}
                        className="h-9 w-9 border-2 border-[#0A0A0A] flex items-center justify-center font-mono text-xs font-bold"
                        style={n <= 7 ? { background: "#111827", color: "#fff" } : {}}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                : <div className="h-9 w-full border-b-2 border-gray-200 flex items-end pb-1">
                    <span className="text-sm text-gray-400">{f.placeholder}</span>
                  </div>
              }
              <div className="mt-8 h-px bg-gray-100" />
            </div>
          ))}

          <button className="inline-flex items-center gap-2 border border-gray-900 bg-gray-900 text-white px-7 py-2.5 text-sm font-semibold rounded-sm">
            Submit →
          </button>
        </div>
      </div>
    </div>
  );
}
