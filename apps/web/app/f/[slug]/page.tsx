"use client";

import { useEffect, useRef, useState } from "react";
import { useParams }  from "next/navigation";
import { motion }     from "framer-motion";
import { CheckSquare, Zap } from "lucide-react";
import { trpc }           from "@/lib/trpc";
import { APP_NAME }       from "@/lib/constants";
import Link               from "next/link";
import { PublicForm, type FormTheme } from "@/components/form-renderer/public-form";
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

/* ── Theme-aware success screen ─────────────────────────────── */
function SuccessScreen({
  message,
  theme,
}: {
  message: string;
  theme: FormTheme;
}) {
  /* ─ Brutalist ─ */
  if (theme === "brutalist") {
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

  /* ─ Clean ─ */
  if (theme === "clean") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen flex-col items-center justify-center px-6 bg-slate-100"
      >
        <div className="rounded-2xl bg-white shadow-md border-t-8 border-green-500 p-10 max-w-sm w-full text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckSquare className="h-7 w-7 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">All done!</h2>
          <p className="mt-3 text-gray-500 text-sm">{message}</p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Zap className="h-3.5 w-3.5" /> {APP_NAME}
          </Link>
        </div>
      </motion.div>
    );
  }

  /* ─ Playful ─ */
  if (theme === "playful") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={{ background: "linear-gradient(135deg, #667eea, #764ba2 60%, #f64f59)" }}
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="rounded-3xl bg-white/95 p-10 shadow-2xl max-w-sm w-full"
        >
          <div className="text-5xl mb-4">🎊</div>
          <h2 className="text-2xl font-extrabold text-purple-700">You&apos;re amazing!</h2>
          <p className="mt-3 text-gray-500 text-sm">{message}</p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-bold text-white hover:bg-purple-700"
          >
            🚀 {APP_NAME}
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  /* ─ Minimal ─ */
  if (theme === "minimal") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-screen flex-col items-center justify-center px-8 bg-white"
      >
        <div className="max-w-sm w-full">
          <CheckSquare className="h-8 w-8 text-gray-900 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Submitted</h2>
          <p className="mt-3 text-gray-500 text-sm leading-relaxed">{message}</p>
          <div className="mt-6 h-px bg-gray-200" />
          <Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
            <Zap className="h-3.5 w-3.5" /> {APP_NAME}
          </Link>
        </div>
      </motion.div>
    );
  }

  /* ─ Terminal ─ */
  if (theme === "terminal") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen items-center justify-center bg-[#0D1117] font-mono px-6"
      >
        <div className="border border-[#30A030]/50 bg-[#0D1117] p-10 max-w-md w-full">
          <p className="text-[#3D7A3D] text-xs mb-4">[PROCESS] exit code: 0 — SUCCESS</p>
          <p className="text-[#7EE787] text-xl font-bold">$ echo &quot;Response saved!&quot;</p>
          <p className="text-[#A0D0A0] mt-2 text-sm">{`> `}{message}</p>
          <div className="mt-6 border-t border-[#30A030]/30 pt-4">
            <Link href="/" className="text-xs text-[#3D7A3D] hover:text-[#7EE787] transition-colors">
              ~$ ./return_home.sh
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ─ Government ─ */
  if (theme === "government") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen flex-col items-center justify-center bg-white px-6"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <div className="max-w-md w-full">
          <div className="flex h-2 mb-8">
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white border-y border-[#CCCCCC]" />
            <div className="flex-1 bg-[#138808]" />
          </div>
          <div className="border border-[#CCCCCC] text-center p-8">
            <div className="text-5xl mb-4 text-[#138808]">✓</div>
            <h2 className="text-xl font-bold uppercase text-[#1B2A6B] tracking-wider">
              Form Submitted Successfully
            </h2>
            <p className="text-sm text-[#555] mt-3 leading-relaxed">{message}</p>
            <div className="mt-3 text-xs text-[#888]">
              Ref. No: FC/{new Date().getFullYear()}/{Math.random().toString(36).slice(2, 8).toUpperCase()}
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-[#888]">
            Powered by{" "}
            <Link href="/" className="text-[#FF6600] hover:underline">{APP_NAME}</Link>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ─ Newspaper ─ */
  if (theme === "newspaper") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF8] px-6 text-center"
        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
      >
        <div className="max-w-md w-full">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#888] mb-4">
            — {APP_NAME} Press —
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tight border-b-4 border-[#1A1A1A] pb-4 mb-4">
            SUBMITTED!
          </h2>
          <p className="italic text-[#555] text-sm leading-relaxed">&ldquo;{message}&rdquo;</p>
          <div className="mt-8 text-[10px] uppercase tracking-widest text-[#888]">
            ━━━{" "}
            <Link href="/" className="font-bold text-[#1A1A1A] hover:underline">{APP_NAME}</Link>
            {" "}━━━
          </div>
        </div>
      </motion.div>
    );
  }

  /* ─ Scribble ─ */
  if (theme === "scribble") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={{
          background: "repeating-linear-gradient(0deg,transparent,transparent 27px,#E8DDD0 28px),#FFF9F0",
          fontFamily: '"Segoe Print","Bradley Hand","Comic Sans MS",cursive',
        }}
      >
        <div
          className="text-center bg-white p-10 max-w-sm w-full"
          style={{
            border: "2px solid #4A3728",
            borderRadius: "5px 15px 10px 12px / 12px 8px 15px 6px",
            boxShadow: "6px 6px 0px #4A3728",
            transform: "rotate(-1deg)",
          }}
        >
          <div className="text-5xl mb-4">🎉</div>
          <h2
            className="text-2xl font-bold text-[#2D2416]"
            style={{ textDecoration: "underline", textDecorationStyle: "wavy", textDecorationColor: "#E84040" }}
          >
            Done!
          </h2>
          <p className="mt-3 text-sm text-[#6B5744] italic leading-relaxed">{message}</p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-bold text-[#E84040] underline hover:text-[#2D2416]"
          >
            {APP_NAME} →
          </Link>
        </div>
      </motion.div>
    );
  }

  /* ─ Fallback (should never reach here) ─ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-center px-8 bg-white"
    >
      <p className="text-gray-500">{message}</p>
      <Link href="/" className="mt-4 text-sm text-gray-500 hover:text-gray-900">{APP_NAME}</Link>
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
      const val = values[f.id] ?? (f.type === "multi_select" ? [] : "");
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
      // error shown via submitMutation.error below
    }
  }

  /* ── Derived values ───────────────────────────────────────── */
  const theme: FormTheme = ((form?.settings as any)?.formTheme as FormTheme) ?? "brutalist";
  const fields  = (form?.fields ?? []) as PublicField[];
  const filled  = Object.values(values).filter((v) => (Array.isArray(v) ? v.length : v)).length;
  const progress = fields.length > 0 ? Math.round((filled / fields.length) * 100) : 0;

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
    if (msg.includes("closed"))    return <BlockedScreen title="Form closed"    message="This form is no longer accepting responses." />;
    if (msg.includes("not found")) return <BlockedScreen title="Not found"      message="This form doesn't exist or has been removed." />;
    return                                <BlockedScreen title="Unavailable"    message={error.message} />;
  }

  if (!form) return null;

  if (submitted) return <SuccessScreen message={successMsg} theme={theme} />;

  return (
    <PublicForm
      form={form}
      theme={theme}
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
