"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Briefcase, CalendarDays,
  Bug, BarChart2, MessageSquare, Users, Mail, Layers,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell }  from "@/components/layout/app-shell";
import { Button }    from "@/components/ui/button";
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import { Textarea }  from "@/components/ui/textarea";
import { trpc }      from "@/lib/trpc";
import { ROUTES }    from "@/lib/constants";
import { cn }        from "@/lib/utils";
import { DEFAULT_MAX_FIELDS } from "@/stores/builder-store";

// ── Types ──────────────────────────────────────────────────────────────────────
type FieldType =
  | "short_text" | "long_text" | "email" | "number" | "phone"
  | "url" | "select" | "multi_select" | "checkbox" | "rating" | "scale";

interface TemplateField {
  type:        FieldType;
  label:       string;
  placeholder?: string;
  helpText?:   string;
  required?:   boolean;
  options?:    { value: string; label: string }[];
  minValue?:   number;
  maxValue?:   number;
  minLabel?:   string;
  maxLabel?:   string;
}

// ── Template definitions ───────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id:          "blank",
    icon:        FileText,
    label:       "Blank",
    description: "An empty form. Add fields yourself.",
    fields:      [] as TemplateField[],
  },
  {
    id:          "contact",
    icon:        Mail,
    label:       "Contact form",
    description: "Name, email, subject, message.",
    fields:      [
      { type: "short_text", label: "Full Name",    required: true,  placeholder: "Your full name" },
      { type: "email",      label: "Email Address", required: true,  placeholder: "you@example.com" },
      { type: "short_text", label: "Subject",       required: false, placeholder: "What is this about?" },
      { type: "long_text",  label: "Message",       required: true,  placeholder: "Write your message here…",
        helpText: "We'll get back to you within 1–2 business days." },
    ] as TemplateField[],
  },
  {
    id:          "feedback",
    icon:        MessageSquare,
    label:       "Feedback form",
    description: "A rating, an NPS score and two open questions.",
    fields:      [
      { type: "rating",    label: "Overall experience",          required: true,  maxValue: 5 },
      { type: "scale",     label: "How likely are you to recommend us?", required: true,
        minValue: 0, maxValue: 10, minLabel: "Not at all likely", maxLabel: "Extremely likely" },
      { type: "long_text", label: "What did you enjoy most?",    required: false,
        placeholder: "Tell us what stood out…" },
      { type: "long_text", label: "What could we improve?",      required: false,
        placeholder: "Any suggestions are welcome." },
    ] as TemplateField[],
  },
  {
    id:          "survey",
    icon:        BarChart2,
    label:       "Quick survey",
    description: "Five short questions with a rating scale.",
    fields:      [
      { type: "short_text",   label: "Your Name",          required: false, placeholder: "Optional" },
      { type: "select",       label: "Age Range",           required: false,
        options: [
          { value: "under_18",  label: "Under 18" },
          { value: "18_24",     label: "18–24" },
          { value: "25_34",     label: "25–34" },
          { value: "35_44",     label: "35–44" },
          { value: "45_plus",   label: "45+" },
        ],
      },
      { type: "multi_select", label: "Topics of interest", required: false,
        options: [
          { value: "design",    label: "Design" },
          { value: "dev",       label: "Development" },
          { value: "marketing", label: "Marketing" },
          { value: "product",   label: "Product" },
          { value: "other",     label: "Other" },
        ],
      },
      { type: "scale",        label: "How would you rate your experience?", required: true,
        minValue: 1, maxValue: 10, minLabel: "Poor", maxLabel: "Excellent" },
      { type: "long_text",    label: "Any other comments?", required: false },
    ] as TemplateField[],
  },
  {
    id:          "job_application",
    icon:        Briefcase,
    label:       "Job application",
    description: "Contact details, experience and a cover letter.",
    fields:      [
      { type: "short_text", label: "Full Name",             required: true,  placeholder: "Jane Smith" },
      { type: "email",      label: "Email Address",          required: true,  placeholder: "jane@example.com" },
      { type: "phone",      label: "Phone Number",           required: false, placeholder: "+1 555 000 0000" },
      { type: "url",        label: "LinkedIn Profile",       required: false, placeholder: "https://linkedin.com/in/…" },
      { type: "url",        label: "Portfolio / Website",    required: false, placeholder: "https://yoursite.com" },
      { type: "select",     label: "Years of Experience",    required: true,
        options: [
          { value: "0_1",   label: "0–1 years (Entry level)" },
          { value: "2_4",   label: "2–4 years" },
          { value: "5_9",   label: "5–9 years" },
          { value: "10_15", label: "10–15 years" },
          { value: "15_p",  label: "15+ years (Senior)" },
        ],
      },
      { type: "select",     label: "How did you hear about us?", required: false,
        options: [
          { value: "linkedin",  label: "LinkedIn" },
          { value: "referral",  label: "Referral" },
          { value: "job_board", label: "Job board" },
          { value: "website",   label: "Company website" },
          { value: "other",     label: "Other" },
        ],
      },
      { type: "long_text",  label: "Cover Letter",           required: true,
        placeholder: "Tell us why you're a great fit for this role…",
        helpText: "Max 600 words recommended." },
    ] as TemplateField[],
  },
  {
    id:          "event_rsvp",
    icon:        CalendarDays,
    label:       "Event RSVP",
    description: "Attendance, guests, dietary needs.",
    fields:      [
      { type: "short_text",   label: "Full Name",              required: true,  placeholder: "Your name" },
      { type: "email",        label: "Email Address",           required: true,  placeholder: "you@example.com" },
      { type: "select",       label: "Will you attend?",        required: true,
        options: [
          { value: "yes",   label: "Yes, I'll be there" },
          { value: "no",    label: "Sorry, can't make it" },
          { value: "maybe", label: "Maybe — I'll confirm later" },
        ],
      },
      { type: "number",       label: "Number of additional guests", required: false,
        helpText: "Enter 0 if you're attending alone.", placeholder: "0" },
      { type: "select",       label: "Dietary Requirements",    required: false,
        options: [
          { value: "none",        label: "None" },
          { value: "vegetarian",  label: "Vegetarian" },
          { value: "vegan",       label: "Vegan" },
          { value: "gluten_free", label: "Gluten-free" },
          { value: "halal",       label: "Halal" },
          { value: "other",       label: "Other (please specify below)" },
        ],
      },
      { type: "long_text",    label: "Special requirements or notes", required: false,
        placeholder: "Accessibility needs, allergies not listed above, etc." },
    ] as TemplateField[],
  },
  {
    id:          "bug_report",
    icon:        Bug,
    label:       "Bug report",
    description: "Severity, steps to reproduce and environment.",
    fields:      [
      { type: "short_text",   label: "Bug Title",              required: true,
        placeholder: "e.g. Login button unresponsive on Safari" },
      { type: "select",       label: "Severity",               required: true,
        options: [
          { value: "critical", label: "Critical: app unusable" },
          { value: "high",     label: "High: major feature broken" },
          { value: "medium",   label: "Medium: some features affected" },
          { value: "low",      label: "Low: cosmetic or minor" },
        ],
      },
      { type: "long_text",    label: "Description",             required: true,
        placeholder: "What happened? What were you doing when it occurred?" },
      { type: "long_text",    label: "Steps to Reproduce",      required: false,
        placeholder: "1. Go to …\n2. Click …\n3. See error" },
      { type: "short_text",   label: "Expected Behavior",       required: false,
        placeholder: "What should have happened?" },
      { type: "short_text",   label: "Actual Behavior",         required: false,
        placeholder: "What actually happened?" },
      { type: "short_text",   label: "Browser / OS / Version",  required: false,
        placeholder: "e.g. Chrome 124 / macOS 14" },
      { type: "email",        label: "Your Email (optional)",   required: false,
        placeholder: "dev@company.com", helpText: "We'll follow up if we need more info." },
    ] as TemplateField[],
  },
  {
    id:          "nps_survey",
    icon:        Users,
    label:       "NPS Survey",
    description: "Net promoter score with follow-up questions.",
    fields:      [
      { type: "scale",        label: "How likely are you to recommend us to a friend or colleague?",
        required: true, minValue: 0, maxValue: 10,
        minLabel: "0 — Not at all likely", maxLabel: "10 — Extremely likely" },
      { type: "select",       label: "What's the primary reason for your score?", required: false,
        options: [
          { value: "product",  label: "Quality of the product/service" },
          { value: "support",  label: "Customer support" },
          { value: "price",    label: "Price & value" },
          { value: "ease",     label: "Ease of use" },
          { value: "other",    label: "Other" },
        ],
      },
      { type: "long_text",    label: "How can we improve?",     required: false,
        placeholder: "Any feedback helps us get better." },
      { type: "short_text",   label: "Name (optional)",         required: false },
      { type: "email",        label: "Email (optional)",        required: false,
        placeholder: "We'll only contact you if you'd like follow-up." },
    ] as TemplateField[],
  },
] as const;

