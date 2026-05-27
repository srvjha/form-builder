"use client";

import { useEffect, useRef, useState } from "react";
import { useParams }  from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckSquare, Zap } from "lucide-react";
import { Button }         from "@/components/ui/button";
import { Progress }       from "@/components/ui/progress";
import { Input }          from "@/components/ui/input";
import { Label }          from "@/components/ui/label";
import { FieldRenderer }  from "@/components/form-renderer/field-renderer";
import { trpc }           from "@/lib/trpc";
import { APP_NAME }       from "@/lib/constants";
import Link               from "next/link";
import type { PublicField } from "@/components/form-renderer/field-renderer";

/* ── Validation ─────────────────────────────────────────────── */
function validateField(field: PublicField, value: string | string[]): string | null {
  const str = Array.isArray(value) ? value.join(",") : value;
  if (field.required && (!str || str === "false")) return "This field is required.";
  if (field.type === "email" && str && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str))
    return "Please enter a valid email address.";
  if (field.type === "url" && str && !/^https?:\/\/.+/.test(str))
    return "Please enter a valid URL (starting with http:// or https://).";
  if (field.validations?.minLength && str.length < field.validations.minLength)
    return `Minimum ${field.validations.minLength} characters required.`;
  if (field.validations?.maxLength && str.length > field.validations.maxLength)
    return `Maximum ${field.validations.maxLength} characters allowed.`;
  return null;
}

