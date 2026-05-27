"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } }),
};

/* ─── Design token display ─────────────────────────────────────── */
const TOKENS = [
  { name: "--color-accent",  value: "#FF3B00", label: "Accent Red",    hex: "#FF3B00" },
  { name: "--color-yellow",  value: "#FFD600", label: "Signal Yellow", hex: "#FFD600" },
  { name: "--color-green",   value: "#00C853", label: "Active Green",  hex: "#00C853" },
  { name: "--bg-page",       value: "#F5F0E8", label: "Warm White",    hex: "#F5F0E8" },
  { name: "--color-black",   value: "#0A0A0A", label: "Near Black",    hex: "#0A0A0A" },
];

/* ─── Principles ───────────────────────────────────────────────── */
const PRINCIPLES = [
  {
    num: "01",
    title: "Honest Materials",
    body: "No gradients. No glass morphism. No blur. What you see is exactly what it is — borders are borders, boxes are boxes. Brutalist architecture exposed raw concrete; we expose raw UI.",
  },
  {
    num: "02",
    title: "Zero Rounded Corners",
    body: "Every corner in the product is 0px radius. It's a constraint, not a mistake. Constraint forces precision. When everything can be any shape, nothing means anything.",
  },
  {
    num: "03",
    title: "Offset Shadows Only",
    body: "Shadows in this product have zero blur — 4px right, 4px down, nothing else. Inspired by how physical objects cast shadows in direct light. Functional. Measurable.",
  },
  {
    num: "04",
    title: "Typography as Structure",
    body: "Headlines are load-bearing walls. Syne Black at 700–800 weight, uppercase, tight tracking. Type isn't decoration — it IS the architecture.",
  },
  {
    num: "05",
    title: "Colour with Purpose",
    body: "Red means action. Yellow means caution or highlight. Green means success. No colours for aesthetics alone. Every colour in the palette has a job.",
  },
  {
    num: "06",
    title: "No Apologies",
    body: "Brutalism is confident. This product is confident. It does one thing — builds and deploys forms — and it does it without hedging, softening, or over-explaining.",
  },
];

/* ─── Famous brutalist buildings ───────────────────────────────── */
const BUILDINGS = [
  {
    name:      "Barbican Centre",
    location:  "London, UK — 1969",
    architect: "Chamberlin, Powell and Bon",
    note:      "The largest example of brutalist architecture in Europe. Raw concrete towers over a lake and gardens.",
    color:     "#FFD600",
  },
  {
    name:      "Trellick Tower",
    location:  "London, UK — 1972",
    architect: "Ernő Goldfinger",
    note:      "Once called the 'Tower of Terror'. Now a listed building and one of the most sought-after addresses in West London.",
    color:     "#FF3B00",
  },
  {
    name:      "Habitat 67",
    location:  "Montréal, Canada — 1967",
    architect: "Moshe Safdie",
    note:      "A housing complex designed for Expo 67. 354 prefabricated concrete forms stacked like building blocks.",
    color:     "#00C853",
  },
  {
    name:      "Boston City Hall",
    location:  "Boston, USA — 1968",
    architect: "Kallmann McKinnell & Knowles",
    note:      "Voted 'ugliest building in the world' in polls and 'architectural masterpiece' by critics. The most divisive building in America.",
    color:     "#F5F0E8",
  },
];

/* ─── Further reading ──────────────────────────────────────────── */
const ARTICLES = [
  {
    title:   "Brutalist Architecture — Wikipedia",
    url:     "https://en.wikipedia.org/wiki/Brutalist_architecture",
    source:  "Wikipedia",
    excerpt: "The definitive overview. History, key characteristics, major works, and the ongoing critical debate.",
  },
  {
    title:   "Why Brutalism Is Back — Dezeen",
    url:     "https://www.dezeen.com/2022/09/07/brutalism-architecture-comeback/",
    source:  "Dezeen",
    excerpt: "How the most hated architectural style of the 20th century became one of the most celebrated of the 21st.",
  },
  {
    title:   "The Web Design Brutalism Manifesto",
    url:     "https://brutalistwebsites.com/",
    source:  "brutalistwebsites.com",
    excerpt: "A living gallery of brutalist web design. Everything from raw HTML to high-production anti-aesthetic sites.",
  },
  {
    title:   "A Guide to Brutalism in Architecture — Archdaily",
    url:     "https://www.archdaily.com/tag/brutalism",
    source:  "ArchDaily",
    excerpt: "Deep dives on individual brutalist buildings, architects, and the cultural contexts that produced them.",
  },
  {
    title:   "Designing in the Brutal Style — Smashing Magazine",
    url:     "https://www.smashingmagazine.com/2020/01/brutalist-web-design/",
    source:  "Smashing Magazine",
    excerpt: "A practical look at how brutalist principles apply to UI design — including when they work and when they don't.",
  },
  {
    title:   "Brutalism: An Architecture of Intimidation? — Guardian",
    url:     "https://www.theguardian.com/artanddesign/architecture",
    source:  "The Guardian",
    excerpt: "The cultural politics of concrete. Why brutalist buildings became symbols of both utopian ambition and state failure.",
  },
];