type TemplateId = (typeof TEMPLATES)[number]["id"];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function NewFormPage() {
  const router = useRouter();
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [template,    setTemplate]    = useState<TemplateId>("blank");
  const [maxFields,   setMaxFields]   = useState<string>(String(DEFAULT_MAX_FIELDS));
  const [seeding,     setSeeding]     = useState(false);

  const utils          = trpc.useUtils();
  const createMutation = trpc.forms.create.useMutation();
  const addFieldMutation = trpc.forms.addField.useMutation();

  const isPending = createMutation.isPending || seeding;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const parsedMax = Math.max(1, Math.min(100, parseInt(maxFields, 10) || DEFAULT_MAX_FIELDS));
      const form = await createMutation.mutateAsync({
        title:       title.trim(),
        description: description.trim() || undefined,
        settings: {
          showProgressBar:  true,
          shuffleFields:    false,
          oneResponsePerIp: false,
          requireAuth:      false,
          maxFields:        parsedMax,
        },
      });

      const selectedTemplate = TEMPLATES.find((t) => t.id === template);
      const templateFields   = (selectedTemplate?.fields ?? []) as TemplateField[];

      if (templateFields.length > 0) {
        setSeeding(true);
        // Seed fields in parallel for speed
        await Promise.all(
          templateFields.map((f) =>
            addFieldMutation.mutateAsync({
              formId:      form.id,
              type:        f.type,
              label:       f.label,
              placeholder: f.placeholder,
              helpText:    f.helpText,
              required:    f.required ?? false,
              options:     f.options,
              minValue:    f.minValue,
              maxValue:    f.maxValue,
              minLabel:    f.minLabel,
              maxLabel:    f.maxLabel,
              validations: {},
            }),
          ),
        );
        setSeeding(false);
      }

      utils.forms.list.invalidate();
      toast.success("Form created");
      router.push(ROUTES.formEdit(form.id));
    } catch (err: any) {
      setSeeding(false);
      toast.error(err?.message ?? "Failed to create form");
    }
  }

  const selectedTemplate = TEMPLATES.find((t) => t.id === template)!;
  const previewFields    = selectedTemplate.fields as readonly TemplateField[];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl pb-10">
        <h1 className="font-display text-4xl text-[var(--text-primary)] sm:text-5xl">New form</h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          Name it, pick a starting point, and you will land in the builder.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* ── Name ─────────────────────────────────────────────── */}
          <section className="space-y-2">
            <h2 className="px-1 font-sans text-[13px] font-semibold leading-tight tracking-normal text-[var(--text-primary)]">
              Details
            </h2>
            <div className="space-y-4 rounded-xl border-1 border-[var(--border-color)] bg-[var(--bg-panel)] p-4 sm:p-5">
              <div className="space-y-1.5">
                <Label htmlFor="form-title">Title</Label>
                <Input
                  id="form-title"
                  placeholder="e.g. Customer feedback, Q4"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="form-desc">Description</Label>
                <Textarea
                  id="form-desc"
                  placeholder="Optional. Shown to respondents at the top of the form."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* ── Template list ─────────────────────────────────────── */}
          <section className="space-y-2">
            <h2 className="px-1 font-sans text-[13px] font-semibold leading-tight tracking-normal text-[var(--text-primary)]">
              Start from
            </h2>
            <div
              className="grid gap-px overflow-hidden rounded-xl border-1 border-[var(--border-color)] bg-[var(--border-muted)] sm:grid-cols-2"
              role="radiogroup"
              aria-label="Template"
            >
              {TEMPLATES.map((t) => {
                const Icon     = t.icon;
                const isActive = template === t.id;
                const count    = t.fields.length;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setTemplate(t.id)}
                    className={cn(
                      "relative flex items-start gap-3 px-4 py-3.5 text-left transition-colors focus-visible:z-10",
                      isActive
                        ? "bg-[var(--color-accent-soft)]"
                        : "bg-[var(--bg-panel)] hover:bg-[var(--bg-inset)]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        isActive ? "text-[var(--color-accent)]" : "text-[var(--text-muted)]",
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isActive ? "text-[var(--color-accent)]" : "text-[var(--text-primary)]",
                          )}
                        >
                          {t.label}
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-[var(--text-muted)]">
                          {count === 0 ? "No fields" : `${count} fields`}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-[var(--text-secondary)]">
                        {t.description}
                      </span>
                    </span>
                    {isActive && (
                      <span className="absolute inset-y-0 left-0 w-[3px] bg-[var(--color-accent)]" aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Template field preview */}
            <AnimatePresence mode="wait">
              {previewFields.length > 0 && (
                <motion.div
                  key={template}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-xl border-1 border-[var(--border-color)] bg-[var(--bg-panel)] px-4 py-3 sm:px-5"
                >
                  <p className="text-xs font-medium text-[var(--text-secondary)]">
                    Adds these {previewFields.length} fields
                  </p>
                  <ol className="mt-2 grid gap-x-6 gap-y-1 text-sm text-[var(--text-primary)] sm:grid-cols-2">
                    {previewFields.map((f, i) => (
                      <li key={i} className="flex min-w-0 items-baseline gap-2">
                        <span className="w-4 shrink-0 text-right text-xs tabular-nums text-[var(--text-muted)]">{i + 1}</span>
                        <span className="truncate">{f.label}</span>
                        {f.required && <span className="shrink-0 text-xs text-[var(--color-accent)]">Required</span>}
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ── Field limit ──────────────────────────────────────── */}
          <section className="space-y-2">
            <h2 className="px-1 font-sans text-[13px] font-semibold leading-tight tracking-normal text-[var(--text-primary)]">
              Limits
            </h2>
            <div className="flex flex-col gap-3 rounded-xl border-1 border-[var(--border-color)] bg-[var(--bg-panel)] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-5">
              <div className="min-w-0">
                <Label htmlFor="max-fields" className="text-sm font-medium">Field limit</Label>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-muted)]">
                  The most fields this form can hold. The builder stops adding fields once it is reached. Default is {DEFAULT_MAX_FIELDS}.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Input
                  id="max-fields"
                  type="number"
                  min={1}
                  max={100}
                  value={maxFields}
                  onChange={(e) => setMaxFields(e.target.value)}
                  className="w-24 tabular-nums"
                  leftSlot={<Layers className="h-4 w-4" />}
                />
                {maxFields !== String(DEFAULT_MAX_FIELDS) && (
                  <button
                    type="button"
                    onClick={() => setMaxFields(String(DEFAULT_MAX_FIELDS))}
                    className="text-xs text-[var(--text-secondary)] underline underline-offset-2 transition-colors hover:text-[var(--text-primary)]"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={isPending}
              className="h-10 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={!title.trim() || isPending}
              className="h-10 px-5 text-sm font-medium !bg-[var(--color-action)] !text-white shadow-none hover:!bg-[var(--color-action-hover)] hover:shadow-none hover:brightness-100"
            >
              {seeding ? "Adding fields…" : "Create form"}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
