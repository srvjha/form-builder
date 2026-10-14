"use client";

import Link from "next/link";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  GripVertical,
  Inbox,
  LayoutGrid,
  Link2,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";
import { ROUTES } from "@/lib/constants";

/* ─── Content (only what the app actually does) ───────────────── */
const FIELD_TYPES = [
  "Short text", "Long text", "Email", "Phone", "Number", "URL", "Date", "Time",
  "Single select", "Multi select", "Checkbox", "Rating", "Scale / NPS", "File upload",
];

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Visual form builder",
    description: "Drag fields onto a canvas, name your form, and preview it exactly as respondents see it.",
    span: "md:col-span-2",
  },
  {
    icon: GripVertical,
    title: "Reorder any time",
    description: "Drag questions into the order you want, before or after publishing.",
    span: "",
  },
  {
    icon: Inbox,
    title: "Responses in one place",
    description: "Every submission with readable option labels. Get an email per response or export everything to CSV.",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Per-form analytics",
    description: "Views, starts, submissions and completion, plus a funnel that shows exactly where people drop off.",
    span: "md:col-span-2",
  },
  {
    icon: Link2,
    title: "Share and embed",
    description: "Publish to a public link, or paste an embed snippet to put the form on your own site.",
    span: "md:col-span-2",
  },
];

const STEPS = [
  { step: "01", title: "Create", description: "Add fields from the palette and arrange them by dragging." },
  { step: "02", title: "Publish", description: "Get a public link that is ready to share the moment you publish." },
  { step: "03", title: "Collect", description: "Watch responses arrive, review them, and export to CSV when you need to." },
];

const EXAMPLE_BARS = [38, 62, 46, 80, 58, 90, 72];

/* ─── Shared bits ─────────────────────────────────────────────── */
const primaryBtn =
  "group inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-text)] shadow-soft-accent transition-transform hover:-translate-y-0.5 active:translate-y-0";
const secondaryBtn =
  "inline-flex items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-inset)]";

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* Ambient background: drifting colour blobs behind the hero */
function AmbientBlobs() {
  const reduce = useReducedMotion();
  const blobs = [
    { c: "rgba(13,148,136,0.35)", x: "-10%", y: "-15%", s: 520, d: 18 },
    { c: "rgba(14,165,233,0.30)", x: "55%", y: "-5%", s: 460, d: 22 },
    { c: "rgba(16,185,129,0.22)", x: "20%", y: "45%", s: 560, d: 26 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{ left: b.x, top: b.y, width: b.s, height: b.s, background: b.c }}
          animate={reduce ? undefined : { x: [0, 40, -30, 0], y: [0, -30, 20, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0 bg-dot-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
    </div>
  );
}

/* Tilts the hero mockup toward the pointer and floats gently */
function TiltCard({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 20 });

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <div style={{ perspective: 1200 }} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        ref={ref}
        style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformStyle: "preserve-3d" }}
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
}

/* A product mockup: a form card and a live-looking analytics card */
function HeroMockup() {
  return (
    <TiltCard>
      <div className="relative mx-auto w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="relative z-10 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-5 shadow-soft-lg"
        >
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
                  <motion.span
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
                    className={`h-4 flex-1 origin-bottom rounded-sm ${i < 8 ? "bg-[var(--color-accent)]" : "bg-[var(--border-muted)]"}`}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-md border border-[var(--border-color)] bg-[var(--bg-inset)] p-3">
              <p className="text-xs font-medium text-[var(--text-secondary)]">Email</p>
              <div className="mt-2 h-7 rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)]" />
            </div>
            <div className="flex items-center justify-between rounded-md bg-[var(--color-accent)] px-3 py-2">
              <span className="text-xs font-semibold text-[var(--color-accent-text)]">Submit</span>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--color-accent-text)]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="absolute -bottom-8 -right-2 z-20 w-60 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-4 shadow-soft-xl sm:-right-8"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--text-primary)]">Responses</p>
            <span className="rounded-full bg-[var(--color-accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-accent)]">
              Example data
            </span>
          </div>
          <div className="mt-3 flex h-20 items-end gap-1.5">
            {EXAMPLE_BARS.map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 1 + i * 0.07, duration: 0.6, ease: "easeOut" }}
                className="flex-1 rounded-sm bg-[var(--gradient-brand)]"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </TiltCard>
  );
}

