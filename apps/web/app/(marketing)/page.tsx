"use client";

import Link from "next/link";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  AlignLeft,
  ArrowRight,
  BarChart3,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  Clock,
  Copy,
  GripVertical,
  Hash,
  Inbox,
  LayoutGrid,
  Link2,
  Mail,
  Phone,
  Sliders,
  Sparkles,
  Star,
  Type,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ROUTES } from "@/lib/constants";

/* ─── Content (only what the app actually does) ───────────────── */
const FIELD_TYPES = [
  { label: "Short text", icon: Type },
  { label: "Long text", icon: AlignLeft },
  { label: "Email", icon: Mail },
  { label: "Phone", icon: Phone },
  { label: "Number", icon: Hash },
  { label: "URL", icon: Link2 },
  { label: "Date", icon: Calendar },
  { label: "Time", icon: Clock },
  { label: "Single select", icon: ChevronDown },
  { label: "Multi select", icon: CheckSquare },
  { label: "Checkbox", icon: Check },
  { label: "Rating", icon: Star },
  { label: "Scale / NPS", icon: Sliders },
  { label: "File upload", icon: Upload },
];

const STEPS = [
  { step: "01", title: "Create", description: "Add fields from the palette and arrange them by dragging." },
  { step: "02", title: "Publish", description: "Get a public link that is ready to share the moment you publish." },
  { step: "03", title: "Collect", description: "Watch responses arrive, review them, and export to CSV when you need to." },
];

const EXAMPLE_BARS = [38, 62, 46, 80, 58, 90, 72];

/* ─── Shared bits ─────────────────────────────────────────────── */
const primaryBtn =
  "group inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-soft-accent transition-transform hover:-translate-y-0.5 active:translate-y-0 dark:text-[var(--color-accent-text)]";
const secondaryBtn =
  "inline-flex items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)]/70 px-5 py-3 text-sm font-semibold text-[var(--text-primary)] backdrop-blur transition-colors hover:bg-[var(--bg-inset)]";

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* Cycles 0..n-1 on an interval (paused when reduced motion is on) */
function useTicker(n: number, ms: number) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(id);
  }, [n, ms, reduce]);
  return i;
}

