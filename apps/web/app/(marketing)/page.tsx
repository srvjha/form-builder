"use client";

import Link from "next/link";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Check, ChevronDown, Copy, GripVertical, Mail, Star, Type } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { ROUTES } from "@/lib/constants";

/* Same rule the server uses (packages/services/utils/slug.ts) */
function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

const SITE_HOST = "formcraft.srvjha.in";

/* ─── Motion ──────────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* Buttons: one shape on the whole page — fully round */
const primaryBtn =
  "inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--color-action)] px-7 text-[16px] font-medium text-white transition-[transform,background-color] duration-150 hover:bg-[var(--color-action-hover)] active:scale-[0.97]";
const secondaryBtn =
  "inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--bg-inset)] px-7 text-[16px] font-medium text-[var(--text-primary)] transition-[transform,background-color] duration-150 hover:bg-[var(--border-color)] active:scale-[0.97]";

/* ─── Hero: a real field set inside the headline ─────────────── */
const SLOT_FIELDS = ["email", "rating", "select", "text"] as const;

function FieldInSentence() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % SLOT_FIELDS.length), 2400);
    return () => clearInterval(id);
  }, [reduce]);
  const kind = SLOT_FIELDS[i]!;

  return (
    <motion.span
      data-ui
      aria-hidden
      /* Shutter: opens upward from the baseline while the field settles */
      initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }}
      animate={{ clipPath: "inset(0% 0 0 0)" }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
      className="relative mx-[0.14em] inline-flex h-[0.86em] w-[2.6em] translate-y-[0.06em] items-center overflow-hidden rounded-[0.16em] bg-[var(--bg-panel)] align-baseline ring-1 ring-[var(--border-color)] max-sm:mx-auto max-sm:my-[0.12em] max-sm:flex max-sm:h-[1.1em] max-sm:w-full"
    >
      <motion.span
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: EASE, delay: 0.35 }}
        className="flex h-full w-full items-center px-[0.16em]"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={kind}
            initial={{ y: "60%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-60%", opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex w-full items-center gap-[0.5em] font-sans text-[0.2em] leading-none tracking-normal max-sm:text-[0.36em] text-[var(--text-primary)]"
          >
            {kind === "email" && (
              <>
                <Mail className="h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-accent)]" />
                <span className="truncate">you@company.com</span>
                <span className="ml-auto h-[1.2em] w-[0.08em] bg-[var(--color-accent)]" />
              </>
            )}
            {kind === "rating" && (
              <span className="flex w-full justify-between">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star
                    key={s}
                    className={`h-[1.5em] w-[1.5em] ${s < 4 ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-[var(--border-color)]"}`}
                  />
                ))}
              </span>
            )}
            {kind === "select" && (
              <>
                <span className="rounded-full bg-[var(--color-accent-soft)] px-[0.6em] py-[0.3em] text-[var(--color-accent)]">Weekly</span>
                <ChevronDown className="ml-auto h-[1.1em] w-[1.1em] text-[var(--text-muted)]" />
              </>
            )}
            {kind === "text" && (
              <>
                <Type className="h-[1.1em] w-[1.1em] shrink-0 text-[var(--color-accent)]" />
                <span className="truncate">The checkout was quick</span>
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </motion.span>
  );
}

function Hero({ primaryCta }: { primaryCta: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative flex min-h-[92svh] flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:px-8">
      <h1 className="font-display text-[clamp(44px,10.2vw,168px)] leading-[0.92] tracking-[-0.03em] text-[var(--text-primary)]">
        <motion.span
          className="block"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Ask <FieldInSentence /> <span className="max-sm:hidden">and</span>
        </motion.span>
        <motion.span
          className="block"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        >
          <span className="sm:hidden">and </span>read every answer.
        </motion.span>
      </h1>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
        className="mt-10 max-w-[34rem] text-[clamp(17px,1.1vw+12px,20px)] leading-relaxed text-[var(--text-primary)]"
      >
        Build a form in minutes, share one link, and see every response with readable labels and a
        funnel that shows where people stop.
      </motion.p>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
        className="mt-9 flex flex-wrap items-center justify-center gap-3"
      >
        {primaryCta}
        <Link href={ROUTES.explore} className={secondaryBtn}>
          Explore public forms
        </Link>
      </motion.div>
    </section>
  );
}

