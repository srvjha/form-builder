"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Brix }  from "@/components/mascot/brix";
import { Rex }   from "@/components/mascot/characters/rex";
import { Flux }  from "@/components/mascot/characters/flux";
import { SpeechBubble } from "@/components/mascot/speech-bubble";
import { CREW }  from "@/components/mascot/index";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/constants";
import type { BrixState } from "@/stores/mascot-store";

/* ─── Character component map ─────────────────────────────────── */
const CHAR_COMPONENTS = {
  brix: Brix,
  rex:  Rex,
  flux: Flux,
} as const;

/* ─── Hover quote cycling per character ──────────────────────── */
type CrewId = typeof CREW[number]["id"];

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

/* ─── Single character card ───────────────────────────────────── */
function CrewCard({
  member,
  index,
}: {
  member: typeof CREW[number];
  index: number;
}) {
  const [hovered,     setHovered]     = useState(false);
  const [quoteIdx,    setQuoteIdx]    = useState(0);
  const [charState,   setCharState]   = useState<BrixState>("idle");

  const CharComponent = CHAR_COMPONENTS[member.id as CrewId];

  function onEnter() {
    setHovered(true);
    setCharState("waving");
    // cycle through voice lines
    let idx = 0;
    setQuoteIdx(idx);
    const t = setInterval(() => {
      idx = (idx + 1) % member.voice.length;
      setQuoteIdx(idx);
    }, 2200);
    // store interval id on the element via closure — cleaned up on leave
    (onEnter as any)._interval = t;
  }

  function onLeave() {
    setHovered(false);
    setCharState("idle");
    clearInterval((onEnter as any)._interval);
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      variants={fadeUp}
      className="group relative border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md transition-all duration-100 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brut-xs"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* colour accent strip */}
      <div className="h-2 w-full" style={{ background: member.color }} />

      <div className="flex flex-col items-center p-8 pb-6 gap-4">
        {/* speech bubble */}
        <div className="h-16 flex items-end">
          <AnimatePresence mode="wait">
            {hovered && (
              <SpeechBubble
                key={member.voice[quoteIdx]}
                message={member.voice[quoteIdx] ?? ""}
                tail="bottom"
              />
            )}
          </AnimatePresence>
        </div>

        {/* character */}
        <motion.div
          animate={{ y: hovered ? [0, -8, 0] : 0 }}
          transition={{ duration: 2.4, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
        >
          <CharComponent state={charState} size={160} />
        </motion.div>

        {/* name + title */}
        <div className="mt-2 w-full">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-2xl font-black uppercase tracking-tight">
              {member.name}
            </h2>
            <span
              className="font-mono text-xs font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-[#0A0A0A]"
              style={{ background: member.color }}
            >
              {member.title}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            &ldquo;{member.tagline}&rdquo;
          </p>
        </div>

        {/* description */}
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          {member.description}
        </p>

        {/* appears in */}
        <div className="w-full pt-2 border-t-2 border-[var(--border-muted)]">
          <p className="label-overline mb-2 flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> Appears in
          </p>
          <div className="flex flex-wrap gap-1.5">
            {member.appearsIn.map((place) => (
              <span
                key={place}
                className="font-mono text-xs border-2 border-[var(--border-muted)] px-2 py-0.5 bg-[var(--bg-inset)]"
              >
                {place}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function CharactersPage() {
  return (
    <div className="bg-[var(--bg-page)] bg-dot-grid min-h-screen">

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b-2 border-[#0A0A0A] px-6 py-24">
        {/* watermark */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 select-none text-center font-display text-[16vw] font-black uppercase leading-none tracking-tighter text-[#0A0A0A] opacity-[0.04]"
        >
          CREW
        </span>

        <div className="relative mx-auto max-w-content text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Badge variant="accent" className="mb-6 inline-flex">The FormCraft Universe</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }}
            className="font-display text-6xl font-black uppercase leading-none tracking-tighter md:text-8xl"
          >
            MEET THE
            <br />
            <span className="text-[var(--color-accent)]">CREW.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.4 }}
            className="mx-auto mt-6 max-w-lg text-lg text-[var(--text-muted)]"
          >
            Three characters. One form builder. Each owns a different part of your workflow —
            and they&apos;ll let you know if you&apos;re doing it wrong.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-4 font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest"
          >
            Hover the cards to hear them talk ↓
          </motion.p>
        </div>
      </section>

      {/* ═══ Character cards ════════════════════════════════════ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-content">
          <div className="grid gap-0 border-2 border-[#0A0A0A] sm:grid-cols-3">
            {CREW.map((member, i) => (
              <div key={member.id} className={i < CREW.length - 1 ? "border-b-2 border-[#0A0A0A] sm:border-b-0 sm:border-r-2" : ""}>
                <CrewCard member={member} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How they work together ════════════════════════════ */}
      <section className="border-t-2 border-b-2 border-[#0A0A0A] bg-[#0A0A0A] px-6 py-20 text-white">
        <div className="mx-auto max-w-content">
          <p className="label-overline mb-3 text-[#555]">The workflow</p>
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
            Each one has a job.
            <br />They don&apos;t share.
          </h2>

          <div className="mt-14 grid gap-0 md:grid-cols-3">
            {[
              {
                step: "01", who: "Brix",
                action: "You build the form",
                detail: "Drag fields, set logic, write questions. Brix is there the whole time — helping, commenting, occasionally judging your field names.",
                color: "#FFD600",
              },
              {
                step: "02", who: "Rex",
                action: "Responses arrive",
                detail: "The moment a submission comes in, Rex picks it up. He tracks every answer, calculates trends, and flags the questions nobody is answering.",
                color: "#00C853",
              },
              {
                step: "03", who: "Flux",
                action: "You ship it",
                detail: "When it&apos;s time to publish, Flux throws the paper airplane. Copy the link, share it, embed it — Flux makes sure it reaches people.",
                color: "#FF3B00",
              },
            ].map(({ step, who, action, detail, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.35 }}
                className="border-2 border-[#2A2A2A] p-8 md:border-r-0 md:last:border-r-2"
              >
                <span className="font-display text-6xl font-black leading-none" style={{ color: "#2A2A2A" }}>
                  {step}
                </span>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="font-mono text-xs font-bold uppercase px-2 py-0.5 border-2 border-[#333]"
                    style={{ background: color, color: "#0A0A0A" }}
                  >
                    {who}
                  </span>
                  <h3 className="font-display text-lg font-extrabold uppercase tracking-tight">{action}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#888]">{detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ════════════════════════════════════════════════ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-content flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl font-black uppercase tracking-tight">
            The crew is ready.
            <br />Are you?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ROUTES.home}
              className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[var(--color-accent)] px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-white shadow-brut-md transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brut-xs"
            >
              Start Building <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ROUTES.about}
              className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[var(--bg-panel)] px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider shadow-brut-md transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brut-xs"
            >
              Read the Manifesto
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
