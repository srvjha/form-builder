"use client";

import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowRight, Zap, BarChart2, Shield, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MascotScene } from "@/components/mascot/mascot-scene";
import { useMascotStore } from "@/stores/mascot-store";
import { ROUTES } from "@/lib/constants";

/* ─── Static data ─────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Zap,
    title: "14 Field Types",
    description:
      "Text, email, number, rating, scale, file upload — everything you need. No plugins, no upsells.",
  },
  {
    icon: BarChart2,
    title: "Real-Time Analytics",
    description:
      "Completion rates, drop-off funnels, per-field breakdowns. Live, no delays.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Rate limiting, IP dedup, Clerk auth. GDPR-ready data handling out of the box.",
  },
  {
    icon: Code2,
    title: "Open API",
    description:
      "Full REST + tRPC API. Build on top of it, integrate with anything, own your data.",
  },
];

const STEPS = [
  { step: "01", title: "Create",  description: "Drag fields onto the canvas. Name it. Done." },
  { step: "02", title: "Publish", description: "Hit publish. Get a shareable link instantly." },
  { step: "03", title: "Collect", description: "Responses arrive live. Export, filter, analyse." },
];

/* ─── Brix reaction map ───────────────────────────────────────── */
import type { BrixState } from "@/stores/mascot-store";

type Reaction = { state: BrixState; message: string };

const REACTIONS = {
  signUp:   { state: "excited",  message: "No credit card. No excuses." } as Reaction,
  explore:  { state: "thinking", message: "Inspiration awaits..."       } as Reaction,
  features: { state: "waving",   message: "This is just the beginning." } as Reaction,
  pricing:  { state: "success",  message: "We keep it honest. Always."  } as Reaction,
  cta:      { state: "excited",  message: "Let's build something great!" } as Reaction,
};