/* ─── Showcase: the headline is an input ──────────────────────── */
const EXAMPLES: { title: string; fields: string[] }[] = [
  { title: "Event RSVP", fields: ["Will you attend?", "How many guests?", "Any dietary needs?"] },
  { title: "Job application", fields: ["Full name", "Link to your portfolio", "Upload your CV"] },
  { title: "Bug report", fields: ["What went wrong?", "Steps to reproduce", "How urgent is it?"] },
];

function TypeTheTitle() {
  const inputId = useId();
  const [title, setTitle] = useState("Customer feedback");
  const example = EXAMPLES.find((e) => e.title === title);
  const fields = example?.fields ?? ["How did we do?", "What should we improve?", "Your email"];
  const slug = generateSlug(title) || "untitled-form";
  const [copied, setCopied] = useState(false);

  return (
    <section aria-labelledby={`${inputId}-label`} className="mx-auto max-w-[1280px] px-4 py-32 sm:px-8 md:py-44">
      <motion.div variants={group} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
        <motion.label
          variants={rise}
          id={`${inputId}-label`}
          htmlFor={inputId}
          className="block text-[16px] text-[var(--text-primary)]"
        >
          Name your form and it gets a link straight away:
        </motion.label>

        <motion.div variants={rise} data-ui className="mt-4 flex items-baseline">
          <input
            id={inputId}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            spellCheck={false}
            className="w-full min-w-0 bg-transparent font-display text-[clamp(44px,8vw,132px)] leading-none tracking-[-0.03em] text-[var(--text-primary)] caret-[var(--color-accent)] outline-none placeholder:text-[var(--text-muted)]"
            placeholder="Type a form name"
          />
        </motion.div>

        <motion.div
          variants={rise}
          data-ui
          className="mt-12 overflow-hidden rounded-xl bg-[var(--bg-panel)] ring-1 ring-[var(--border-color)]"
        >
          {/* The product's answer, at true interface size: the public link, then the form people will see */}
          <div className="flex items-center gap-2 bg-[var(--bg-inset)] p-2 pl-4">
            <span className="truncate text-[16px] text-[var(--text-primary)]">
              {SITE_HOST}/f/<span className="text-[var(--color-accent)]">{slug}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1400);
              }}
              className="ml-auto inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-action)] px-4 text-[13px] font-medium text-white transition-transform active:scale-[0.97]"
              aria-live="polite"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>

          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="font-display text-[36px] leading-tight text-[var(--text-primary)]">{title || "Untitled form"}</p>
              <p className="mt-3 text-[16px] text-[var(--text-muted)]">{fields.length} questions, about a minute to answer</p>
            </div>
            <ul className="space-y-4">
              <AnimatePresence initial={false} mode="popLayout">
                {fields.map((f) => (
                  <motion.li
                    key={`${example?.title ?? "custom"}-${f}`}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="block text-[16px] text-[var(--text-primary)]">{f}</span>
                    <span className="mt-2 block h-11 rounded-md bg-[var(--bg-inset)] ring-1 ring-[var(--border-color)]" />
                  </motion.li>
                ))}
              </AnimatePresence>
              <li>
                <span className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-action)] px-6 text-[16px] font-medium text-white">
                  Submit response
                </span>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-2">
          <span className="w-full text-[16px] text-[var(--text-muted)] sm:w-auto sm:pr-2">Try another:</span>
          {EXAMPLES.map((e) => (
            <button
              key={e.title}
              type="button"
              onClick={() => setTitle(e.title)}
              aria-pressed={title === e.title}
              className={`min-h-[44px] rounded-full px-5 text-[16px] font-medium transition-[transform,background-color,color] active:scale-[0.97] ${
                title === e.title
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  : "bg-[var(--bg-inset)] text-[var(--text-primary)] hover:bg-[var(--border-color)]"
              }`}
            >
              {e.title}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Features: real form settings, each with a working switch ── */
const SETTINGS = [
  { label: "Collect each person's email", effect: "A required email field appears before your first question.", on: true },
  { label: "Show a progress bar", effect: "Respondents see how far along they are, from 0 to 100%.", on: false },
  { label: "Email me for every response", effect: "One email per submission, with a link to that response.", on: true },
  { label: "Allow one response per person", effect: "A second submission from the same network is turned away.", on: false },
  { label: "Require sign-in to answer", effect: "Only people signed in to FormCraft can submit.", on: false },
];

/* Blue tone steps, one per band: one hue, different depths */
const BAND_FILLS = [
  "bg-[color-mix(in_srgb,var(--color-action)_12%,var(--bg-page))]",
  "bg-[color-mix(in_srgb,var(--color-action)_20%,var(--bg-page))]",
  "bg-[color-mix(in_srgb,var(--color-action)_8%,var(--bg-page))]",
  "bg-[color-mix(in_srgb,var(--color-action)_24%,var(--bg-page))]",
  "bg-[color-mix(in_srgb,var(--color-action)_16%,var(--bg-page))]",
];

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      data-ui
      className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full"
    >
      <span
        className={`relative flex h-[30px] w-[54px] items-center rounded-full px-[3px] transition-colors duration-200 ${
          on ? "justify-end bg-[var(--color-action)]" : "justify-start bg-[var(--border-color)]"
        }`}
      >
        <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }} className="h-6 w-6 rounded-full bg-white" />
      </span>
    </button>
  );
}

