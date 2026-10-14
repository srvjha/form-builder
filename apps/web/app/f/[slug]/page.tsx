"use client";

import { useEffect, useRef, useState } from "react";
import { useParams }  from "next/navigation";
import { motion }     from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { trpc }           from "@/lib/trpc";
import { PublicForm, resolveFormTheme } from "@/components/form-renderer/public-form";
import { ClassicSuccessScreen } from "@/components/form-renderer/form-theme-success";
import type { PublicField } from "@/components/form-renderer/field-renderer";

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
const CLOSE_NOTE = "You can now close this window.";

function SuccessScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6">
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] px-6 py-10 text-center sm:px-10"
      >
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
          <CheckCircle2 className="h-6 w-6 text-[var(--color-accent)]" />
        </div>
        <h1 className="text-[32px] text-[var(--text-primary)]">
          Response submitted
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">{message}</p>
        <p className="mt-3 text-sm text-[var(--text-muted)]">{CLOSE_NOTE}</p>
      </motion.div>
    </div>
  );
}

/* ── Closed / error screen ──────────────────────────────────── */
function BlockedScreen({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] px-6 py-10 text-center sm:px-8">
        <h2 className="text-[30px] text-[var(--text-primary)]">{title}</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">{message}</p>
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

  const [values,     setValues]     = useState<Record<string, string | string[]>>({});
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [email,      setEmail]      = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const [successMsg, setSuccessMsg] = useState("Thank you for your response!");
  const startedRef   = useRef(false);
  const startTimeRef = useRef(Date.now());

  /* Track view on mount */
  useEffect(() => {
    if (!form) return;
    trackMutation.mutate({ formId: form.id, event: "view" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.id]);

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
      const raw = values[f.id] ?? (f.type === "multi_select" ? [] : "");
      let value: string | string[] | number | boolean = raw as string | string[];
      if (
        (f.type === "number" || f.type === "rating" || f.type === "scale") &&
        typeof raw === "string" && raw !== ""
      ) {
        value = Number(raw);
      } else if (f.type === "checkbox" && typeof raw === "string") {
        value = raw === "true";
      }
      return { fieldId: f.id, value };
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
      // error shown via submitMutation.error below
    }
  }

  /* ── Derived values ───────────────────────────────────────── */
  const fields  = (form?.fields ?? []) as PublicField[];
  const filled  = Object.values(values).filter((v) => (Array.isArray(v) ? v.length : v)).length;
  const progress = fields.length > 0 ? Math.round((filled / fields.length) * 100) : 0;

  /* ── States ─────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4" role="status">
        <p className="animate-pulse text-sm text-[var(--text-secondary)]">Loading form…</p>
      </div>
    );
  }

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("closed"))    return <BlockedScreen title="Form closed"    message="This form is no longer accepting responses." />;
    if (msg.includes("not found")) return <BlockedScreen title="Form not found" message="This form doesn't exist or has been removed. Check the link with the person who sent it." />;
    return                                <BlockedScreen title="Unavailable"    message={error.message} />;
  }

  if (!form) return null;

  const theme = resolveFormTheme((form?.settings as Record<string, unknown> | null | undefined)?.formTheme);
  if (submitted) {
    return theme === "formcraft"
      ? <SuccessScreen message={successMsg} />
      : <ClassicSuccessScreen message={successMsg} theme={theme} />;
  }

  return (
    <PublicForm
      theme={theme}
      form={form}
      values={values}
      errors={errors}
      email={email}
      emailError={emailError}
      isSubmitting={submitMutation.isPending}
      submitError={submitMutation.error?.message ?? null}
      onFieldChange={handleChange}
      onEmailChange={(v) => { setEmail(v); if (emailError) setEmailError(""); }}
      onSubmit={handleSubmit}
      progress={progress}
    />
  );
}
