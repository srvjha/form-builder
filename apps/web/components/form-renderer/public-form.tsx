"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldRenderer } from "@/components/form-renderer/field-renderer";
import type { PublicField } from "@/components/form-renderer/field-renderer";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

/* ── Types ──────────────────────────────────────────────────── */

export interface PublicFormData {
  id: string;
  title: string;
  description?: string | null;
  collectEmail: boolean;
  settings?: {
    showProgressBar?: boolean;
    [key: string]: unknown;
  } | null;
  fields?: unknown[];
}

export interface PublicFormProps {
  form: PublicFormData;
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

/* ── Form ───────────────────────────────────────────────────── */

export function PublicForm({
  form, values, errors, email, emailError,
  isSubmitting, submitError, onFieldChange, onEmailChange,
  onSubmit, progress,
}: PublicFormProps) {
  const fields = (form.fields ?? []) as PublicField[];
  const showProgress = form.settings?.showProgressBar && fields.length > 0;

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {showProgress && (
        <div className="fixed top-0 inset-x-0 z-50">
          <Progress value={progress} className="h-1 rounded-none" />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="label-overline mb-2 text-[var(--text-muted)]">
            {fields.length} question{fields.length !== 1 ? "s" : ""}
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl">
            {form.title}
          </h1>
          {form.description && (
            <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">{form.description}</p>
          )}
        </motion.header>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {form.collectEmail && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-5 shadow-soft-sm sm:p-6"
            >
              <div className="space-y-2">
                <Label htmlFor="respondent-email" required className="text-sm">Your email</Label>
                <Input
                  id="respondent-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  error={!!emailError}
                  className="w-full"
                  required
                />
                {emailError && <p className="text-xs text-[var(--color-red)]">{emailError}</p>}
              </div>
            </motion.section>
          )}

          <AnimatePresence>
            {fields.map((field, i) => (
              <motion.section
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.03, duration: 0.25 }}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-5 shadow-soft-sm sm:p-6"
              >
                <FieldRenderer
                  field={field}
                  value={values[field.id] ?? (field.type === "multi_select" ? [] : "")}
                  onChange={(v) => onFieldChange(field.id, v)}
                  error={errors[field.id]}
                />
              </motion.section>
            ))}
          </AnimatePresence>

          {submitError && (
            <div
              role="alert"
              className="rounded-md border border-[var(--color-red)] bg-[var(--bg-panel)] px-4 py-3 text-sm text-[var(--color-red)]"
            >
              {submitError}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + fields.length * 0.03 }}
            className="pt-2"
          >
            <Button type="submit" size="lg" loading={isSubmitting} className="w-full gap-2 sm:w-auto">
              Submit response <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </form>

        <div className="mt-14 flex items-center gap-2 border-t border-[var(--border-muted)] pt-6">
          <Zap className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span className="text-xs text-[var(--text-muted)]">
            Powered by{" "}
            <Link href="/" className="font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              {APP_NAME}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