/* ─── Page ─────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="bg-[var(--bg-page)] bg-dot-grid">

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b-2 border-[#0A0A0A] px-6 py-24 md:py-32">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 select-none text-center font-display text-[14vw] font-black uppercase leading-none tracking-tighter text-[#0A0A0A] opacity-[0.04]"
        >
          BRUTALISM
        </span>
        <div className="relative mx-auto max-w-content">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="label-overline mb-4"
          >
            About the theme
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }}
            className="font-display text-5xl font-black uppercase leading-tight tracking-tighter md:text-7xl"
          >
            RAW. HONEST.
            <br />
            <span className="text-[var(--color-accent)]">UNAPOLOGETIC.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.4 }}
            className="mt-6 max-w-2xl text-lg text-[var(--text-muted)] leading-relaxed"
          >
            FormCraft is built on brutalist design principles — a philosophy born in post-war
            architecture that values honesty of materials over decoration, function over
            ornament, and structure over style. This page explains where it came from,
            why we chose it, and how every pixel in this product embodies it.
          </motion.p>
        </div>
      </section>

      {/* ═══ What is Brutalism ══════════════════════════════════ */}
      <section className="border-b-2 border-[#0A0A0A] px-6 py-20">
        <div className="mx-auto max-w-content">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="label-overline mb-4">The origin</p>
              <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                What is Brutalism?
              </h2>
              <div className="mt-6 space-y-4 text-[var(--text-muted)] leading-relaxed">
                <p>
                  Brutalism emerged in the 1950s as a reaction against the ornamental excess of
                  pre-war architecture. The name comes from the French <em>béton brut</em> — raw
                  concrete — coined by Le Corbusier. But it became something larger: a philosophy
                  that said a building should reveal its own construction rather than conceal it.
                </p>
                <p>
                  Brutalist buildings are defined by their raw materials (usually concrete),
                  heavy geometric forms, repetitive angular structures, and a total absence of
                  decorative elements. They don&apos;t apologise for being what they are.
                </p>
                <p>
                  From the 1960s to the 1980s, brutalism shaped cities across Europe, North America,
                  and the Soviet Union. Housing estates, civic centres, universities, car parks —
                  all stripped back to structural honesty.
                </p>
                <p>
                  It fell out of favour in the 1980s, associated with failed utopian housing
                  projects. But since the 2000s, there&apos;s been a quiet rehabilitation — a
                  recognition that what was dismissed as ugly was actually bold, original, and
                  uncompromising in a way that most architecture never dares to be.
                </p>
              </div>
            </div>

            {/* Quote block */}
            <div className="flex flex-col gap-8">
              {[
                {
                  quote: "The building should reveal its own structure — the way it is put together, what it is made of.",
                  author: "Paul Rudolph, brutalist architect",
                },
                {
                  quote: "Ornament is crime.",
                  author: "Adolf Loos, 1908",
                  note: "Pre-brutalism — but the DNA of the movement",
                },
              ].map(({ quote, author, note }) => (
                <div
                  key={author}
                  className="border-l-4 border-[var(--color-accent)] bg-[var(--bg-panel)] p-6 shadow-brut-md"
                  style={{ borderLeft: "6px solid #FF3B00" }}
                >
                  <blockquote className="font-display text-xl font-bold uppercase leading-tight tracking-tight">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                  <cite className="mt-3 block font-mono text-xs text-[var(--text-muted)] not-italic">
                    — {author}
                  </cite>
                  {note && (
                    <p className="mt-1 font-mono text-xs text-[var(--border-color)] opacity-60">{note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Iconic buildings ═══════════════════════════════════ */}
      <section className="border-b-2 border-[#0A0A0A] bg-[#0A0A0A] px-6 py-20 text-white">
        <div className="mx-auto max-w-content">
          <p className="label-overline mb-4 text-[#555]">Architecture</p>
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl mb-12">
            The buildings that defined it.
          </h2>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {BUILDINGS.map(({ name, location, architect, note, color }, i) => (
              <motion.div
                key={name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="border-2 border-[#2A2A2A] p-6 sm:border-r-0 sm:last:border-r-2"
              >
                <div className="h-2 w-full mb-4" style={{ background: color }} />
                <h3 className="font-display text-base font-extrabold uppercase tracking-tight">{name}</h3>
                <p className="mt-1 font-mono text-xs text-[#555]">{location}</p>
                <p className="mt-0.5 font-mono text-xs text-[#444]">{architect}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#888]">{note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Our design principles ══════════════════════════════ */}
      <section className="border-b-2 border-[#0A0A0A] px-6 py-20">
        <div className="mx-auto max-w-content">
          <p className="label-overline mb-4">Design principles</p>
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl mb-12">
            How we applied it.
          </h2>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map(({ num, title, body }, i) => (
              <motion.div
                key={num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="border-2 border-[#0A0A0A] border-r-0 border-b-0 last:border-r-2 [&:nth-child(2)]:sm:border-r-0 [&:nth-child(3)]:sm:border-r-2 [&:nth-child(3)]:lg:border-r-0 p-8"
              >
                <span className="font-display text-5xl font-black leading-none text-[var(--bg-inset)]">{num}</span>
                <h3 className="mt-4 font-display text-base font-extrabold uppercase tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{body}</p>
              </motion.div>
            ))}
          </div>
          {/* last row border fix */}
          <div className="border-b-2 border-l-2 border-r-2 border-[#0A0A0A] h-[2px]" />
        </div>
      </section>

      {/* ═══ Design tokens ══════════════════════════════════════ */}
      <section className="border-b-2 border-[#0A0A0A] px-6 py-20">
        <div className="mx-auto max-w-content">
          <p className="label-overline mb-4">Colour system</p>
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl mb-10">
            Five colours. Each has a job.
          </h2>
          <div className="flex flex-wrap gap-0 border-2 border-[#0A0A0A]">
            {TOKENS.map(({ name, label, hex }, i) => (
              <div
                key={name}
                className="flex-1 min-w-[120px] border-r-2 border-[#0A0A0A] last:border-r-0"
              >
                <div className="h-24 w-full border-b-2 border-[#0A0A0A]" style={{ background: hex }} />
                <div className="p-4">
                  <p className="font-display text-xs font-extrabold uppercase tracking-wider">{label}</p>
                  <p className="font-mono text-xs text-[var(--text-muted)] mt-1">{hex}</p>
                  <p className="font-mono text-[10px] text-[var(--text-muted)] opacity-60 mt-0.5">{name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Why we chose brutalism ═════════════════════════════ */}
      <section className="border-b-2 border-[#0A0A0A] px-6 py-20">
        <div className="mx-auto max-w-content max-w-3xl">
          <p className="label-overline mb-4">The manifesto</p>
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl mb-8">
            Why a form builder needed this.
          </h2>
          <div className="space-y-6 text-[var(--text-muted)] leading-relaxed text-base">
            <p>
              Most SaaS products look the same. Rounded corners. Soft shadows. Gradient buttons.
              Purple-to-pink everything. It&apos;s a uniform that says <em>we are safe, we are friendly,
              we will not challenge you</em>. And that&apos;s fine. For most products, it works.
            </p>
            <p>
              But a form builder isn&apos;t most products. A form builder is infrastructure.
              It&apos;s the thing you trust to collect data from real people about real things.
              It should feel like it was built by engineers, not focus-grouped into existence
              by a committee of brand consultants.
            </p>
            <p>
              Brutalism gives us permission to be direct. The border is a border.
              The button is a button. The shadow tells you exactly how far off the surface
              the element is. There is no mystery, no ornamentation, no fluff.
              What you see is exactly what the product does.
            </p>
            <p>
              That&apos;s the form builder that doesn&apos;t apologise. Not apologising for
              being opinionated about design. Not apologising for sharp corners.
              Not apologising for expecting users to be adults who can read a form
              without being coddled through it.
            </p>
          </div>
          <div
            className="mt-10 border-4 border-[#0A0A0A] bg-[var(--color-accent)] p-8 shadow-brut-xl"
          >
            <p className="font-display text-2xl font-black uppercase tracking-tight text-white leading-tight">
              &ldquo;The form builder that doesn&apos;t apologise.&rdquo;
            </p>
            <p className="mt-3 font-mono text-xs text-white/70">— FormCraft, every day</p>
          </div>
        </div>
      </section>

      {/* ═══ Further reading ════════════════════════════════════ */}
      <section className="border-b-2 border-[#0A0A0A] px-6 py-20">
        <div className="mx-auto max-w-content">
          <p className="label-overline mb-4">Further reading</p>
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl mb-10">
            Go deeper.
          </h2>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 border-2 border-[#0A0A0A]">
            {ARTICLES.map(({ title, url, source, excerpt }, i) => (
              <motion.a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="group block border-b-2 border-r-0 border-[#0A0A0A] p-6 transition-colors hover:bg-[var(--bg-inset)] sm:border-r-2 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r-2 lg:[&:nth-child(3n)]:border-r-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] border-2 border-[var(--color-accent)] px-2 py-0.5">
                    {source}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="mt-4 font-display text-sm font-extrabold uppercase tracking-tight leading-tight">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{excerpt}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Nav links ══════════════════════════════════════════ */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-content flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-black uppercase tracking-tight">
              Want to meet the crew?
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Three characters. Three roles. One product universe.
            </p>
          </div>
          <Link
            href={ROUTES.characters}
            className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#0A0A0A] px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-white shadow-brut-md transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brut-xs"
          >
            Meet the Crew <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