/* Marquee of the 14 field types, scrolling forever */
function FieldMarquee() {
  const reduce = useReducedMotion();
  const row = [...FIELD_TYPES, ...FIELD_TYPES];
  return (
    <div className="relative overflow-hidden border-y border-[var(--border-muted)] bg-[var(--bg-panel)] py-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex w-max gap-3"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {row.map((t, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded-full border border-[var(--border-color)] bg-[var(--bg-inset)] px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)]"
          >
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* Bento card with a cursor-following spotlight */
function BentoCard({
  icon: Icon,
  title,
  description,
  span,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  span: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const bg = useMotionTemplate`radial-gradient(360px circle at ${x}px ${y}px, rgba(13,148,136,0.14), transparent 60%)`;

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  }

  return (
    <motion.div
      ref={ref}
      variants={reveal}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      onPointerMove={onMove}
      className={`group relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-6 shadow-soft-sm transition-shadow hover:shadow-soft-lg ${span}`}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: bg }} />
      <div className="relative">
        <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
      </div>
    </motion.div>
  );
}

/* Steps with a line that fills as you scroll past them */
function Steps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-0 right-0 top-6 hidden h-px bg-[var(--border-color)] md:block" />
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="absolute left-0 right-0 top-6 hidden h-px bg-[var(--gradient-brand)] md:block"
      />
      <div className="grid gap-10 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.step}
            variants={reveal}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="relative"
          >
            <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-panel)] text-sm font-bold text-[var(--color-accent)] shadow-soft-sm">
              {s.step}
            </span>
            <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">{s.title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const reduce = useReducedMotion();

  const headline = ["Forms that", "people finish", "and you can read."];

  const primaryCta = isSignedIn ? (
    <Link href={ROUTES.dashboard} className={primaryBtn}>
      Go to dashboard
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  ) : (
    <SignUpButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
      <button type="button" className={primaryBtn}>
        Start building free
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </SignUpButton>
  );

  return (
    <div className="overflow-hidden">
      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <section className="relative isolate">
        <AmbientBlobs />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-20 sm:px-6 md:pt-28 lg:grid-cols-2 lg:gap-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-panel)]/80 px-3 py-1 text-xs font-medium text-[var(--text-secondary)] shadow-soft-xs backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              Forms, responses and analytics in one place
            </motion.span>

            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-7xl">
              {headline.map((line, li) => (
                <span key={li} className="block overflow-hidden pb-1">
                  <motion.span
                    className="block"
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 + li * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {li === 1 ? <span className="text-brand-gradient">{line}</span> : line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--text-muted)]"
            >
              Build a form in minutes, share it with a link, and see every answer with readable labels
              and live analytics. No clutter, no lock-in.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              {primaryCta}
              <Link href={ROUTES.explore} className={secondaryBtn}>
                Explore public forms
              </Link>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text-muted)]"
            >
              {["14 field types", "CSV export", "Email alerts", "Embed anywhere"].map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-green)]" />
                  {f}
                </li>
              ))}
            </motion.ul>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <HeroMockup />
          </div>
        </div>
      </section>

      <FieldMarquee />

      {/* ═══ Features (bento) ═══════════════════════════════════ */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-12 max-w-2xl"
        >
          <p className="text-sm font-semibold text-[var(--color-accent)]">Everything you need</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            One tool from first question to final answer.
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <BentoCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* ═══ How it works ═══════════════════════════════════════ */}
      <section className="border-y border-[var(--border-muted)] bg-[var(--bg-panel)]">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-14 max-w-2xl"
          >
            <p className="text-sm font-semibold text-[var(--color-accent)]">How it works</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Three steps. No setup.
            </h2>
          </motion.div>
          <Steps />
        </div>
      </section>

      {/* ═══ Final CTA ══════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden px-4 py-24 sm:px-6">
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[var(--gradient-brand)]"
          animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundSize: "200% 200%" }}
        />
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center text-[var(--color-accent-text)]"
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Your next form takes five minutes.</h2>
          <p className="mx-auto mt-4 max-w-xl text-base opacity-90">
            Start free, publish a link, and start reading answers today.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {isSignedIn ? (
              <Link href={ROUTES.dashboard} className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5">
                Go to dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <SignUpButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
                <button type="button" className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5">
                  Create your first form <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
