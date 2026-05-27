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

export type FormTheme = "brutalist" | "clean" | "playful" | "minimal";

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

  return (
    <div className="min-h-screen bg-slate-100">
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

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)" }}
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
              <FieldRenderer
                field={field}
                value={values[field.id] ?? (field.type === "multi_select" ? [] : "")}
                onChange={(v) => onFieldChange(field.id, v)}
                error={errors[field.id]}
              />
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

  return (
    <div className="min-h-screen bg-white">
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
                <FieldRenderer
                  field={field}
                  value={values[field.id] ?? (field.type === "multi_select" ? [] : "")}
                  onChange={(v) => onFieldChange(field.id, v)}
                  error={errors[field.id]}
                />
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
   Main dispatch component
───────────────────────────────────────────────────────────── */
export function PublicForm(props: PublicFormProps) {
  switch (props.theme) {
    case "clean":    return <CleanCardForm   {...props} />;
    case "playful":  return <PlayfulForm     {...props} />;
    case "minimal":  return <MinimalForm     {...props} />;
    case "brutalist":
    default:         return <BrutalistForm   {...props} />;
  }
}

/* ─────────────────────────────────────────────────────────────
   Static theme preview for the settings picker
───────────────────────────────────────────────────────────── */
export function ThemePreview({ theme }: { theme: FormTheme }) {
  switch (theme) {
    case "brutalist": return <BrutalistPreview />;
    case "clean":     return <CleanPreview />;
    case "playful":   return <PlayfulPreview />;
    case "minimal":   return <MinimalPreview />;
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