function SettingBands() {
  const [state, setState] = useState(SETTINGS.map((s) => s.on));
  return (
    <section aria-label="Form settings you control" className="w-full">
      {SETTINGS.map((s, i) => {
        const on = state[i]!;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
            className={`transition-colors duration-300 ${on ? BAND_FILLS[i % BAND_FILLS.length] : "bg-transparent"}`}
          >
            <div className="mx-auto flex min-h-[132px] max-w-[1280px] items-center gap-6 px-4 py-6 sm:px-8 md:min-h-[20vh]">
              <div className="min-w-0 flex-1">
                <p
                  className={`font-display text-[clamp(26px,3.4vw,36px)] leading-tight tracking-[-0.01em] transition-colors ${
                    on ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                  }`}
                >
                  {s.label}
                </p>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2 overflow-hidden text-[16px] text-[var(--text-primary)]"
                    >
                      {s.effect}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <Toggle
                on={on}
                label={s.label}
                onChange={() => setState((prev) => prev.map((v, k) => (k === i ? !v : v)))}
              />
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}

/* ─── Responses: answers as the words people picked ──────────── */
const RESPONSES = [
  { when: "2 min ago", email: "maya@studio.co", visit: "Weekly", rating: 5 },
  { when: "14 min ago", email: "dev.patel@mail.com", visit: "Every day", rating: 4 },
  { when: "1 h ago", email: "sam.k@uni.edu", visit: "Monthly", rating: 4 },
  { when: "3 h ago", email: "lee@shop.io", visit: "Rarely", rating: 2 },
];

function ReadableAnswers() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-32 sm:px-8 md:py-44">
      <motion.div variants={group} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
        <motion.h2 variants={rise} className="max-w-[16ch] font-display text-[clamp(40px,4.6vw,76px)] leading-[0.98] tracking-[-0.02em] text-[var(--text-primary)]">
          Answers you can actually read.
        </motion.h2>
        <motion.p variants={rise} className="mt-6 max-w-[36rem] text-[20px] leading-relaxed text-[var(--text-primary)]">
          A choice shows up as the word your respondent picked, never as option_2. Open any response straight
          from its email, or export them all to CSV.
        </motion.p>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <motion.div variants={rise} data-ui className="min-h-[300px] overflow-x-auto rounded-xl bg-[var(--bg-panel)] ring-1 ring-[var(--border-color)]">
            <table className="w-full text-left sm:min-w-[520px]">
              <thead className="bg-[var(--bg-inset)] text-[13px] text-[var(--text-muted)]">
                <tr>
                  <th className="px-5 py-3 font-medium max-sm:hidden">Submitted</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">How often do you visit?</th>
                  <th className="px-5 py-3 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody className="text-[16px] text-[var(--text-primary)]">
                {RESPONSES.map((r, k) => (
                  <motion.tr
                    key={r.email}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + k * 0.08 }}
                    className={k === 0 ? "bg-[var(--color-accent-soft)]" : "transition-colors hover:bg-[var(--bg-inset)]"}
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-[var(--text-muted)] max-sm:hidden">{r.when}</td>
                    <td className="px-5 py-4">{r.email}</td>
                    <td className="px-5 py-4 font-medium">{r.visit}</td>
                    <td className="px-5 py-4">
                      <span className="flex gap-0.5" aria-label={`${r.rating} of 5`}>
                        {[0, 1, 2, 3, 4].map((s) => (
                          <Star
                            key={s}
                            className={`h-4 w-4 ${s < r.rating ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-[var(--border-color)]"}`}
                          />
                        ))}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <p className="px-5 py-3 text-[13px] text-[var(--text-muted)]">Sample responses</p>
          </motion.div>

          <motion.div variants={rise} data-ui className="flex min-h-[300px] flex-col rounded-xl bg-[var(--bg-panel)] p-6 ring-1 ring-[var(--border-color)]">
            <p className="text-[16px] font-medium text-[var(--text-primary)]">Where people stop</p>
            <div className="mt-6 flex-1 space-y-5">
              {(
                [
                  ["Viewed", 412, 100],
                  ["Started", 297, 72],
                  ["Submitted", 223, 54],
                ] as const
              ).map(([label, n, pct], k) => (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between text-[13px]">
                    <span className="text-[var(--text-primary)]">{label}</span>
                    <span className="tabular-nums text-[var(--text-primary)]">
                      {n} · {pct}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[var(--bg-inset)]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.3 + k * 0.15, ease: EASE }}
                      className="h-full rounded-full bg-[var(--color-action)]"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[13px] text-[var(--text-muted)]">74 people left before submitting. Example figures.</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── How it works: one slider drives the stage ──────────────── */
const STAGES = [
  { name: "Build", clause: "First, drag in your fields." },
  { name: "Publish", clause: "Then publish one public link." },
  { name: "Collect", clause: "Answers arrive as they're sent." },
  { name: "Read", clause: "Finally, see where people stop." },
];

function StageFragment({ stage }: { stage: number }) {
  if (stage === 0) {
    return (
      <ul className="space-y-2">
        {[
          { l: "Full name", I: Type },
          { l: "Email address", I: Mail },
          { l: "How often do you visit?", I: ChevronDown },
        ].map(({ l, I }, k) => (
          <li
            key={l}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[16px] text-[var(--text-primary)] ${
              k === 1 ? "bg-[var(--color-accent-soft)] ring-1 ring-[var(--color-accent)]" : "bg-[var(--bg-inset)]"
            }`}
          >
            <GripVertical className="h-4 w-4 text-[var(--text-muted)]" />
            <I className="h-4 w-4 text-[var(--color-accent)]" />
            {l}
          </li>
        ))}
      </ul>
    );
  }
  if (stage === 1) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[16px] text-[var(--text-primary)]">Customer feedback</span>
          <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[13px] font-medium text-[var(--color-accent)]">Published</span>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-[var(--bg-inset)] p-1.5 pl-3">
          <span className="truncate text-[16px] text-[var(--text-primary)]">{SITE_HOST}/f/customer-feedback</span>
          <span className="ml-auto rounded-full bg-[var(--color-action)] px-3 py-1.5 text-[13px] font-medium text-white">Copy</span>
        </div>
      </div>
    );
  }
  if (stage === 2) {
    return (
      <ul className="space-y-2">
        {["Weekly", "Monthly", "Every day"].map((a) => (
          <li key={a} className="flex items-center justify-between gap-3 rounded-md bg-[var(--bg-inset)] px-3 py-2.5">
            <span className="truncate text-[13px] text-[var(--text-muted)]">How often do you visit?</span>
            <span className="shrink-0 text-[16px] font-medium text-[var(--text-primary)]">{a}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="space-y-3">
      {(
        [
          ["Viewed", 100],
          ["Started", 72],
          ["Submitted", 54],
        ] as const
      ).map(([label, pct]) => (
        <div key={label}>
          <div className="mb-1 flex justify-between text-[13px]">
            <span className="text-[var(--text-primary)]">{label}</span>
            <span className="tabular-nums text-[var(--text-primary)]">{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-[var(--bg-inset)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: EASE }}
              className="h-full rounded-full bg-[var(--color-action)]"
            />
          </div>
        </div>
      ))}
      <p className="pt-1 text-right text-[13px] text-[var(--text-muted)]">Example figures</p>
    </div>
  );
}

function Stages() {
  const [stage, setStage] = useState(0);
  const sliderId = useId();
  const current = STAGES[stage]!;

  return (
    <section aria-labelledby={`${sliderId}-h`} className="mx-auto flex max-w-[1280px] flex-col items-center px-4 py-32 text-center sm:px-8 md:py-44">
      <div className="flex min-h-[2.1em] items-center font-display text-[clamp(40px,4.6vw,76px)] leading-[0.98] tracking-[-0.02em]">
        <AnimatePresence mode="wait">
          <motion.h2
            key={current.name}
            id={`${sliderId}-h`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="mx-auto max-w-[14ch] text-[var(--text-primary)]"
          >
            {current.clause}
          </motion.h2>
        </AnimatePresence>
      </div>

      <div data-ui className="mt-12 flex min-h-[260px] w-full max-w-[600px] items-center rounded-xl bg-[var(--bg-panel)] p-6 text-left ring-1 ring-[var(--border-color)] sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={stage} className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <StageFragment stage={stage} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-14 w-full max-w-[720px]">
        <label htmlFor={sliderId} className="sr-only">
          Stage
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={STAGES.length - 1}
          step={1}
          value={stage}
          onChange={(e) => setStage(Number(e.target.value))}
          aria-valuetext={current.name}
          className="stage-slider w-full"
          style={{ ["--fill" as string]: `${(stage / (STAGES.length - 1)) * 100}%` }}
        />
        <div className="mt-4 grid grid-cols-4 text-[16px]">
          {STAGES.map((s, k) => (
            <button
              key={s.name}
              type="button"
              onClick={() => setStage(k)}
              className={`min-h-[44px] transition-colors ${k === stage ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Close: the idea again, colours inverted ────────────────── */
function Close({ isSignedIn }: { isSignedIn: boolean }) {
  const btn =
    "inline-flex min-h-[56px] items-center justify-center rounded-full bg-[var(--color-action)] px-8 text-base font-medium text-white transition-[transform,background-color] hover:bg-[var(--color-action-hover)] active:scale-[0.97] max-sm:w-full";
  return (
    <section className="bg-[var(--text-primary)] text-[var(--bg-page)]">
      <motion.div
        variants={group}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto flex min-h-[80svh] max-w-[1280px] flex-col items-center justify-center px-4 py-24 text-center sm:px-8 md:min-h-[90svh]"
      >
        <motion.h2 variants={rise} className="font-display text-[clamp(42px,10vw,160px)] leading-[0.9] tracking-[-0.03em]">
          Ask once.
          <br />
          Read everything.
        </motion.h2>
        <motion.p variants={rise} className="mt-10 max-w-[30rem] text-[20px] leading-relaxed">
          Free to start. Your first form can be live before your coffee cools.
        </motion.p>
        <motion.div variants={rise} className="mt-10 w-full sm:w-auto">
          {isSignedIn ? (
            <Link href={ROUTES.dashboard} className={btn}>
              Go to your dashboard
            </Link>
          ) : (
            <SignUpButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
              <button type="button" className={btn}>
                Create your first form
              </button>
            </SignUpButton>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { isSignedIn } = useAuth();

  const primaryCta = isSignedIn ? (
    <Link href={ROUTES.dashboard} className={primaryBtn}>
      Go to your dashboard
    </Link>
  ) : (
    <SignUpButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
      <button type="button" className={primaryBtn}>
        Start building free
      </button>
    </SignUpButton>
  );

  return (
    <div className="overflow-x-clip">
      <Hero primaryCta={primaryCta} />
      <div id="features" className="scroll-mt-20">
        <TypeTheTitle />
        <SettingBands />
      </div>
      <ReadableAnswers />
      <div id="how-it-works" className="scroll-mt-20">
        <Stages />
      </div>
      <Close isSignedIn={!!isSignedIn} />
    </div>
  );
}