/* Ambient background: drifting blue, sky and yellow glows behind the hero */
function AmbientGlow() {
  const reduce = useReducedMotion();
  const glows = [
    { c: "rgba(37,99,235,0.30)", x: "-8%", y: "-20%", s: 620, d: 20 },
    { c: "rgba(14,165,233,0.26)", x: "52%", y: "-12%", s: 560, d: 24 },
    { c: "rgba(250,204,21,0.16)", x: "28%", y: "40%", s: 520, d: 28 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {glows.map((g, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{ left: g.x, top: g.y, width: g.s, height: g.s, background: g.c }}
          animate={reduce ? undefined : { x: [0, 40, -30, 0], y: [0, -30, 20, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: g.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0 bg-dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]" />
      {/* fade the glow into the page so it never ends on a hard edge */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--bg-page)]" />
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

  return (
    <div style={{ perspective: 1200 }} onPointerMove={onMove} onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}>
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

function HeroMockup() {
  return (
    <TiltCard>
      <div className="relative mx-auto w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
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
              <span className="text-xs font-semibold text-white dark:text-[var(--color-accent-text)]">Submit</span>
              <ArrowRight className="h-3.5 w-3.5 text-white dark:text-[var(--color-accent-text)]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
          className="absolute -bottom-8 -right-2 z-20 w-60 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-4 shadow-soft-xl sm:-right-8"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--text-primary)]">Responses</p>
            <span className="rounded-full bg-[var(--bg-inset)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
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
                className="flex-1 rounded-sm bg-brand-gradient"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </TiltCard>
  );
}

/* Two rows of field types scrolling in opposite directions */
function MarqueeRow({ items, reverse }: { items: typeof FIELD_TYPES; reverse?: boolean }) {
  const reduce = useReducedMotion();
  const row = [...items, ...items];
  return (
    <motion.div
      className="flex w-max gap-3"
      animate={reduce ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
    >
      {row.map(({ label, icon: Icon }, i) => (
        <span
          key={i}
          className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--border-color)] bg-[var(--bg-panel)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] shadow-soft-xs"
        >
          <span className={`flex h-6 w-6 items-center justify-center rounded-full ${i % 3 === 0 ? "bg-[var(--color-highlight-soft)] text-[var(--color-highlight-text)] dark:text-[var(--color-highlight)]" : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"}`}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          {label}
        </span>
      ))}
    </motion.div>
  );
}

function FieldMarquee() {
  return (
    <section className="relative py-10">
      <p className="mb-6 text-center text-sm font-medium text-[var(--text-muted)]">
        14 field types, ready to drop in
      </p>
      <div className="space-y-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <MarqueeRow items={FIELD_TYPES.slice(0, 7)} />
        <MarqueeRow items={FIELD_TYPES.slice(7)} reverse />
      </div>
    </section>
  );
}

/* ─── Bento card shell: reveal + cursor spotlight ─────────────── */
function BentoCard({
  icon: Icon,
  title,
  description,
  className,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${x}px ${y}px, rgba(59,130,246,0.14), transparent 60%)`;

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
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -4 }}
      onPointerMove={onMove}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] shadow-soft-sm transition-shadow hover:shadow-soft-lg ${className ?? ""}`}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />
      <div className="relative z-10 flex min-h-[180px] flex-1 items-center justify-center border-b border-[var(--border-muted)] bg-[var(--bg-inset)]/60 p-6">
        {children}
      </div>
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
      </div>
    </motion.div>
  );
}

/* Builder: fields drop onto the canvas one after another */
function BuilderDemo() {
  const fields = [
    { label: "Full name", icon: Type },
    { label: "Email address", icon: Mail },
    { label: "How did you hear about us?", icon: ChevronDown },
    { label: "Rate your experience", icon: Star },
  ];
  const n = useTicker(fields.length + 2, 1100);
  const shown = Math.min(n, fields.length);
  return (
    <div className="w-full max-w-sm space-y-2">
      <AnimatePresence initial={false}>
        {fields.slice(0, shown).map(({ label, icon: Icon }) => (
          <motion.div
            key={label}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="flex items-center gap-3 rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] px-3 py-2.5 shadow-soft-xs"
          >
            <GripVertical className="h-4 w-4 text-[var(--text-muted)]" />
            <Icon className="h-4 w-4 text-[var(--color-accent)]" />
            <span className="text-sm text-[var(--text-primary)]">{label}</span>
          </motion.div>
        ))}
      </AnimatePresence>
      {shown < fields.length && (
        <div className="rounded-md border border-dashed border-[var(--color-accent)]/50 px-3 py-2.5 text-center text-xs text-[var(--color-accent)]">
          Drop a field here
        </div>
      )}
    </div>
  );
}

/* Reorder: three questions swap places */
function ReorderDemo() {
  const orders = [
    ["Name", "Email", "Feedback"],
    ["Email", "Name", "Feedback"],
    ["Email", "Feedback", "Name"],
  ];
  const i = useTicker(orders.length, 1600);
  return (
    <ul className="w-full max-w-[220px] space-y-2">
      {orders[i]!.map((item, idx) => (
        <motion.li
          key={item}
          layout
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="flex items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-soft-xs"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[var(--color-accent-soft)] text-[11px] font-semibold text-[var(--color-accent)]">
            {idx + 1}
          </span>
          {item}
          <GripVertical className="ml-auto h-4 w-4 text-[var(--text-muted)]" />
        </motion.li>
      ))}
    </ul>
  );
}

/* Responses: new submissions slide into the list */
function ResponsesDemo() {
  const answers = ["Weekly", "Female", "Very likely", "Monthly", "Male", "Not sure"];
  const i = useTicker(answers.length, 1500);
  const rows = [0, 1, 2].map((k) => ({ id: i - k, text: answers[(i - k + answers.length * 10) % answers.length]! }));
  return (
    <div className="w-full max-w-[240px] space-y-2">
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map((r, k) => (
          <motion.div
            key={r.id}
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1 - k * 0.25, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] px-3 py-2 shadow-soft-xs"
          >
            <span className="text-xs text-[var(--text-muted)]">New response</span>
            <span className="text-sm font-medium text-[var(--text-primary)]">{r.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* Analytics: funnel bars fill when scrolled into view */
function FunnelDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const steps = [
    { label: "Viewed", pct: 100 },
    { label: "Started", pct: 72 },
    { label: "Submitted", pct: 54 },
  ];
  return (
    <div ref={ref} className="w-full max-w-md space-y-3">
      {steps.map((s, i) => (
        <div key={s.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-[var(--text-secondary)]">{s.label}</span>
            <span className="font-semibold text-[var(--text-primary)]">{s.pct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--border-muted)]">
            <motion.div
              className="h-full rounded-full bg-brand-gradient"
              initial={{ width: 0 }}
              animate={{ width: inView ? `${s.pct}%` : 0 }}
              transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
      <p className="pt-1 text-right text-[10px] text-[var(--text-muted)]">Example data</p>
    </div>
  );
}

/* Share: the link gets copied, then the embed snippet types out */
function ShareDemo() {
  const tick = useTicker(4, 1400);
  const copied = tick === 1 || tick === 2;
  return (
    <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <div className="flex items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] p-2 pl-3 shadow-soft-xs">
        <Link2 className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
        <span className="truncate text-sm text-[var(--text-secondary)]">formcraft.app/f/customer-feedback</span>
        <motion.span
          animate={{ scale: copied ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.3 }}
          className={`ml-auto flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
            copied ? "bg-[var(--color-green)] text-white" : "bg-[var(--color-accent)] text-white dark:text-[var(--color-accent-text)]"
          }`}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </motion.span>
      </div>
      <pre className="overflow-hidden rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] p-3 font-mono text-[11px] leading-relaxed text-[var(--text-secondary)] shadow-soft-xs">
        <span className="text-[var(--color-accent)]">&lt;iframe</span>{" "}src=&quot;…/f/customer-feedback&quot;
        {"\n"}  width=&quot;100%&quot; height=&quot;650&quot;
        <span className="text-[var(--color-accent)]">&gt;&lt;/iframe&gt;</span>
      </pre>
    </div>
  );
}

/* Steps with a line that fills as you scroll past them */
function Steps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-6 right-6 top-6 hidden h-px bg-[var(--border-color)] md:block" />
      <motion.div style={{ scaleX, transformOrigin: "left" }} className="absolute left-6 right-6 top-6 hidden h-px bg-brand-gradient md:block" />
      <div className="grid gap-10 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
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

  const ctaLabel = isSignedIn ? "Go to dashboard" : "Start building free";
  const primaryCta = isSignedIn ? (
    <Link href={ROUTES.dashboard} className={primaryBtn}>
      {ctaLabel}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  ) : (
    <SignUpButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
      <button type="button" className={primaryBtn}>
        {ctaLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </SignUpButton>
  );

  const whiteBtn =
    "group inline-flex items-center gap-2 rounded-md bg-[var(--color-highlight)] px-6 py-3 text-sm font-semibold text-[var(--color-highlight-text)] shadow-soft-lg transition-transform hover:-translate-y-0.5";

  return (
    <div className="overflow-hidden">
      {/* ═══ Hero (sits under the transparent nav) ════════════ */}
      <section className="relative isolate">
        <AmbientGlow />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-32 sm:px-6 md:pt-40 lg:grid-cols-2 lg:gap-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-panel)]/70 px-3 py-1 text-xs font-medium text-[var(--text-secondary)] shadow-soft-xs backdrop-blur"
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
                    transition={{ duration: 0.8, delay: 0.1 + li * 0.12, ease: "easeOut" }}
                  >
                    {li === 1 ? (
                      <span className="relative inline-block">
                        <span className="relative z-10 text-brand-gradient">{line}</span>
                        <motion.span
                          aria-hidden
                          className="absolute -bottom-1 left-0 z-0 h-3 w-full origin-left rounded-full bg-[var(--color-highlight)] opacity-70 sm:h-4"
                          initial={reduce ? false : { scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
                        />
                      </span>
                    ) : line}
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
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.9 } } }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {["14 field types", "CSV export", "Email alerts", "Embed anywhere"].map((f) => (
                <motion.li
                  key={f}
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-panel)]/60 px-3 py-1 text-xs font-medium text-[var(--text-secondary)] backdrop-blur"
                >
                  <Check className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                  {f}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <HeroMockup />
          </div>
        </div>
      </section>

      <FieldMarquee />

      {/* ═══ Features (bento with live demos) ═════════════════ */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold text-[var(--color-accent)]">Everything you need</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            One tool from first question to{" "}
            <span className="text-brand-gradient">final answer.</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          <BentoCard
            icon={LayoutGrid}
            title="Visual form builder"
            description="Drag fields onto a canvas and preview the form exactly as respondents see it."
            className="md:col-span-2"
          >
            <BuilderDemo />
          </BentoCard>
          <BentoCard icon={GripVertical} title="Reorder any time" description="Drag questions into the order you want, before or after publishing.">
            <ReorderDemo />
          </BentoCard>
          <BentoCard icon={Inbox} title="Responses in one place" description="Readable answers, an email for every submission, and CSV export.">
            <ResponsesDemo />
          </BentoCard>
          <BentoCard
            icon={BarChart3}
            title="Per-form analytics"
            description="Views, starts, submissions and completion, with a funnel that shows where people drop off."
            className="md:col-span-2"
          >
            <FunnelDemo />
          </BentoCard>
          <BentoCard
            icon={Link2}
            title="Share and embed"
            description="Publish to a public link, or paste an embed snippet to put the form on your own site."
            className="md:col-span-3"
          >
            <ShareDemo />
          </BentoCard>
        </div>
      </section>

      {/* ═══ How it works ═════════════════════════════════════ */}
      <section id="how-it-works" className="scroll-mt-24 border-y border-[var(--border-muted)] bg-[var(--bg-panel)]">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold text-[var(--color-accent)]">How it works</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Three steps. No setup.
            </h2>
          </motion.div>
          <Steps />
        </div>
      </section>

      {/* ═══ Final CTA ════════════════════════════════════════ */}
      <section className="px-4 py-24 sm:px-6">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl px-6 py-16 text-center shadow-soft-xl sm:px-12"
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{ backgroundImage: "linear-gradient(120deg, #1D4ED8, #2563EB, #0EA5E9, #2563EB, #1D4ED8)", backgroundSize: "300% 300%" }}
            animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-dot-grid opacity-20" />
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Your next form takes five minutes.</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85">
            Start free, publish a link, and start reading answers today.
          </p>
          <div className="mt-9 flex justify-center">
            {isSignedIn ? (
              <Link href={ROUTES.dashboard} className={whiteBtn}>
                Go to dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <SignUpButton mode="redirect" fallbackRedirectUrl={ROUTES.dashboard}>
                <button type="button" className={whiteBtn}>
                  Create your first form <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </SignUpButton>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