/* ── Success screen ─────────────────────────────────────────── */
function SuccessScreen({ message, formTitle }: { message: string; formTitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center bg-[var(--bg-page)] bg-dot-grid"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="border-4 border-[#0A0A0A] bg-[var(--bg-panel)] p-10 shadow-[8px_8px_0_#0A0A0A] max-w-md w-full"
      >
        <div className="flex h-14 w-14 items-center justify-center border-2 border-[#0A0A0A] bg-[var(--color-green)] mx-auto mb-6">
          <CheckSquare className="h-7 w-7 text-white" />
        </div>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight">Response submitted!</h1>
        <p className="mt-3 text-[var(--text-muted)]">{message}</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[var(--color-accent)] px-5 py-2.5 font-display text-xs font-extrabold uppercase tracking-wider text-white shadow-[3px_3px_0_#0A0A0A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#0A0A0A]"
        >
          <Zap className="h-3.5 w-3.5" /> Powered by {APP_NAME}
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ── Closed / error screen ──────────────────────────────────── */
function BlockedScreen({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-[var(--bg-page)] bg-dot-grid">
      <div className="border-4 border-[#0A0A0A] bg-[var(--bg-panel)] p-10 shadow-[6px_6px_0_#0A0A0A] max-w-sm w-full text-center">
        <div className="h-2 w-full bg-[var(--color-red)] mb-6" />
        <h2 className="font-display text-2xl font-black uppercase tracking-tight">{title}</h2>
        <p className="mt-3 text-sm text-[var(--text-muted)]">{message}</p>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function PublicFormPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: form, isLoading, error } = trpc.public.getForm.useQuery(
    { slug },
    { retry: false },
  );

  const trackMutation  = trpc.public.trackEvent.useMutation();
  const submitMutation = trpc.public.submit.useMutation();

  /* Values keyed by field id */
  const [values,        setValues]        = useState<Record<string, string | string[]>>({});
  const [errors,        setErrors]        = useState<Record<string, string>>({});
  const [email,         setEmail]         = useState("");
  const [emailError,    setEmailError]    = useState("");
  const [submitted,     setSubmitted]     = useState(false);
  const [successMsg,    setSuccessMsg]    = useState("Thank you for your response!");
  const startedRef  = useRef(false);
  const startTimeRef = useRef(Date.now());

  /* Track view on mount */
  useEffect(() => {
    if (!form) return;
    trackMutation.mutate({ formId: form.id, event: "view" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.id]);

  /* Track start on first interaction */
  function trackStart() {
    if (startedRef.current || !form) return;
    startedRef.current = true;
    startTimeRef.current = Date.now();
    trackMutation.mutate({ formId: form.id, event: "start" });
  }

  function handleChange(fieldId: string, value: string | string[]) {
    trackStart();
    setValues((v) => ({ ...v, [fieldId]: value }));
    if (errors[fieldId]) setErrors((e) => ({ ...e, [fieldId]: "" }));
  }

  function validate(): boolean {
    if (!form) return false;
    const newErrors: Record<string, string> = {};

    if (form.collectEmail) {
      if (!email) { setEmailError("Email is required."); }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Invalid email."); }
      else setEmailError("");
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    }

    for (const field of (form.fields ?? []) as PublicField[]) {
      const val = values[field.id] ?? (field.type === "multi_select" ? [] : "");
      const err = validateField(field, val);
      if (err) newErrors[field.id] = err;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !form) return;

    const answers = ((form.fields ?? []) as PublicField[]).map((f) => {
      const val = values[f.id] ?? (f.type === "multi_select" ? [] : "");
      // Preserve arrays for multi_select so the server stores proper JSON arrays,
      // not comma-joined strings (which would break per-option analytics).
      return {
        fieldId: f.id,
        value:   val as string | string[],
      };
    });

    try {
      const res = await submitMutation.mutateAsync({
        slug,
        respondentEmail:  form.collectEmail ? email : undefined,
        completionTimeMs: Date.now() - startTimeRef.current,
        answers,
      });
      setSuccessMsg(res.message);
      setSubmitted(true);
    } catch {
      // error shown via submitMutation.error
    }
  }

  /* ── States ─────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)]">
        <div className="font-display text-sm font-extrabold uppercase tracking-widest animate-pulse">
          Loading…
        </div>
      </div>
    );
  }

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("closed"))  return <BlockedScreen title="Form closed" message="This form is no longer accepting responses." />;
    if (msg.includes("not found")) return <BlockedScreen title="Not found" message="This form doesn't exist or has been removed." />;
    return <BlockedScreen title="Unavailable" message={error.message} />;
  }

  if (!form) return null;
  if (submitted) return <SuccessScreen message={successMsg} formTitle={form.title} />;

  const fields  = (form.fields ?? []) as PublicField[];
  const filled  = Object.values(values).filter((v) => (Array.isArray(v) ? v.length : v)).length;
  const progress = fields.length > 0 ? Math.round((filled / fields.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] bg-dot-grid">
      {/* Progress bar */}
      {form.settings?.showProgressBar && fields.length > 0 && (
        <div className="fixed top-0 inset-x-0 z-50">
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-6 py-16 pt-20">
        {/* Form header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-black uppercase leading-tight tracking-tight md:text-5xl">
            {form.title}
          </h1>
          {form.description && (
            <p className="mt-3 text-[var(--text-muted)] leading-relaxed">{form.description}</p>
          )}
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-8">
            {/* Email collection */}
            {form.collectEmail && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <div className="space-y-1.5">
                  <Label htmlFor="respondent-email">Your email</Label>
                  <Input
                    id="respondent-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                    error={!!emailError}
                    required
                  />
                  {emailError && <p className="font-mono text-xs text-[var(--color-red)]">{emailError}</p>}
                </div>
              </motion.div>
            )}

            {/* Fields */}
            <AnimatePresence>
              {fields.map((field, i) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                  className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] p-6 shadow-[3px_3px_0_#0A0A0A]"
                >
                  <FieldRenderer
                    field={field}
                    value={values[field.id] ?? (field.type === "multi_select" ? [] : "")}
                    onChange={(v) => handleChange(field.id, v)}
                    error={errors[field.id]}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Submit error */}
            {submitMutation.error && (
              <div className="border-l-4 border-[var(--color-red)] bg-[var(--bg-panel)] px-4 py-3 font-mono text-xs text-[var(--color-red)]">
                {submitMutation.error.message}
              </div>
            )}

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + fields.length * 0.04 }}
            >
              <Button
                type="submit"
                size="lg"
                loading={submitMutation.isPending}
                className="gap-2 shadow-brut-lg"
              >
                Submit Response
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </form>

        {/* Footer */}
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
