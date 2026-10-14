"use client";

import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldRenderer } from "@/components/form-renderer/field-renderer";
import type { PublicField } from "@/components/form-renderer/field-renderer";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { ThemedForm, ClassicThemePreview, type ClassicTheme } from "@/components/form-renderer/form-themes";

/* "formcraft" is the default design; the others are the classic respondent themes */
export type FormTheme = "formcraft" | ClassicTheme;
export const DEFAULT_FORM_THEME: FormTheme = "formcraft";

export function resolveFormTheme(value: unknown): FormTheme {
  const all: FormTheme[] = ["formcraft", "brutalist", "clean", "playful", "minimal", "terminal", "government", "newspaper", "scribble"];
  return all.includes(value as FormTheme) ? (value as FormTheme) : DEFAULT_FORM_THEME;
}

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
  theme?: FormTheme;
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

export function PublicForm({ theme = DEFAULT_FORM_THEME, ...props }: PublicFormProps) {
  if (theme !== "formcraft") return <ThemedForm {...props} theme={theme} />;
  return <FormCraftForm {...props} />;
}

/* The default FormCraft design */
function FormCraftForm({
  form, values, errors, email, emailError,
  isSubmitting, submitError, onFieldChange, onEmailChange,
  onSubmit, progress,
}: Omit<PublicFormProps, "theme">) {
  const fields = (form.fields ?? []) as PublicField[];
  const showProgress = form.settings?.showProgressBar && fields.length > 0;

  return (
    <div className="min-h-screen">
      {showProgress && (
        <div className="fixed inset-x-0 top-0 z-50">
          <Progress value={progress} className="h-1 rounded-none" />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Header, on the dotted ground */}
        <header className="mb-8 text-center">
          <h1 className="text-[34px] text-[var(--text-primary)] sm:text-[44px]">
            {form.title}
          </h1>
          {form.description && (
            <p className="mx-auto mt-4 max-w-[60ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {form.description}
            </p>
          )}
        </header>

        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]"
        >
          <div className="divide-y divide-[var(--border-muted)]">
            {form.collectEmail && (
              <section className="px-4 py-5 sm:px-8 sm:py-6">
                <div className="space-y-2">
                  <Label htmlFor="respondent-email" required className="text-[15px] font-medium text-[var(--text-primary)]">Your email</Label>
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
                  {emailError && <p role="alert" className="text-[13px] text-[var(--color-red)]">{emailError}</p>}
                </div>
              </section>
            )}

            {fields.map((field) => (
              <section key={field.id} className="px-4 py-5 sm:px-8 sm:py-6">
                <FieldRenderer
                  field={field}
                  value={values[field.id] ?? (field.type === "multi_select" ? [] : "")}
                  onChange={(v) => onFieldChange(field.id, v)}
                  error={errors[field.id]}
                />
              </section>
            ))}
          </div>

          <div className="space-y-4 border-t border-[var(--border-color)] px-4 py-5 sm:px-8 sm:py-6">
            {submitError && (
              <div
                role="alert"
                className="rounded-md border border-[var(--color-red)]/40 bg-[var(--color-red)]/5 px-4 py-3 text-sm text-[var(--color-red)]"
              >
                {submitError}
              </div>
            )}
            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              Submit response
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-[13px] text-[var(--text-muted)]">
          Made with{" "}
          <Link href="/" className="rounded-sm font-medium text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--text-primary)] hover:underline">
            {APP_NAME}
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ── Theme thumbnails for the Design tab ───────────────────── */
export function ThemePreview({ theme }: { theme: FormTheme }) {
  if (theme !== "formcraft") return <ClassicThemePreview theme={theme} />;
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 bg-[#0A0A0A] bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[length:14px_14px] p-5">
      <p className="font-display text-[22px] leading-none text-[#F5F5F5]">Your form</p>
      <div className="space-y-2 rounded-lg bg-[#121212] p-3 ring-1 ring-[#262626]">
        <div className="h-2 w-20 rounded-full bg-[#3F3F46]" />
        <div className="h-6 rounded-md bg-[#1A1A1A] ring-1 ring-[#262626]" />
        <div className="h-2 w-16 rounded-full bg-[#3F3F46]" />
        <div className="h-6 rounded-md bg-[#1A1A1A] ring-1 ring-[#60A5FA]" />
        <div className="h-6 w-20 rounded-full bg-[#2563EB]" />
      </div>
    </div>
  );
}
