"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, ArrowRight, Briefcase, CalendarDays,
  Bug, BarChart2, MessageSquare, Users, Mail, Sparkles, Layers,
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
    icon:        Sparkles,
    label:       "Blank",
    description: "Start from scratch.",
    fields:      [] as TemplateField[],
    color:       "bg-[var(--bg-inset)]",
    accent:      "#6B6B6B",
  },
  {
    id:          "contact",
    icon:        Mail,
    label:       "Contact Form",
    description: "Name, email, subject, message.",
    color:       "bg-[#FFF1F2]",
    accent:      "#F43F5E",
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
    label:       "Feedback Form",
    description: "Rating + NPS + open questions.",
    color:       "bg-[#F0FDF4]",
    accent:      "#16A34A",
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
    label:       "Quick Survey",
    description: "3–5 questions with NPS.",
    color:       "bg-[#FAF5FF]",
    accent:      "#7C3AED",
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
    label:       "Job Application",
    description: "Professional HR intake form.",
    color:       "bg-[#F0F9FF]",
    accent:      "#0EA5E9",
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
    color:       "bg-[#FFFBEB]",
    accent:      "#D97706",
    fields:      [
      { type: "short_text",   label: "Full Name",              required: true,  placeholder: "Your name" },
      { type: "email",        label: "Email Address",           required: true,  placeholder: "you@example.com" },
      { type: "select",       label: "Will you attend?",        required: true,
        options: [
          { value: "yes",   label: "Yes, I'll be there 🎉" },
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
    label:       "Bug Report",
    description: "Developer-style defect tracker.",
    color:       "bg-[#FFF1F2]",
    accent:      "#DC2626",
    fields:      [
      { type: "short_text",   label: "Bug Title",              required: true,
        placeholder: "e.g. Login button unresponsive on Safari" },
      { type: "select",       label: "Severity",               required: true,
        options: [
          { value: "critical", label: "🔴 Critical — app unusable" },
          { value: "high",     label: "🟠 High — major feature broken" },
          { value: "medium",   label: "🟡 Medium — some features affected" },
          { value: "low",      label: "🟢 Low — cosmetic / minor" },
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
    description: "Net promoter score + followups.",
    color:       "bg-[#F0FDF4]",
    accent:      "#059669",
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
      toast.success("Form created!");
      router.push(ROUTES.formEdit(form.id));
    } catch (err: any) {
      setSeeding(false);
      toast.error(err?.message ?? "Failed to create form");
    }
  }

  const selectedTemplate = TEMPLATES.find((t) => t.id === template)!;

  return (
    <AppShell title="New Form">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* ── Template grid ─────────────────────────────────────── */}
          <section>
            <p className="label-overline mb-3">Start with a template</p>
            <div className="grid grid-cols-2 gap-0 border-2 border-[#0A0A0A] sm:grid-cols-4">
              {TEMPLATES.map((t, i) => {
                const Icon     = t.icon;
                const isActive = template === t.id;
                const isLast   = i === TEMPLATES.length - 1;
                const isRowEnd = (i + 1) % 4 === 0;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(t.id)}
                    className={cn(
                      "flex flex-col gap-2.5 p-4 text-left transition-all focus:outline-none",
                      "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-inset",
                      !isRowEnd && !isLast && "border-r-2 border-[#0A0A0A]",
                      i < 4 && "border-b-2 border-[#0A0A0A]",
                      isActive
                        ? "bg-[var(--color-accent)] text-white"
                        : "bg-[var(--bg-panel)] hover:bg-[var(--bg-inset)]",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center border-2 border-current",
                        isActive ? "border-white/60 bg-white/20" : "",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-display text-xs font-extrabold uppercase tracking-wide">
                        {t.label}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-[11px] leading-tight",
                          isActive ? "text-white/75" : "text-[var(--text-muted)]",
                        )}
                      >
                        {t.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Template field preview */}
            <AnimatePresence mode="wait">
              {selectedTemplate.fields.length > 0 && (
                <motion.div
                  key={template}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="mt-0 border-2 border-t-0 border-[#0A0A0A] bg-[var(--bg-inset)] px-5 py-3"
                >
                  <p className="label-overline mb-2 text-[var(--text-muted)]">
                    Will add {selectedTemplate.fields.length} fields:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedTemplate.fields as readonly TemplateField[]).map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 border border-[var(--border-muted)] bg-[var(--bg-panel)] px-2 py-0.5 font-mono text-[11px]"
                      >
                        <span className="text-[var(--color-accent)]">
                          {f.type.replace("_", " ")}
                        </span>
                        <span className="text-[var(--text-muted)]">·</span>
                        {f.label}
                        {f.required && (
                          <span className="ml-0.5 text-[var(--color-accent)]">*</span>
                        )}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ── Form details ───────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-5 border-2 border-[#0A0A0A] bg-[var(--bg-panel)] p-6 shadow-brut-md">
            <div className="flex items-center gap-3 border-b-2 border-[var(--border-muted)] pb-4">
              <div className="flex h-9 w-9 items-center justify-center border-2 border-[#0A0A0A] bg-[var(--color-accent)]">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <h2 className="font-display text-lg font-extrabold uppercase tracking-tight">
                Form details
              </h2>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="form-title">Form title</Label>
              <Input
                id="form-title"
                placeholder="e.g. Customer Feedback Q4"
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
                placeholder="Optional — shown to respondents at the top of the form."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* ── Field limit ──────────────────────────────────────── */}
            <div className="border-2 border-[var(--border-muted)] bg-[var(--bg-inset)] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[var(--color-accent)] shrink-0" />
                <p className="font-display text-xs font-extrabold uppercase tracking-wider">
                  Field limit
                </p>
                <span className="ml-auto font-mono text-[10px] border border-[var(--border-muted)] bg-[var(--bg-panel)] px-1.5 py-0.5 text-[var(--text-muted)]">
                  Default: {DEFAULT_MAX_FIELDS}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Maximum number of fields allowed in this form. The builder will lock once this limit is hit. Leave as-is to use the default.
              </p>
              <div className="flex items-center gap-3">
                <Input
                  id="max-fields"
                  type="number"
                  min={1}
                  max={100}
                  value={maxFields}
                  onChange={(e) => setMaxFields(e.target.value)}
                  className="w-28 font-mono"
                  leftSlot={<Layers className="h-4 w-4" />}
                />
                {maxFields !== String(DEFAULT_MAX_FIELDS) && (
                  <button
                    type="button"
                    onClick={() => setMaxFields(String(DEFAULT_MAX_FIELDS))}
                    className="font-mono text-[11px] text-[var(--text-muted)] underline underline-offset-2 hover:text-[var(--text-primary)] transition-colors"
                  >
                    Reset to default ({DEFAULT_MAX_FIELDS})
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                size="lg"
                loading={isPending}
                disabled={!title.trim() || isPending}
                className="gap-2 shadow-brut-md"
              >
                {seeding ? "Adding fields…" : "Create & Open Builder"}
                {!seeding && <ArrowRight className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AppShell>
  );
}