/* ─── Animation variants ──────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.35 },
  }),
};

/* ─── Hoverable wrapper ───────────────────────────────────────── */
function Reactive({
  reaction,
  children,
  className,
}: {
  reaction: Reaction;
  children: React.ReactNode;
  className?: string;
}) {
  const { setState, reset } = useMascotStore();
  return (
    <span
      className={className}
      onMouseEnter={() => setState(reaction.state, reaction.message, true)}
      onMouseLeave={() => reset()}
    >
      {children}
    </span>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="bg-[var(--bg-page)] bg-dot-grid">

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b-2 border-[var(--border-color)] px-6 py-20 md:py-28">

        {/* Gigantic background "FORM" watermark */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-4 select-none text-center font-display text-[18vw] font-black uppercase leading-none tracking-tighter text-[var(--border-muted)] opacity-[0.07]"
        >
          FORM
        </span>

        <div className="relative mx-auto max-w-content">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">

            {/* ── Left: copy + CTAs ──────────────────────────── */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
                <Badge variant="accent" className="mb-6 inline-flex">
                  Now in Public Beta
                </Badge>
              </motion.div>

              <motion.h1
                initial="hidden" animate="visible" custom={1} variants={fadeUp}
                className="font-display text-5xl font-black uppercase leading-tight tracking-tight md:text-6xl lg:text-7xl"
              >
                THE FORM BUILDER
                <br />THAT DOESN&apos;T
                <br /><span className="text-[var(--color-accent)]">APOLOGISE.</span>
              </motion.h1>

              <motion.p
                initial="hidden" animate="visible" custom={2} variants={fadeUp}
                className="mx-auto mt-6 max-w-xl text-lg text-[var(--text-muted)] lg:mx-0 md:text-xl"
              >
                Collect data. Understand people. No fluff, no gradients, no lorem ipsum.
              </motion.p>

              <motion.div
                initial="hidden" animate="visible" custom={3} variants={fadeUp}
                className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              >
                <Reactive reaction={REACTIONS.signUp}>
                  <SignUpButton mode="redirect" fallbackRedirectUrl="/dashboard">
                    <Button size="lg" className="gap-2 shadow-brut-lg">
                      Start Building Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </SignUpButton>
                </Reactive>

                <Reactive reaction={REACTIONS.explore}>
                  <Button variant="secondary" size="lg" asChild>
                    <Link href={ROUTES.explore}>See Live Forms</Link>
                  </Button>
                </Reactive>
              </motion.div>

              <motion.ul
                initial="hidden" animate="visible" custom={4} variants={fadeUp}
                className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] lg:justify-start"
              >
                {["No credit card", "Free forever plan", "100 responses/mo free"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <span className="text-[var(--color-green)]">✓</span>
                    {item}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* ── Right: Brix mascot ─────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="hidden shrink-0 lg:flex lg:items-center lg:justify-center"
            >
              <MascotScene size={220} withBubble />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══ Features ═══════════════════════════════════════════ */}
      <section id="features" className="border-b-2 border-[var(--border-color)] px-6 py-20">
        <div className="mx-auto max-w-content">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="label-overline mb-3">What you get</p>
              <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                Everything needed.
                <br />Nothing that isn&apos;t.
              </h2>
            </div>
            <Reactive reaction={REACTIONS.features} className="hidden md:block">
              <span className="font-mono text-xs text-[var(--text-muted)] cursor-default select-none">
                hover to meet Brix →
              </span>
            </Reactive>
          </div>

          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
              >
                <Card
                  className="border-r-0 last:border-r-2 sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(4)]:border-r-2 lg:border-r-0 lg:last:border-r-2"
                  shadow="none"
                  asMotion
                  interactive
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center border-2 border-[var(--border-color)] bg-[var(--bg-inset)]">
                      <Icon className="h-5 w-5 text-[var(--color-accent)]" />
                    </div>
                    <h3 className="mb-2 font-display text-base font-extrabold uppercase tracking-wide">
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How it works ════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="border-b-2 border-[var(--border-color)] bg-[var(--color-black)] px-6 py-20 text-[var(--color-white)]"
      >
        <div className="mx-auto max-w-content">
          <div className="mb-12">
            <p className="label-overline mb-3 text-[var(--text-muted)]">How it works</p>
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
              Three steps.
              <br />No tutorial needed.
            </h2>
          </div>

          <ol className="grid gap-0 md:grid-cols-3">
            {STEPS.map(({ step, title, description }, i) => (
              <motion.li
                key={step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="border-2 border-[#333] p-8 md:border-r-0 md:last:border-r-2"
              >
                <span className="font-display text-7xl font-black text-[#2A2A2A] leading-none">
                  {step}
                </span>
                <h3 className="mt-4 font-display text-xl font-extrabold uppercase tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#888]">{description}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ Pricing teaser ══════════════════════════════════════ */}
      <Reactive reaction={REACTIONS.pricing}>
        <section id="pricing" className="border-b-2 border-[var(--border-color)] px-6 py-20">
          <div className="mx-auto max-w-content">
            <div className="mb-2">
              <p className="label-overline mb-3">Pricing</p>
              <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                Honest pricing.
                <br />No gotchas.
              </h2>
            </div>
            <div className="mt-10 grid gap-0 sm:grid-cols-3">
              {[
                { plan: "Free",    price: "$0",  note: "Forever", features: ["100 responses/mo", "5 forms", "Basic analytics"] },
                { plan: "Pro",     price: "$12", note: "/month",  features: ["Unlimited responses", "Unlimited forms", "Full analytics", "Custom domains"] },
                { plan: "Team",    price: "$39", note: "/month",  features: ["Everything in Pro", "5 seats", "Priority support", "API access"] },
              ].map(({ plan, price, note, features }, i) => (
                <motion.div
                  key={plan}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className={`border-2 border-[var(--border-color)] border-r-0 last:border-r-2 p-8 ${i === 1 ? "bg-[var(--color-accent)] text-white" : "bg-[var(--bg-panel)]"}`}
                >
                  <p className="label-overline mb-4 opacity-70">{plan}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-5xl font-black">{price}</span>
                    <span className={`text-sm font-bold ${i === 1 ? "text-white/70" : "text-[var(--text-muted)]"}`}>{note}</span>
                  </div>
                  <ul className="mt-6 space-y-2">
                    {features.map((f) => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${i === 1 ? "text-white/90" : "text-[var(--text-muted)]"}`}>
                        <span className={i === 1 ? "text-white" : "text-[var(--color-green)]"}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reactive>

      {/* ═══ Meet the Crew teaser ═══════════════════════════════ */}
      <section className="border-b-2 border-[var(--border-color)] px-6 py-20">
        <div className="mx-auto max-w-content">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="label-overline mb-3">The characters</p>
              <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                Meet the crew.
                <br />They all have opinions.
              </h2>
            </div>
            <Link
              href={ROUTES.characters}
              className="shrink-0 inline-flex items-center gap-2 border-2 border-[var(--border-color)] px-4 py-2 font-display text-xs font-extrabold uppercase tracking-wider shadow-brut-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              Full introductions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-0 border-2 border-[var(--border-color)] sm:grid-cols-3">
            {[
              { name: "Brix", title: "The Builder",   color: "#FFD600", line: "\"Let's build.\"",           sub: "Form builder · Landing page"  },
              { name: "Rex",  title: "The Analyst",   color: "#00C853", line: "\"23% drop-off. Interesting.\"", sub: "Analytics · Responses"   },
              { name: "Flux", title: "The Messenger", color: "#FF3B00", line: "\"Ship it. Now.\"",            sub: "Publish · Share · Deploy"    },
            ].map(({ name, title, color, line, sub }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className={`p-6 ${i < 2 ? "border-b-2 border-[var(--border-color)] sm:border-b-0 sm:border-r-2" : ""}`}
              >
                <div className="h-1.5 w-12 mb-4" style={{ background: color }} />
                <p className="font-display text-xl font-black uppercase tracking-tight">{name}</p>
                <p className="font-mono text-xs text-[var(--text-muted)] mt-0.5">{title}</p>
                <p className="mt-4 font-display text-sm font-bold italic text-[var(--text-primary)]">{line}</p>
                <p className="mt-3 font-mono text-xs text-[var(--text-muted)] border-t border-[var(--border-muted)] pt-3">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═════════════════════════════════════════════════ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-content">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="border-4 border-[var(--border-color)] bg-[var(--color-accent)] p-12 shadow-brut-xl text-center"
          >
            <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Ready to build?
            </h2>
            <p className="mt-3 text-sm text-white/80">
              Free to start. No credit card. No expiry.
            </p>
            <Reactive reaction={REACTIONS.cta} className="inline-block mt-8">
              <SignUpButton mode="redirect" fallbackRedirectUrl="/dashboard">
                <Button variant="secondary" size="lg" className="gap-2 shadow-brut-md">
                  Create Your First Form
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SignUpButton>
            </Reactive>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
