"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldRenderer } from "@/components/form-renderer/field-renderer";
import type { PublicField } from "@/components/form-renderer/field-renderer";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

/* ── Types ──────────────────────────────────────────────────── */

export type FormTheme = "brutalist" | "clean" | "playful" | "minimal" | "terminal" | "government" | "newspaper" | "scribble";

export interface PublicFormData {
  id: string;
  title: string;
  description?: string | null;
  collectEmail: boolean;
  settings?: {
    showProgressBar?: boolean;
    formTheme?: string;
    [key: string]: unknown;
  } | null;
  fields?: unknown[];
}

export interface PublicFormProps {
  form: PublicFormData;
  theme: FormTheme;
  values: Record<string, string | string[]>;
  errors: Record<string, string>;
  email: string;
  emailError: string;
  isSubmitting: boolean;
  submitError?: string | null;
  onFieldChange: (id: string, value: string | string[]) => void;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  progress: number;
}

/* ─────────────────────────────────────────────────────────────
   THEME 1 — Brutalist Pro
   Hard borders, offset shadows, numbered questions, dot-grid bg
───────────────────────────────────────────────────────────── */
function BrutalistForm({
  form, theme: _theme, values, errors, email, emailError,
  isSubmitting, submitError, onFieldChange, onEmailChange,
  onSubmit, progress,
}: PublicFormProps) {
  const fields = (form.fields ?? []) as PublicField[];
  const showProgress = form.settings?.showProgressBar && fields.length > 0;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] bg-dot-grid">
      {showProgress && (
        <div className="fixed top-0 inset-x-0 z-50">
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-6 py-16 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="mb-3 inline-flex items-center border-2 border-[#0A0A0A] bg-[var(--color-accent)] px-3 py-1 shadow-[2px_2px_0_#0A0A0A]">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white">
              {fields.length} question{fields.length !== 1 ? "s" : ""}
            </span>
          </div>
          <h1 className="font-display text-4xl font-black uppercase leading-tight tracking-tight md:text-5xl">
            {form.title}
          </h1>
          {form.description && (
            <p className="mt-3 text-[var(--text-muted)] leading-relaxed">{form.description}</p>
          )}
        </motion.div>

        <form onSubmit={onSubmit} noValidate>
          <div className="space-y-6">
            {form.collectEmail && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 }}
              >
                <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A]">
                  <div className="flex items-center gap-3 border-b-2 border-[#0A0A0A] px-5 py-2">
                    <span className="font-mono text-[10px] font-bold text-[var(--color-accent)]">EMAIL</span>
                  </div>
                  <div className="p-5 space-y-1.5">
                    <Label htmlFor="respondent-email" className="text-xs font-bold uppercase tracking-wider">Your email</Label>
                    <Input
                      id="respondent-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => onEmailChange(e.target.value)}
                      error={!!emailError}
                      required
                    />
                    {emailError && <p className="font-mono text-xs text-[var(--color-red)]">{emailError}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {fields.map((field, i) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                  className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[3px_3px_0_#0A0A0A]"
                >
                  <div className="flex items-center gap-3 border-b-2 border-[#0A0A0A] px-5 py-2">
                    <span className="font-mono text-[10px] font-bold text-[var(--color-accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {field.required && (
                      <span className="ml-auto font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--color-red)]">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <FieldRenderer
                      field={field}
                      value={values[field.id] ?? (field.type === "multi_select" ? [] : "")}
                      onChange={(v) => onFieldChange(field.id, v)}
                      error={errors[field.id]}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {submitError && (
              <div className="border-l-4 border-[var(--color-red)] bg-[var(--bg-panel)] px-4 py-3 font-mono text-xs text-[var(--color-red)]">
                {submitError}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + fields.length * 0.04 }}
            >
              <Button type="submit" size="lg" loading={isSubmitting} className="gap-2 shadow-brut-lg">
                Submit Response <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </form>

        <div className="mt-14 flex items-center gap-2 border-t-2 border-[var(--border-muted)] pt-6">
          <Zap className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span className="font-mono text-xs text-[var(--text-muted)]">
            Powered by{" "}
            <Link href="/" className="font-bold hover:text-[var(--text-primary)]">{APP_NAME}</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   THEME 2 — Clean Card
   White cards, rounded corners, blue accent, Google Forms feel
───────────────────────────────────────────────────────────── */
function CleanCardForm({
  form, theme: _theme, values, errors, email, emailError,
  isSubmitting, submitError, onFieldChange, onEmailChange,
  onSubmit, progress,
}: PublicFormProps) {
  const fields = (form.fields ?? []) as PublicField[];
  const showProgress = form.settings?.showProgressBar && fields.length > 0;

  /* Force light-mode CSS vars so FieldRenderer inputs aren't dark */
  const lightVars = {
    "--bg-inset":     "#EFF6FF",
    "--bg-panel":     "#FFFFFF",
    "--text-primary": "#0F172A",
    "--text-muted":   "#64748B",
    "--border-color": "#CBD5E1",
    "--border-muted": "#E2E8F0",
    "--color-accent": "#3B82F6",
    "--color-red":    "#EF4444",
    "--shadow-xs":    "0 1px 2px rgba(0,0,0,0.05)",
    "--shadow-sm":    "0 1px 3px rgba(0,0,0,0.1)",
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-slate-100" style={lightVars}>
      {/* Progress strip */}
      {showProgress && (
        <div className="fixed top-0 inset-x-0 z-50 h-1 bg-slate-200">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="mx-auto max-w-xl px-4 py-12 pt-16">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 overflow-hidden rounded-2xl bg-white shadow-md border-t-8 border-blue-500"
        >
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              {form.title}
            </h1>
            {form.description && (
              <p className="mt-3 text-gray-500 leading-relaxed">{form.description}</p>
            )}
            {showProgress && (
              <p className="mt-4 text-xs text-gray-400 font-medium">
                {progress}% complete
              </p>
            )}
          </div>
        </motion.div>

        <form onSubmit={onSubmit} noValidate className="space-y-3">
          {form.collectEmail && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6"
            >
              <label
                htmlFor="respondent-email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email address
                <span className="ml-1 text-red-400">*</span>
              </label>
              <input
                id="respondent-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className={cn(
                  "w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all",
                  "focus:ring-2 focus:ring-blue-300 focus:border-blue-400",
                  emailError
                    ? "border-red-300 bg-red-50/50"
                    : "border-gray-300 bg-white",
                )}
              />
              {emailError && (
                <p className="mt-1.5 text-xs text-red-500">{emailError}</p>
              )}
            </motion.div>
          )}

          {fields.map((field, i) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 + i * 0.03 }}
              className={cn(
                "rounded-2xl bg-white shadow-sm border p-6 transition-all",
                errors[field.id]
                  ? "border-red-200 shadow-red-50/80"
                  : "border-gray-200 hover:shadow-md",
              )}
            >
              <FieldRenderer
                field={field}
                value={values[field.id] ?? (field.type === "multi_select" ? [] : "")}
                onChange={(v) => onFieldChange(field.id, v)}
                error={errors[field.id]}
              />
            </motion.div>
          ))}

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold text-white",
                "bg-blue-600 shadow-sm transition-all",
                "hover:bg-blue-700 hover:shadow-md active:scale-[0.98]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {isSubmitting ? "Submitting…" : "Submit"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mt-12 flex items-center gap-1.5 text-xs text-gray-400">
          <Zap className="h-3 w-3" />
          <span>
            Powered by{" "}
            <Link href="/" className="font-medium hover:text-gray-600">
              {APP_NAME}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   THEME 3 — Animated Playful
   Vibrant gradient, spring animations, emoji type hints, pastel cards
───────────────────────────────────────────────────────────── */

const FIELD_EMOJIS: Partial<Record<string, string>> = {
  short_text:   "✏️",
  long_text:    "📝",
  email:        "📧",
  number:       "🔢",
  phone:        "📱",
  url:          "🌐",
  date:         "📅",
  time:         "⏰",
  select:       "🎯",
  multi_select: "✅",
  checkbox:     "☑️",
  rating:       "⭐",
  scale:        "📊",
  file_upload:  "📎",
};

const PASTEL_CARDS = [
  "bg-violet-50/90 border-violet-200",
  "bg-pink-50/90   border-pink-200",
  "bg-sky-50/90    border-sky-200",
  "bg-emerald-50/90 border-emerald-200",
  "bg-amber-50/90  border-amber-200",
  "bg-rose-50/90   border-rose-200",
];

const spring = { type: "spring" as const, stiffness: 280, damping: 22 };

function PlayfulForm({
  form, theme: _theme, values, errors, email, emailError,
  isSubmitting, submitError, onFieldChange, onEmailChange,
  onSubmit, progress,
}: PublicFormProps) {
  const fields = (form.fields ?? []) as PublicField[];

  /* Force light vars inside pastel cards so FieldRenderer inputs look correct */
  const lightVars = {
    "--bg-inset":     "#EDE9FE",
    "--bg-panel":     "#FFFFFF",
    "--text-primary": "#1F2937",
    "--text-muted":   "#6B7280",
    "--border-color": "#A78BFA",
    "--border-muted": "#DDD6FE",
    "--color-accent": "#7C3AED",
    "--color-red":    "#EF4444",
    "--shadow-xs":    "0 1px 2px rgba(0,0,0,0.05)",
    "--shadow-sm":    "0 2px 4px rgba(0,0,0,0.08)",
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)", ...lightVars }}
    >
      {/* Subtle progress dots */}
      {form.settings?.showProgressBar && fields.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5">
          <span className="text-xs font-bold text-white">{progress}%</span>
          <div className="h-1.5 w-16 rounded-full bg-white/30">
            <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-xl px-5 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={spring}
          className="mb-8 text-center"
        >
          <motion.div
            className="mb-3 inline-block text-5xl"
            animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            🎉
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white leading-tight drop-shadow-md">
            {form.title}
          </h1>
          {form.description && (
            <p className="mt-2 text-purple-100 leading-relaxed">{form.description}</p>
          )}
        </motion.div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {form.collectEmail && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={spring}
              className="rounded-2xl border-2 bg-purple-50/90 border-purple-200 p-5 shadow-lg"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">📧</span>
                <label
                  htmlFor="respondent-email"
                  className="text-sm font-bold text-gray-700"
                >
                  Your email
                </label>
              </div>
              <input
                id="respondent-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className={cn(
                  "w-full rounded-xl border-2 px-4 py-2.5 text-sm outline-none transition-all",
                  "focus:scale-[1.01] focus:shadow-md",
                  emailError
                    ? "border-red-300 bg-red-50"
                    : "border-purple-200 bg-white focus:border-purple-400",
                )}
              />
              {emailError && <p className="mt-1.5 text-xs text-red-500">{emailError}</p>}
            </motion.div>
          )}

          {fields.map((field, i) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ ...spring, delay: 0.06 * i }}
              className={cn(
                "rounded-2xl border-2 p-5 shadow-lg",
                PASTEL_CARDS[i % PASTEL_CARDS.length],
              )}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">{FIELD_EMOJIS[field.type] ?? "❓"}</span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Question {i + 1}
                </span>
                {field.required && (
                  <span className="ml-auto text-xs font-bold text-rose-400">✦ required</span>
                )}
              </div>
              {(field.type === "select" || field.type === "multi_select") && field.options?.length ? (
                <div className="flex flex-col gap-2">
                  {field.options.map((opt) => {
                    const val = values[field.id];
                    const active = field.type === "multi_select"
                      ? (Array.isArray(val) ? val : []).includes(opt.value)
                      : val === opt.value;
                    function toggle() {
                      if (field.type === "multi_select") {
                        const cur = Array.isArray(val) ? val : [];
                        onFieldChange(field.id, active ? cur.filter((v) => v !== opt.value) : [...cur, opt.value]);
                      } else {
                        onFieldChange(field.id, active ? "" : opt.value);
                      }
                    }
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={toggle}
                        className={cn(
                          "flex items-center gap-3 w-full text-left text-sm px-4 py-3 rounded-xl border-2 transition-all",
                          active
                            ? "bg-violet-100 border-violet-400 text-violet-900 font-bold"
                            : "bg-white/70 border-violet-200 text-gray-700 hover:border-violet-300 hover:bg-violet-50",
                        )}
                      >
                        <span className={cn(
                          "flex h-5 w-5 rounded-full border-2 items-center justify-center flex-shrink-0 text-[10px] font-black",
                          active ? "border-violet-500 bg-violet-500 text-white" : "border-violet-300 bg-white",
                        )}>
                          {active && "✓"}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <FieldRenderer
                  field={field}
                  value={values[field.id] ?? ""}
                  onChange={(v) => onFieldChange(field.id, v)}
                  error={errors[field.id]}
                />
              )}
              {(field.type === "select" || field.type === "multi_select") && errors[field.id] && (
                <p className="mt-2 text-xs text-red-500">{errors[field.id]}</p>
              )}
            </motion.div>
          ))}

          {submitError && (
            <div className="rounded-2xl border-2 border-red-200 bg-red-50/90 px-5 py-4 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: Math.max(0.1, 0.06 * fields.length) }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full rounded-2xl bg-white px-8 py-4 text-base font-extrabold text-purple-700",
                "shadow-lg transition-all duration-150",
                "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {isSubmitting ? "🎊 Sending…" : "🚀 Submit Response"}
            </button>
          </motion.div>
        </form>

        <div className="mt-10 flex items-center justify-center gap-1.5 text-xs text-white/50">
          <Zap className="h-3 w-3" />
          <span>
            Powered by{" "}
            <Link href="/" className="font-medium hover:text-white/80">
              {APP_NAME}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   THEME 4 — Notion Minimal
   Clean white, underline-only inputs, no cards, editorial feel
───────────────────────────────────────────────────────────── */
function MinimalForm({
  form, theme: _theme, values, errors, email, emailError,
  isSubmitting, submitError, onFieldChange, onEmailChange,
  onSubmit, progress,
}: PublicFormProps) {
  const fields = (form.fields ?? []) as PublicField[];
  const showProgress = form.settings?.showProgressBar && fields.length > 0;

  /* Force light vars so FieldRenderer inputs stay visible on white bg */
  const lightVars = {
    "--bg-inset":     "#F3F4F6",
    "--bg-panel":     "#FFFFFF",
    "--text-primary": "#111827",
    "--text-muted":   "#6B7280",
    "--border-color": "#D1D5DB",
    "--border-muted": "#E5E7EB",
    "--color-accent": "#111827",
    "--color-red":    "#EF4444",
    "--shadow-xs":    "none",
    "--shadow-sm":    "none",
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-white" style={lightVars}>
      {showProgress && (
        <div className="fixed top-0 inset-x-0 z-50 h-[2px]">
          <div
            className="h-full bg-gray-900 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="mx-auto max-w-lg px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight leading-tight">
            {form.title}
          </h1>
          {form.description && (
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">{form.description}</p>
          )}
          <div className="mt-6 h-px bg-gray-200" />
        </motion.div>

        <form onSubmit={onSubmit} noValidate>
          <div className="space-y-12">
            {form.collectEmail && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label
                  htmlFor="respondent-email"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Email address
                </label>
                <input
                  id="respondent-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className={cn(
                    "w-full border-0 border-b-2 bg-transparent px-0 py-2 text-sm text-gray-900",
                    "outline-none transition-colors placeholder-gray-400",
                    emailError
                      ? "border-red-400"
                      : "border-gray-200 focus:border-gray-900",
                  )}
                />
                {emailError && <p className="mt-2 text-xs text-red-500">{emailError}</p>}
                <div className="mt-8 h-px bg-gray-100" />
              </motion.div>
            )}

            {fields.map((field, i) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.3 }}
              >
                {(field.type === "select" || field.type === "multi_select") && field.options?.length ? (
                  <div className="flex flex-col">
                    {field.options.map((opt) => {
                      const val = values[field.id];
                      const active = field.type === "multi_select"
                        ? (Array.isArray(val) ? val : []).includes(opt.value)
                        : val === opt.value;
                      function toggle() {
                        if (field.type === "multi_select") {
                          const cur = Array.isArray(val) ? val : [];
                          onFieldChange(field.id, active ? cur.filter((v) => v !== opt.value) : [...cur, opt.value]);
                        } else {
                          onFieldChange(field.id, active ? "" : opt.value);
                        }
                      }
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={toggle}
                          className={cn(
                            "flex items-center gap-3 w-full text-left text-sm py-3 border-b transition-colors",
                            active
                              ? "border-gray-900 text-gray-900 font-semibold"
                              : "border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400",
                          )}
                        >
                          <span className={cn(
                            "h-4 w-4 border-2 flex-shrink-0 flex items-center justify-center text-[9px] font-black",
                            active ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-transparent",
                          )}>
                            {active && "✓"}
                          </span>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <FieldRenderer
                    field={field}
                    value={values[field.id] ?? ""}
                    onChange={(v) => onFieldChange(field.id, v)}
                    error={errors[field.id]}
                  />
                )}
                {(field.type === "select" || field.type === "multi_select") && errors[field.id] && (
                  <p className="mt-2 text-xs text-red-500">{errors[field.id]}</p>
                )}
                <div className="mt-8 h-px bg-gray-100" />
              </motion.div>
            ))}

            {submitError && (
              <p className="text-sm text-red-500">{submitError}</p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + 0.04 * fields.length, duration: 0.3 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "inline-flex items-center gap-2 px-7 py-2.5 text-sm font-semibold",
                  "border border-gray-900 bg-gray-900 text-white rounded-sm",
                  "transition-all hover:bg-white hover:text-gray-900",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
              >
                {isSubmitting ? "Submitting…" : "Submit"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          </div>
        </form>

        <div className="mt-16 flex items-center gap-1.5 text-xs text-gray-400">
          <Zap className="h-3 w-3" />
          <span>
            Powered by{" "}
            <Link href="/" className="hover:text-gray-600">
              {APP_NAME}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   THEME 5 — Terminal
   Dark green-on-black, monospace, CLI feel
───────────────────────────────────────────────────────────── */
function TerminalForm({
  form, values, errors, email, emailError,
  isSubmitting, submitError, onFieldChange, onEmailChange,
  onSubmit,
}: PublicFormProps) {
  const fields = (form.fields ?? []) as PublicField[];

  const termVars = {
    "--bg-inset":     "#0D1117",
    "--bg-panel":     "#161B22",
    "--text-primary": "#7EE787",
    "--text-muted":   "#3D7A3D",
    "--border-color": "#30A030",
    "--border-muted": "#1E3D1E",
    "--color-accent": "#7EE787",
    "--color-red":    "#FF4040",
    "--shadow-xs":    "0 0 4px rgba(126,231,135,0.25)",
    "--shadow-sm":    "0 0 8px rgba(126,231,135,0.25)",
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-[#0D1117] font-mono" style={termVars}>
      {/* Window chrome */}
      <div className="sticky top-0 z-10 border-b border-[#30A030]/30 bg-[#161B22] px-5 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <div className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="ml-3 text-[11px] text-[#3D7A3D]">
          formcraft — {form.title.toLowerCase().replace(/\s+/g, "_")}.sh
        </span>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10">
        {/* Boot sequence */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 space-y-1 text-sm">
          <p className="text-[#3D7A3D] text-xs">FormCraft Terminal v1.0.0 — session started</p>
          <p className="text-[#7EE787]">
            <span className="text-[#3D7A3D]">$ </span>
            ./run_form.sh <span className="text-white">&quot;{form.title}&quot;</span>
          </p>
          {form.description && (
            <p className="text-[#3D7A3D] text-xs pl-2"># {form.description}</p>
          )}
          <p className="text-[#7EE787]">
            <span className="text-[#3D7A3D]">$ </span>
            cat README &nbsp;
            <span className="text-[#A0D0A0] text-xs">→ {fields.length} field{fields.length !== 1 ? "s" : ""} to complete</span>
          </p>
          <p className="text-[#3D7A3D] text-xs">──────────────────────────────────────────</p>
        </motion.div>

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {form.collectEmail && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-[#3D7A3D] text-xs mb-1">
                <span className="text-[#7EE787]">$</span> input --field=email --required
              </p>
              <div className="border border-[#30A030]/40 bg-[#0D1117] p-4">
                <label className="block text-xs text-[#7EE787] mb-2">{">"} EMAIL_ADDRESS:</label>
                <input
                  id="respondent-email"
                  type="email"
                  placeholder="user@domain.com_"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className="w-full border-0 border-b border-[#30A030]/50 bg-transparent pb-1 text-sm text-[#7EE787] placeholder:text-[#3D7A3D] outline-none font-mono caret-[#7EE787]"
                />
                {emailError && <p className="mt-1.5 text-xs text-[#FF4040]"># ERROR: {emailError}</p>}
              </div>
            </motion.div>
          )}

          {fields.map((field, i) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <p className="text-[#3D7A3D] text-xs mb-1">
                <span className="text-[#7EE787]">$</span>{" "}
                input --field={String(i + 1).padStart(2, "0")}{" "}
                {field.required ? "--required" : "--optional"}
              </p>
              <div className="border border-[#30A030]/40 bg-[#0D1117] p-4">
                <div className="text-xs text-[#7EE787] mb-2">
                  {">"} {field.label.toUpperCase().replace(/\s+/g, "_")}:
                  {field.helpText && (
                    <span className="text-[#3D7A3D] ml-2">{"// "}{field.helpText}</span>
                  )}
                </div>
                <FieldRenderer
                  field={field}
                  value={values[field.id] ?? (field.type === "multi_select" ? [] : "")}
                  onChange={(v) => onFieldChange(field.id, v)}
                  error={undefined}
                />
                {errors[field.id] && (
                  <p className="mt-1.5 text-xs text-[#FF4040]"># ERROR: {errors[field.id]}</p>
                )}
              </div>
            </motion.div>
          ))}

          {submitError && (
            <p className="text-sm text-[#FF4040] font-mono"># FATAL: {submitError}</p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + 0.05 * fields.length }}
            className="pt-2"
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 border border-[#30A030]/60 bg-[#0D1117] px-6 py-3 text-sm text-[#7EE787] hover:bg-[#161B22] transition-colors disabled:opacity-50 font-mono"
            >
              <span className="text-[#3D7A3D]">$</span>
              {isSubmitting ? "./submitting.sh --wait…" : "./submit_form.sh --confirm"}
            </button>
          </motion.div>
        </form>

        <div className="mt-12 text-[#3D7A3D] text-xs">
          <span>~$ </span>
          <Link href="/" className="hover:text-[#7EE787] transition-colors">
            Powered by {APP_NAME}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   THEME 6 — Indian Government Website
   Tricolor header, navy blue, orange accents, table layout
───────────────────────────────────────────────────────────── */
function GovtForm({
  form, values, errors, email, emailError,
  isSubmitting, submitError, onFieldChange, onEmailChange,
  onSubmit,
}: PublicFormProps) {
  const fields = (form.fields ?? []) as PublicField[];

  const govtVars = {
    "--bg-inset":     "#FFFFFF",
    "--bg-panel":     "#F5F5F5",
    "--text-primary": "#1A1A1A",
    "--text-muted":   "#555555",
    "--border-color": "#AAAAAA",
    "--border-muted": "#CCCCCC",
    "--color-accent": "#FF6600",
    "--color-red":    "#CC0000",
    "--shadow-xs":    "none",
    "--shadow-sm":    "none",
  } as React.CSSProperties;

  const refNo = `FC/${new Date().getFullYear()}/GS-001`;

  return (
    <div
      className="min-h-screen bg-white"
      style={{ ...govtVars, fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* Tricolor strip */}
      <div className="flex h-2">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-[#CCCCCC]" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Official header */}
      <div className="bg-[#1B2A6B] px-4 py-5">
        <div className="max-w-3xl mx-auto flex items-center gap-5">
          <div className="h-16 w-16 shrink-0 rounded-full border-4 border-[#FF9933] flex items-center justify-center">
            <div className="h-11 w-11 rounded-full border-2 border-[#FF9933] flex items-center justify-center text-[#FF9933] text-xl font-bold">
              ✦
            </div>
          </div>
          <div className="text-white">
            <div className="text-[11px] uppercase tracking-widest text-blue-300">
              Government of India — e-Forms Portal
            </div>
            <div className="text-xl font-bold uppercase tracking-wide leading-snug mt-0.5">
              {form.title}
            </div>
            {form.description && (
              <div className="text-xs text-blue-200 mt-1">{form.description}</div>
            )}
          </div>
        </div>
      </div>
      <div className="h-1 bg-[#FF9933]" />

      {/* Metadata bar */}
      <div className="bg-[#EEF2FF] border-b border-[#C0C8E0] px-4 py-2">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-[#333]">
          <span><strong>Form Ref.:</strong> {refNo}</span>
          <span><strong>Category:</strong> General Services</span>
          <span className="text-[#CC0000] font-semibold">
            Fields marked (*) are Mandatory
          </span>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={onSubmit} noValidate>
          <div className="bg-[#1B2A6B] text-white text-xs font-bold uppercase px-3 py-2 tracking-wider">
            Section I: Applicant Details
          </div>

          <table className="w-full border-collapse text-sm">
            {form.collectEmail && (
              <tr>
                <td className="border border-[#CCCCCC] bg-[#F0F4FF] px-3 py-3 w-[42%] font-semibold text-[#333] align-top">
                  Email Address{" "}
                  <span className="text-[#CC0000]">*</span>
                </td>
                <td className="border border-[#CCCCCC] bg-white px-3 py-2">
                  <input
                    id="respondent-email"
                    type="email"
                    placeholder="Enter valid email address"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    className="w-full border border-[#AAAAAA] px-2 py-1.5 text-sm outline-none focus:border-[#1B2A6B] bg-white"
                    style={{ fontFamily: "inherit" }}
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-[#CC0000]">{emailError}</p>
                  )}
                </td>
              </tr>
            )}
            {fields.map((field, i) => (
              <tr key={field.id}>
                <td className="border border-[#CCCCCC] bg-[#F0F4FF] px-3 py-3 font-semibold text-[#333] align-top">
                  {i + 1}.&nbsp;{field.label}
                  {field.required && <span className="text-[#CC0000] ml-1">*</span>}
                  {field.helpText && (
                    <div className="text-xs text-[#666] font-normal mt-0.5">
                      ({field.helpText})
                    </div>
                  )}
                </td>
                <td className="border border-[#CCCCCC] bg-white px-3 py-2">
                  <FieldRenderer
                    field={field}
                    value={values[field.id] ?? (field.type === "multi_select" ? [] : "")}
                    onChange={(v) => onFieldChange(field.id, v)}
                    error={errors[field.id]}
                  />
                </td>
              </tr>
            ))}
          </table>

          {submitError && (
            <div className="mt-4 border border-[#CC0000] bg-[#FFF5F5] px-4 py-3 text-sm text-[#CC0000]">
              <strong>Error:</strong> {submitError}
            </div>
          )}

          {/* Declaration box */}
          <div className="mt-5 border border-[#CCCCCC] bg-[#FFFBE6] px-4 py-3 text-xs text-[#333]">
            <strong>Declaration:</strong> I hereby declare that the information furnished above is true and correct to the best of my knowledge and belief.
          </div>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <button
              type="submit"
              disabled={isSubmitting}
              className="border-2 border-[#1B2A6B] bg-[#1B2A6B] text-white px-8 py-2 text-sm font-bold uppercase tracking-wider hover:bg-[#142055] disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? "SUBMITTING…" : "SUBMIT FORM"}
            </button>
            <button
              type="reset"
              className="border-2 border-[#AAAAAA] px-8 py-2 text-sm font-bold uppercase tracking-wider text-[#555] hover:bg-[#F5F5F5] transition-colors"
            >
              RESET
            </button>
          </div>
        </form>
      </div>

      {/* Official footer */}
      <div className="mt-10 bg-[#1B2A6B] py-3 text-center text-xs text-blue-200">
        Powered by{" "}
        <Link href="/" className="text-[#FF9933] hover:underline">
          {APP_NAME}
        </Link>{" "}
        | © {new Date().getFullYear()} All Rights Reserved
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   THEME 7 — Newspaper
   Serif typesetting, newsprint bg, editorial layout
───────────────────────────────────────────────────────────── */
function NewspaperForm({
  form, values, errors, email, emailError,
  isSubmitting, submitError, onFieldChange, onEmailChange,
  onSubmit,
}: PublicFormProps) {
  const fields = (form.fields ?? []) as PublicField[];

  const newsVars = {
    "--bg-inset":     "#F5F5F0",
    "--bg-panel":     "#FFFFFF",
    "--text-primary": "#1A1A1A",
    "--text-muted":   "#666666",
    "--border-color": "#333333",
    "--border-muted": "#CCCCCC",
    "--color-accent": "#1A1A1A",
    "--color-red":    "#8B0000",
    "--shadow-xs":    "none",
    "--shadow-sm":    "none",
  } as React.CSSProperties;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div
      className="min-h-screen bg-[#FAFAF8]"
      style={{ ...newsVars, fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
    >
      {/* Masthead */}
      <div className="border-b-4 border-[#1A1A1A] px-6 pt-8 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#888] border-b border-[#CCCCCC] pb-2 mb-4">
            <span>{today}</span>
            <span>{APP_NAME} Press</span>
            <span>Vol. I, No. 1</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none text-center">
            {form.title}
          </h1>
          {form.description && (
            <p className="mt-3 text-sm text-center italic text-[#555] leading-relaxed">
              &ldquo;{form.description}&rdquo;
            </p>
          )}
          <div className="mt-3 flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest text-[#888]">
            <span>━━━━━</span>
            <span>{fields.length} Correspondent{fields.length !== 1 ? "s" : ""} Required</span>
            <span>━━━━━</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={onSubmit} noValidate className="space-y-8">
          {form.collectEmail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-[#CCCCCC] pb-8"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#888] font-bold shrink-0">
                  §00
                </span>
                <label className="text-sm font-bold uppercase tracking-wider">
                  Email Address
                  <span className="ml-2 text-xs text-[#8B0000] font-normal italic">(Required)</span>
                </label>
              </div>
              <div className="pl-9">
                <input
                  id="respondent-email"
                  type="email"
                  placeholder="correspondence@example.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className={cn(
                    "w-full border-0 border-b-2 bg-transparent py-2 text-base italic text-[#1A1A1A] outline-none placeholder:text-[#AAAAAA]",
                    emailError ? "border-[#8B0000]" : "border-[#1A1A1A] focus:border-[#444]",
                  )}
                  style={{ fontFamily: "inherit" }}
                />
                {emailError && (
                  <p className="mt-1 text-xs italic text-[#8B0000]">{emailError}</p>
                )}
              </div>
            </motion.div>
          )}

          {fields.map((field, i) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.04 * i }}
              className="border-b border-[#CCCCCC] pb-8"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#888] font-bold shrink-0">
                  §{String(i + 1).padStart(2, "0")}
                </span>
                <label className="text-sm font-bold uppercase tracking-wider">
                  {field.label}
                  {field.required && (
                    <span className="ml-2 text-xs text-[#8B0000] font-normal italic">
                      (Required)
                    </span>
                  )}
                </label>
              </div>
              {field.helpText && (
                <p className="text-xs italic text-[#777] mb-3 pl-9">{field.helpText}</p>
              )}
              <div className="pl-9">
                {(field.type === "select" || field.type === "multi_select") && field.options?.length ? (
                  <div className="flex flex-col">
                    {field.options.map((opt) => {
                      const val = values[field.id];
                      const active = field.type === "multi_select"
                        ? (Array.isArray(val) ? val : []).includes(opt.value)
                        : val === opt.value;
                      function toggle() {
                        if (field.type === "multi_select") {
                          const cur = Array.isArray(val) ? val : [];
                          onFieldChange(field.id, active ? cur.filter((v) => v !== opt.value) : [...cur, opt.value]);
                        } else {
                          onFieldChange(field.id, active ? "" : opt.value);
                        }
                      }
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={toggle}
                          className={cn(
                            "flex items-center gap-3 w-full text-left text-sm py-2.5 border-b transition-colors",
                            active
                              ? "border-[#1A1A1A] text-[#1A1A1A] font-bold bg-[#F5F5F0]"
                              : "border-[#CCCCCC] text-[#555] hover:text-[#1A1A1A] hover:border-[#888]",
                          )}
                          style={{ fontFamily: "inherit" }}
                        >
                          <span className={cn(
                            "h-4 w-4 border-2 flex-shrink-0 flex items-center justify-center text-[9px] font-black",
                            active ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#AAAAAA]",
                          )}>
                            {active && "✓"}
                          </span>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <FieldRenderer
                    field={field}
                    value={values[field.id] ?? ""}
                    onChange={(v) => onFieldChange(field.id, v)}
                    error={errors[field.id]}
                  />
                )}
                {(field.type === "select" || field.type === "multi_select") && errors[field.id] && (
                  <p className="mt-1 text-xs italic text-[#8B0000]">{errors[field.id]}</p>
                )}
              </div>
            </motion.div>
          ))}

          {submitError && (
            <p className="border-l-4 border-[#8B0000] pl-4 text-sm italic text-[#8B0000]">
              {submitError}
            </p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + 0.04 * fields.length }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="border-2 border-[#1A1A1A] bg-[#1A1A1A] text-[#FAFAF8] px-8 py-3 text-xs uppercase tracking-[0.3em] font-bold hover:bg-[#333] transition-colors disabled:opacity-50"
              style={{ fontFamily: "inherit" }}
            >
              {isSubmitting ? "— Filing Report —" : "SUBMIT — GO TO PRESS ——›"}
            </button>
          </motion.div>
        </form>

        <div className="mt-16 border-t-2 border-[#1A1A1A] pt-4 text-center text-[10px] uppercase tracking-widest text-[#888]">
          Powered by{" "}
          <Link href="/" className="font-bold text-[#1A1A1A] hover:underline">
            {APP_NAME}
          </Link>{" "}
          — All responses confidential
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   THEME 8 — Scribble
   Hand-drawn borders, warm paper, doodle feel, cursive font
───────────────────────────────────────────────────────────── */
function ScribbleForm({
  form, values, errors, email, emailError,
  isSubmitting, submitError, onFieldChange, onEmailChange,
  onSubmit,
}: PublicFormProps) {
  const fields = (form.fields ?? []) as PublicField[];

  const scribbleVars = {
    "--bg-inset":     "#FFFEF5",
    "--bg-panel":     "#FFFEFA",
    "--text-primary": "#2D2416",
    "--text-muted":   "#6B5744",
    "--border-color": "#4A3728",
    "--border-muted": "#C4A882",
    "--color-accent": "#E84040",
    "--color-red":    "#E84040",
    "--shadow-xs":    "2px 3px 0px #4A3728",
    "--shadow-sm":    "3px 4px 0px #4A3728",
  } as React.CSSProperties;

  const PENCIL_EMOJIS = ["✏️", "📝", "🖊️", "✒️", "🖋️"];
  /* Slightly different irregular radius per card index */
  const cardRadius = (i: number) => {
    const a = 3 + (i % 4) * 2;
    const b = 8 + (i % 3) * 3;
    const c = 5 + (i % 2) * 3;
    return `${a}px ${b}px ${c}px ${a + 2}px / ${c}px ${a}px ${b - 2}px ${c + 1}px`;
  };
  const cardRotate = (i: number) => {
    const r = [-0.8, 0.5, -0.4, 0.7, -0.3][i % 5];
    return `rotate(${r}deg)`;
  };

  return (
    <div
      className="min-h-screen"
      style={{
        ...scribbleVars,
        fontFamily: '"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive',
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 27px, #E8DDD0 28px), #FFF9F0",
      }}
    >
      <div className="mx-auto max-w-xl px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div
            className="inline-block bg-[#FFE44D] px-5 py-1.5 mb-5"
            style={{
              borderRadius: "3px 9px 6px 8px / 7px 4px 9px 3px",
              boxShadow: "3px 3px 0px #4A3728",
              border: "2px solid #4A3728",
              transform: "rotate(-1.5deg)",
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A3728]">
              ✏️ please fill me out!
            </span>
          </div>
          <h1
            className="text-3xl font-bold text-[#2D2416] leading-tight"
            style={{
              textDecoration: "underline",
              textDecorationStyle: "wavy",
              textDecorationColor: "#E84040",
            }}
          >
            {form.title}
          </h1>
          {form.description && (
            <p className="mt-3 text-sm text-[#6B5744] italic leading-relaxed">
              {form.description}
            </p>
          )}
        </motion.div>

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {form.collectEmail && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-5"
              style={{
                borderRadius: "5px 12px 8px 10px / 10px 6px 12px 7px",
                boxShadow: "4px 4px 0px #4A3728",
                border: "2px solid #4A3728",
              }}
            >
              <label className="block text-sm font-bold text-[#2D2416] mb-2">
                📧 Email Address <span className="text-[#E84040]">*</span>
              </label>
              <input
                id="respondent-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="w-full border-0 border-b-2 border-dashed border-[#4A3728] bg-transparent py-1.5 text-sm text-[#2D2416] outline-none placeholder:text-[#C4A882] focus:border-[#E84040]"
                style={{ fontFamily: "inherit" }}
              />
              {emailError && (
                <p className="mt-1.5 text-xs text-[#E84040]">← {emailError}</p>
              )}
            </motion.div>
          )}

          {fields.map((field, i) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="bg-white p-5"
              style={{
                borderRadius: cardRadius(i),
                boxShadow: "4px 4px 0px #4A3728",
                border: "2px solid #4A3728",
                transform: cardRotate(i),
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{PENCIL_EMOJIS[i % PENCIL_EMOJIS.length]}</span>
                <label className="text-sm font-bold text-[#2D2416]">
                  {field.label}
                  {field.required && (
                    <span className="text-[#E84040] ml-1">*</span>
                  )}
                </label>
              </div>
              {field.helpText && (
                <p className="text-xs italic text-[#6B5744] mb-3 pl-7">
                  {field.helpText}
                </p>
              )}
              <div className="pl-7">
                {(field.type === "select" || field.type === "multi_select") && field.options?.length ? (
                  <div className="flex flex-col gap-2">
                    {field.options.map((opt) => {
                      const val = values[field.id];
                      const active = field.type === "multi_select"
                        ? (Array.isArray(val) ? val : []).includes(opt.value)
                        : val === opt.value;
                      function toggle() {
                        if (field.type === "multi_select") {
                          const cur = Array.isArray(val) ? val : [];
                          onFieldChange(field.id, active ? cur.filter((v) => v !== opt.value) : [...cur, opt.value]);
                        } else {
                          onFieldChange(field.id, active ? "" : opt.value);
                        }
                      }
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={toggle}
                          className="flex items-center gap-3 text-left text-sm transition-all"
                          style={{
                            fontFamily: "inherit",
                            background: active ? "#FFE44D" : "#FFF9F0",
                            border: `2px solid ${active ? "#E84040" : "#4A3728"}`,
                            borderRadius: "3px 8px 5px 6px / 6px 3px 8px 4px",
                            boxShadow: active ? "3px 3px 0px #E84040" : "2px 2px 0px #4A3728",
                            padding: "8px 14px",
                            color: "#2D2416",
                            fontWeight: active ? 700 : 500,
                          }}
                        >
                          <span style={{
                            display: "inline-flex",
                            width: 16,
                            height: 16,
                            border: `2px solid ${active ? "#E84040" : "#4A3728"}`,
                            borderRadius: "2px 5px 3px 4px",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            background: active ? "#E84040" : "transparent",
                          }}>
                            {active && <span style={{ color: "white", fontSize: 10, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                          </span>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <FieldRenderer
                    field={field}
                    value={values[field.id] ?? ""}
                    onChange={(v) => onFieldChange(field.id, v)}
                    error={undefined}
                  />
                )}
                {errors[field.id] && (
                  <p className="mt-1.5 text-xs text-[#E84040]">← {errors[field.id]}</p>
                )}
              </div>
            </motion.div>
          ))}

          {submitError && (
            <p className="text-sm italic text-[#E84040]">← Error: {submitError}</p>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + 0.05 * fields.length }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FFE44D] font-bold px-8 py-3 text-sm text-[#2D2416] hover:bg-[#FFD600] transition-colors disabled:opacity-60"
              style={{
                borderRadius: "5px 12px 8px 10px / 10px 6px 12px 7px",
                boxShadow: "4px 4px 0px #4A3728",
                border: "2px solid #4A3728",
                fontFamily: "inherit",
              }}
            >
              {isSubmitting ? "Sending… ✉️" : "Submit! 🚀"}
            </button>
          </motion.div>
        </form>

        <div className="mt-16 text-center text-xs italic text-[#C4A882]">
          Made with ♥ using{" "}
          <Link href="/" className="underline text-[#6B5744] hover:text-[#2D2416]">
            {APP_NAME}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main dispatch component
───────────────────────────────────────────────────────────── */
export function PublicForm(props: PublicFormProps) {
  switch (props.theme) {
    case "clean":      return <CleanCardForm  {...props} />;
    case "playful":    return <PlayfulForm    {...props} />;
    case "minimal":    return <MinimalForm    {...props} />;
    case "terminal":   return <TerminalForm   {...props} />;
    case "government": return <GovtForm       {...props} />;
    case "newspaper":  return <NewspaperForm  {...props} />;
    case "scribble":   return <ScribbleForm   {...props} />;
    case "brutalist":
    default:           return <BrutalistForm  {...props} />;
  }
}

/* ─────────────────────────────────────────────────────────────
   Static theme preview for the settings picker
───────────────────────────────────────────────────────────── */
export function ThemePreview({ theme }: { theme: FormTheme }) {
  switch (theme) {
    case "brutalist":   return <BrutalistPreview />;
    case "clean":       return <CleanPreview />;
    case "playful":     return <PlayfulPreview />;
    case "minimal":     return <MinimalPreview />;
    case "terminal":    return <TerminalPreview />;
    case "government":  return <GovtPreview />;
    case "newspaper":   return <NewspaperPreview />;
    case "scribble":    return <ScribblePreview />;
  }
}

function BrutalistPreview() {
  return (
    <div className="h-full w-full bg-[#F5F3EF] p-3 flex flex-col gap-2">
      {/* Header block */}
      <div className="border-2 border-[#0A0A0A] bg-white p-2 shadow-[2px_2px_0_#0A0A0A]">
        <div className="h-2 w-3/4 bg-[#0A0A0A] rounded-none" />
        <div className="mt-1.5 h-1.5 w-full bg-gray-200" />
      </div>
      {/* Field 1 */}
      <div className="border-2 border-[#0A0A0A] bg-white shadow-[2px_2px_0_#0A0A0A]">
        <div className="flex items-center gap-2 border-b-2 border-[#0A0A0A] px-2 py-1">
          <div className="h-1.5 w-4 bg-[#FF3B00]" />
        </div>
        <div className="p-2 space-y-1">
          <div className="h-1.5 w-1/2 bg-gray-700" />
          <div className="h-5 w-full border-2 border-[#0A0A0A]" />
        </div>
      </div>
      {/* Field 2 */}
      <div className="border-2 border-[#0A0A0A] bg-white shadow-[2px_2px_0_#0A0A0A]">
        <div className="flex items-center gap-2 border-b-2 border-[#0A0A0A] px-2 py-1">
          <div className="h-1.5 w-4 bg-[#FF3B00]" />
        </div>
        <div className="p-2 flex gap-1.5">
          {[1,2,3,4,5].map((n) => (
            <div key={n} className={`h-5 w-5 border-2 border-[#0A0A0A] ${n <= 3 ? "bg-[#FF3B00]" : "bg-white"}`} />
          ))}
        </div>
      </div>
      {/* Submit */}
      <div className="self-start border-2 border-[#0A0A0A] bg-[#FF3B00] px-3 py-1 shadow-[2px_2px_0_#0A0A0A]">
        <div className="h-2 w-12 bg-white" />
      </div>
    </div>
  );
}

function CleanPreview() {
  return (
    <div className="h-full w-full bg-slate-100 p-3 flex flex-col gap-2">
      {/* Header card */}
      <div className="rounded-xl bg-white shadow-sm border-t-4 border-blue-500 p-2.5">
        <div className="h-2 w-2/3 bg-gray-900 rounded" />
        <div className="mt-1.5 h-1.5 w-full bg-gray-200 rounded" />
      </div>
      {/* Field 1 */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-2.5 space-y-1.5">
        <div className="h-1.5 w-1/2 bg-gray-700 rounded" />
        <div className="h-6 w-full rounded-lg border border-gray-300" />
      </div>
      {/* Field 2 */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-2.5 space-y-1.5">
        <div className="h-1.5 w-2/3 bg-gray-700 rounded" />
        <div className="flex flex-col gap-1">
          {["A", "B"].map((o) => (
            <div key={o} className="h-5 w-full rounded-lg border border-gray-200 flex items-center px-2 gap-1">
              <div className="h-2.5 w-2.5 rounded-full border border-gray-300 shrink-0" />
              <div className="h-1.5 w-8 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* Submit */}
      <div className="self-start rounded-lg bg-blue-600 px-3 py-1.5">
        <div className="h-1.5 w-8 bg-white/80 rounded" />
      </div>
    </div>
  );
}

function PlayfulPreview() {
  return (
    <div
      className="h-full w-full p-3 flex flex-col gap-2"
      style={{ background: "linear-gradient(135deg, #667eea, #764ba2 60%, #f64f59)" }}
    >
      {/* Header */}
      <div className="text-center mb-1">
        <span className="text-lg">🎉</span>
        <div className="mx-auto mt-1 h-2 w-2/3 bg-white/80 rounded" />
        <div className="mx-auto mt-1.5 h-1.5 w-1/2 bg-white/50 rounded" />
      </div>
      {/* Card 1 */}
      <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/90 p-2.5">
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-xs">✏️</span>
          <div className="h-1.5 w-10 bg-gray-400/60 rounded" />
        </div>
        <div className="h-5 w-full rounded-xl border-2 border-violet-200 bg-white" />
      </div>
      {/* Card 2 */}
      <div className="rounded-2xl border-2 border-pink-200 bg-pink-50/90 p-2.5">
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-xs">⭐</span>
          <div className="h-1.5 w-14 bg-gray-400/60 rounded" />
        </div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((n) => (
            <div key={n} className={`h-5 w-5 border-2 border-[#0A0A0A] text-[8px] flex items-center justify-center ${n<=4?"bg-[var(--color-accent)] text-white":"bg-white"}`}>★</div>
          ))}
        </div>
      </div>
      {/* Submit */}
      <div className="rounded-2xl bg-white/95 px-3 py-1.5 text-center">
        <div className="mx-auto h-1.5 w-16 bg-purple-500 rounded" />
      </div>
    </div>
  );
}

function MinimalPreview() {
  return (
    <div className="h-full w-full bg-white p-4 flex flex-col gap-0">
      {/* Title */}
      <div className="mb-4">
        <div className="h-2 w-1/2 bg-gray-900 rounded-sm" />
        <div className="mt-2 h-1.5 w-3/4 bg-gray-200 rounded-sm" />
        <div className="mt-3 h-px w-full bg-gray-200" />
      </div>
      {/* Field 1 */}
      <div className="py-3">
        <div className="h-1.5 w-2/5 bg-gray-700 rounded-sm mb-2" />
        <div className="h-4 w-full border-b-2 border-gray-200" />
        <div className="mt-3 h-px w-full bg-gray-100" />
      </div>
      {/* Field 2 */}
      <div className="py-3">
        <div className="h-1.5 w-3/5 bg-gray-700 rounded-sm mb-2" />
        <div className="h-4 w-full border-b-2 border-gray-200" />
        <div className="mt-3 h-px w-full bg-gray-100" />
      </div>
      {/* Submit */}
      <div className="mt-2 self-start border border-gray-900 bg-gray-900 px-3 py-1.5 rounded-sm">
        <div className="h-1.5 w-8 bg-white/80 rounded-sm" />
      </div>
    </div>
  );
}

function TerminalPreview() {
  return (
    <div className="h-full w-full bg-[#0D1117] p-3 flex flex-col gap-2 font-mono">
      {/* Window bar */}
      <div className="flex items-center gap-1.5 bg-[#161B22] px-2 py-1 mb-1">
        <div className="h-2 w-2 rounded-full bg-[#FF5F57]" />
        <div className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
        <div className="h-2 w-2 rounded-full bg-[#28C840]" />
      </div>
      {/* Boot text */}
      <div className="space-y-1">
        <div className="h-1 w-2/3 bg-[#3D7A3D] rounded-none" />
        <div className="h-1.5 w-full bg-[#7EE787]/30 rounded-none" />
      </div>
      {/* Field 1 */}
      <div className="border border-[#30A030]/40 p-2 space-y-1">
        <div className="h-1 w-1/2 bg-[#7EE787]" />
        <div className="h-3 w-full border-b border-[#30A030]/50" />
      </div>
      {/* Field 2 */}
      <div className="border border-[#30A030]/40 p-2 space-y-1">
        <div className="h-1 w-2/3 bg-[#7EE787]" />
        <div className="h-5 w-full border-b border-[#30A030]/50" />
      </div>
      {/* Submit */}
      <div className="self-start border border-[#30A030]/60 bg-[#0D1117] px-3 py-1">
        <div className="h-1.5 w-20 bg-[#7EE787]/60" />
      </div>
    </div>
  );
}

function GovtPreview() {
  return (
    <div className="h-full w-full bg-white flex flex-col" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Tricolor */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-[#ccc]" />
        <div className="flex-1 bg-[#138808]" />
      </div>
      {/* Header */}
      <div className="bg-[#1B2A6B] px-2 py-2 flex items-center gap-2">
        <div className="h-6 w-6 rounded-full border-2 border-[#FF9933] flex items-center justify-center shrink-0">
          <div className="h-3 w-3 rounded-full border border-[#FF9933]" />
        </div>
        <div className="space-y-0.5">
          <div className="h-1 w-16 bg-blue-300" />
          <div className="h-1.5 w-20 bg-white" />
        </div>
      </div>
      <div className="h-0.5 bg-[#FF9933]" />
      {/* Table rows */}
      <div className="flex-1 p-2 space-y-0">
        {[1, 2, 3].map((r) => (
          <div key={r} className="flex border border-[#CCCCCC]">
            <div className="w-2/5 bg-[#F0F4FF] px-1.5 py-1 border-r border-[#CCCCCC]">
              <div className="h-1.5 w-full bg-[#888]" />
            </div>
            <div className="flex-1 bg-white px-1.5 py-1">
              <div className="h-3 w-full border border-[#AAAAAA]" />
            </div>
          </div>
        ))}
      </div>
      {/* Submit */}
      <div className="px-2 pb-2">
        <div className="self-start bg-[#1B2A6B] px-3 py-1 inline-block">
          <div className="h-1.5 w-12 bg-white/70" />
        </div>
      </div>
    </div>
  );
}

function NewspaperPreview() {
  return (
    <div className="h-full w-full bg-[#FAFAF8] p-3 flex flex-col gap-2" style={{ fontFamily: "Georgia, serif" }}>
      {/* Dateline */}
      <div className="flex justify-between border-b border-[#CCCCCC] pb-1">
        <div className="h-1 w-12 bg-[#999]" />
        <div className="h-1 w-10 bg-[#999]" />
      </div>
      {/* Headline */}
      <div className="border-b-4 border-[#1A1A1A] pb-2">
        <div className="h-3 w-full bg-[#1A1A1A]" />
        <div className="h-1.5 w-2/3 bg-[#444] mt-1" />
      </div>
      {/* Fields */}
      {[1, 2].map((r) => (
        <div key={r} className="border-b border-[#CCCCCC] pb-2 space-y-1">
          <div className="flex items-baseline gap-2">
            <div className="h-1 w-4 bg-[#999]" />
            <div className="h-1.5 w-24 bg-[#1A1A1A]" />
          </div>
          <div className="h-4 w-full border-b-2 border-[#1A1A1A] ml-6" />
        </div>
      ))}
      {/* Submit */}
      <div className="self-start border-2 border-[#1A1A1A] bg-[#1A1A1A] px-3 py-1">
        <div className="h-1.5 w-16 bg-[#FAFAF8]/80" />
      </div>
    </div>
  );
}

function ScribblePreview() {
  return (
    <div
      className="h-full w-full p-3 flex flex-col gap-2"
      style={{
        background: "repeating-linear-gradient(0deg,transparent,transparent 11px,#E8DDD0 12px),#FFF9F0",
        fontFamily: '"Segoe Print",cursive',
      }}
    >
      {/* Title sticky */}
      <div
        className="self-center bg-[#FFE44D] px-3 py-1 mb-1"
        style={{ border: "1.5px solid #4A3728", borderRadius: "2px 7px 5px 6px / 5px 3px 7px 2px", transform: "rotate(-1deg)" }}
      >
        <div className="h-1.5 w-14 bg-[#4A3728]/60" />
      </div>
      {/* Cards */}
      {[0, 1].map((i) => (
        <div
          key={i}
          className="bg-white p-2 space-y-1.5"
          style={{
            border: "1.5px solid #4A3728",
            borderRadius: `${4 + i * 3}px ${8 + i}px ${6 + i * 2}px ${5 + i}px`,
            boxShadow: "2px 2px 0px #4A3728",
            transform: `rotate(${i % 2 === 0 ? -0.6 : 0.5}deg)`,
          }}
        >
          <div className="flex items-center gap-1">
            <div className="text-[8px]">{i === 0 ? "✏️" : "📝"}</div>
            <div className="h-1.5 w-20 bg-[#2D2416]" />
          </div>
          <div className="h-3 w-full border-b-2 border-dashed border-[#4A3728]" />
        </div>
      ))}
      {/* Submit */}
      <div
        className="self-start bg-[#FFE44D] px-3 py-1"
        style={{ border: "1.5px solid #4A3728", borderRadius: "3px 8px 5px 7px", boxShadow: "2px 2px 0px #4A3728" }}
      >
        <div className="h-1.5 w-10 bg-[#4A3728]/70" />
      </div>
    </div>
  );
}
