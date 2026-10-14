"use client";

import Link from "next/link";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  BarChart3,
  Code2,
  GripVertical,
  Inbox,
  LayoutGrid,
  Link2,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

/* ─── Static data (only features that exist in the app) ───────── */
const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Visual form builder",
    description: "Drag fields onto a canvas, name your form, and preview it as respondents will see it.",
  },
  {
    icon: GripVertical,
    title: "14 field types",
    description: "Text, long text, email, phone, number, URL, date, time, select, multi-select, checkbox, rating, scale / NPS and file upload.",
  },
  {
    icon: Inbox,
    title: "Reorder any time",
    description: "Drag questions into the order you want. One linear flow, easy to change before or after publishing.",
  },
  {
    icon: Inbox,
    title: "Responses in one place",
    description: "Every submission is listed with readable option labels. Get an email for each new response, or export everything to CSV.",
  },
  {
    icon: BarChart3,
    title: "Per-form analytics",
    description: "See views, starts, submissions, completion and abandonment, plus a funnel that shows where people drop off.",
  },
  {
    icon: Link2,
    title: "Share and embed",
    description: "Publish to a public link, or copy an embed snippet to put the form on your own site.",
  },
];

const STEPS = [
  { step: "01", title: "Create",  description: "Add fields from the palette and arrange them by dragging." },
  { step: "02", title: "Publish", description: "Publish the form to get a public link, ready to share." },
  { step: "03", title: "Collect", description: "Watch responses arrive, review them, and export to CSV." },
];

const FACTS = ["14 field types", "Live analytics", "CSV export", "Email alerts", "Embed anywhere"];

/* ─── Product preview (plain divs, no imagery) ────────────────── */
const PREVIEW_BARS = [38, 62, 46, 80, 58, 90, 72];

function ProductPreview() {
  return (
    <div className="relative w-full max-w-md">
      {/* Form card */}
      <div className="relative z-10 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-5 shadow-soft-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Customer feedback</p>
            <p className="text-xs text-[var(--text-muted)]">3 questions</p>
          </div>
          <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-accent)]">
            Published
          </span>
        </div>

        <div className="space-y-3">
          <div className="rounded-md border border-[var(--border-color)] bg-[var(--bg-inset)] p-3">
            <p className="text-xs font-medium text-[var(--text-secondary)]">How likely are you to recommend us?</p>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-4 flex-1 rounded-sm ${i < 8 ? "bg-[var(--color-accent)]" : "bg-[var(--border-muted)]"}`}
                />
              ))}
            </div>
          </div>
          <div className="rounded-md border border-[var(--border-color)] bg-[var(--bg-inset)] p-3">
            <p className="text-xs font-medium text-[var(--text-secondary)]">Email</p>
            <div className="mt-2 h-7 rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)]" />
          </div>
          <div className="flex items-center justify-between rounded-md bg-[var(--color-accent)] px-3 py-2">
            <span className="text-xs font-semibold text-white">Submit</span>
            <ArrowRight className="h-3.5 w-3.5 text-white" />
          </div>
        </div>
      </div>

      {/* Response chart card */}
      <div className="absolute -bottom-6 -right-2 z-20 w-56 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-4 shadow-soft-md sm:-right-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[var(--text-primary)]">Responses</p>
          <p className="text-[11px] text-[var(--color-green)]">+24%</p>
        </div>
        <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--text-primary)]">128</p>
        <div className="mt-3 flex h-16 items-end gap-1.5">
          {PREVIEW_BARS.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm bg-[var(--color-accent)] opacity-80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { isSignedIn } = useAuth();

  const primaryCta = isSignedIn ? (
    <Link href={ROUTES.dashboard} className={primaryBtn}>
      Go to dashboard
      <ArrowRight className="h-4 w-4" />
    </Link>
  ) : (
    <SignUpButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
      <button type="button" className={primaryBtn}>
        Start building free
        <ArrowRight className="h-4 w-4" />
      </button>
    </SignUpButton>
  );

  return (
    <div className="bg-[var(--bg-page)]">
      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-dot-grid px-4 pb-24 pt-16 sm:px-6 md:pt-24">
        <div className="mx-auto grid max-w-content items-center gap-14 lg:grid-cols-2 lg:gap-12">
          <div className="text-center lg:text-left">
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Build forms people{" "}
              <span className="text-brand-gradient">want to finish.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg lg:mx-0">
              Drag fields onto a canvas, publish a link, and watch responses come in. Analytics and CSV export come built in.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              {primaryCta}
              <Link href={ROUTES.explore} className={secondaryBtn}>
                Explore public forms
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[var(--text-muted)] lg:justify-start">
              {FACTS.map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center pb-6 lg:justify-end">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* ═══ Features ═══════════════════════════════════════════ */}
      <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-content">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="label-overline mb-3">Features</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
              Everything you need to collect answers.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="interactive-lift rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-6 shadow-soft-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-accent-soft)]">
                  <Icon className="h-5 w-5 text-[var(--color-accent)]" />
                </div>
                <h3 className="mb-2 font-display text-base font-semibold text-[var(--text-primary)]">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How it works ════════════════════════════════════════ */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-[var(--border-color)] bg-[var(--bg-panel)] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-content">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="label-overline mb-3">How it works</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
              Three steps from idea to answers.
            </h2>
          </div>

          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map(({ step, title, description }) => (
              <li
                key={step}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] p-7 shadow-soft-xs"
              >
                <span className="font-display text-sm font-semibold text-[var(--color-accent)]">{step}</span>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ Final CTA ═══════════════════════════════════════════ */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-content rounded-xl border border-[var(--border-color)] bg-brand-gradient px-6 py-14 text-center shadow-soft-xl sm:px-12">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Ready to build your first form?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/85">
            Start free, create a form in minutes, and share it when you are ready.
          </p>
          <div className="mt-8 flex justify-center">
            {isSignedIn ? (
              <Link href={ROUTES.dashboard} className={ctaBtn}>
                Go to dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <SignUpButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
                <button type="button" className={ctaBtn}>
                  Create your first form
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Button styles (soft: accent fill, bordered secondary) ───── */
const primaryBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-6 text-sm font-semibold text-white shadow-soft-sm transition-all duration-150 hover:bg-[var(--color-accent-hover)] hover:shadow-soft-accent";

const secondaryBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] px-6 text-sm font-semibold text-[var(--text-primary)] shadow-soft-xs transition-all duration-150 hover:bg-[var(--bg-inset)]";

const ctaBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-semibold text-[var(--color-accent)] shadow-soft-md transition-all duration-150 hover:shadow-soft-lg";
