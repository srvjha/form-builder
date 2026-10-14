import {
  FileText, Briefcase, CalendarDays,
  Bug, BarChart2, MessageSquare, Users, Mail,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
export type TemplateFieldType =
  | "short_text" | "long_text" | "email" | "number" | "phone"
  | "url" | "select" | "multi_select" | "checkbox" | "rating" | "scale";

export interface TemplateField {
  type:        TemplateFieldType;
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
export const TEMPLATES = [
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
    label:       "NPS survey",
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

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export type Template = (typeof TEMPLATES)[number];

/** The template with this id, or undefined if the id is unknown. */
export function getTemplate(id: string | null | undefined): Template | undefined {
  if (!id) return undefined;
  return TEMPLATES.find((t) => t.id === id);
}
