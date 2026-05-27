"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Palette, Sparkles, Star } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { cn } from "@/lib/utils";
import { useMascotStore } from "@/stores/mascot-store";

// ── Theme definitions ──────────────────────────────────────────────────────────
const THEMES = [
  {
    id: "brutalist",
    name: "Brutalist",
    description: "Bold offset shadows, thick black borders. Raw & unapologetic.",
    badge: "Default",
    badgeVariant: "published" as const,
    colors: {
      bg:     "#F5F0E8",
      panel:  "#FFFFFF",
      accent: "#FF3B00",
      text:   "#0A0A0A",
      muted:  "#6B6B6B",
      border: "#0A0A0A",
    },
    shadowStyle: "3px 3px 0 #0A0A0A",
    borderRadius: "0px",
    borderWidth: "2px",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool blues and crisp whites. Trustworthy & professional.",
    badge: null,
    badgeVariant: "default" as const,
    colors: {
      bg:     "#F0F9FF",
      panel:  "#FFFFFF",
      accent: "#0EA5E9",
      text:   "#0C4A6E",
      muted:  "#64748B",
      border: "#BAE6FD",
    },
    shadowStyle: "0 2px 12px rgba(14,165,233,0.15)",
    borderRadius: "8px",
    borderWidth: "1px",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep dark surfaces with electric indigo accents.",
    badge: "Dark",
    badgeVariant: "draft" as const,
    colors: {
      bg:     "#0F0F1A",
      panel:  "#1A1A2E",
      accent: "#818CF8",
      text:   "#E2E8F0",
      muted:  "#94A3B8",
      border: "#312E81",
    },
    shadowStyle: "0 4px 20px rgba(129,140,248,0.2)",
    borderRadius: "6px",
    borderWidth: "1px",
  },
  {
    id: "forest",
    name: "Forest",
    description: "Earthy greens and natural tones. Calm & grounded.",
    badge: null,
    badgeVariant: "default" as const,
    colors: {
      bg:     "#F0FDF4",
      panel:  "#FFFFFF",
      accent: "#16A34A",
      text:   "#14532D",
      muted:  "#4B7C5E",
      border: "#86EFAC",
    },
    shadowStyle: "0 2px 12px rgba(22,163,74,0.12)",
    borderRadius: "8px",
    borderWidth: "1px",
  },
  {
    id: "solar",
    name: "Solar",
    description: "Warm amber and golden tones. Energetic & optimistic.",
    badge: null,
    badgeVariant: "default" as const,
    colors: {
      bg:     "#FFFBEB",
      panel:  "#FFFFFF",
      accent: "#D97706",
      text:   "#78350F",
      muted:  "#92400E",
      border: "#FDE68A",
    },
    shadowStyle: "0 2px 12px rgba(217,119,6,0.15)",
    borderRadius: "8px",
    borderWidth: "1px",
  },
  {
    id: "lavender",
    name: "Lavender",
    description: "Soft purples and violets. Creative & expressive.",
    badge: null,
    badgeVariant: "default" as const,
    colors: {
      bg:     "#FAF5FF",
      panel:  "#FFFFFF",
      accent: "#7C3AED",
      text:   "#2E1065",
      muted:  "#7E22CE",
      border: "#DDD6FE",
    },
    shadowStyle: "0 2px 12px rgba(124,58,237,0.12)",
    borderRadius: "8px",
    borderWidth: "1px",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    description: "Pure black and white. Timeless & editorial.",
    badge: "Minimal",
    badgeVariant: "archived" as const,
    colors: {
      bg:     "#FAFAFA",
      panel:  "#FFFFFF",
      accent: "#171717",
      text:   "#171717",
      muted:  "#737373",
      border: "#D4D4D4",
    },
    shadowStyle: "0 1px 4px rgba(0,0,0,0.1)",
    borderRadius: "4px",
    borderWidth: "1px",
  },
  {
    id: "coral",
    name: "Coral",
    description: "Warm coral and rose tones. Vibrant & friendly.",
    badge: null,
    badgeVariant: "default" as const,
    colors: {
      bg:     "#FFF1F2",
      panel:  "#FFFFFF",
      accent: "#F43F5E",
      text:   "#881337",
      muted:  "#BE123C",
      border: "#FECDD3",
    },
    shadowStyle: "0 2px 12px rgba(244,63,94,0.12)",
    borderRadius: "8px",
    borderWidth: "1px",
  },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

// ── Mini form preview ──────────────────────────────────────────────────────────
function ThemePreview({ theme }: { theme: (typeof THEMES)[number] }) {
  const { colors, shadowStyle, borderRadius, borderWidth } = theme;

  return (
    <div
      className="h-52 overflow-hidden p-3"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Form card */}
      <div
        className="h-full overflow-hidden p-3"
        style={{
          backgroundColor: colors.panel,
          border:           `${borderWidth} solid ${colors.border}`,
          borderRadius,
          boxShadow:        shadowStyle,
        }}
      >
        {/* Form title */}
        <div
          className="mb-2 h-2.5 w-2/3 rounded-sm"
          style={{ backgroundColor: colors.text, borderRadius: "2px" }}
        />
        <div
          className="mb-4 h-1.5 w-1/2 rounded-sm"
          style={{ backgroundColor: colors.muted, borderRadius: "2px", opacity: 0.6 }}
        />

        {/* Field label */}
        <div
          className="mb-1.5 h-1.5 w-1/3"
          style={{ backgroundColor: colors.muted, borderRadius: "2px" }}
        />
        {/* Input */}
        <div
          className="mb-3 h-7"
          style={{
            backgroundColor: colors.bg,
            border:           `${borderWidth} solid ${colors.border}`,
            borderRadius,
          }}
        />

        {/* Second label */}
        <div
          className="mb-1.5 h-1.5 w-2/5"
          style={{ backgroundColor: colors.muted, borderRadius: "2px" }}
        />
        {/* Textarea placeholder */}
        <div
          className="mb-4 h-10"
          style={{
            backgroundColor: colors.bg,
            border:           `${borderWidth} solid ${colors.border}`,
            borderRadius,
          }}
        />

        {/* Submit button */}
        <div
          className="flex h-7 items-center justify-center"
          style={{
            backgroundColor: colors.accent,
            borderRadius,
          }}
        >
          <div className="h-1.5 w-1/4 rounded-sm bg-white opacity-90" />
        </div>
      </div>
    </div>
  );
}

// ── Category filter ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",      label: "All themes" },
  { id: "light",    label: "Light" },
  { id: "dark",     label: "Dark" },
  { id: "featured", label: "Featured" },
];

const CATEGORY_MAP: Record<ThemeId, string[]> = {
  brutalist:  ["featured", "light"],
  ocean:      ["light"],
  midnight:   ["dark"],
  forest:     ["light"],
  solar:      ["light"],
  lavender:   ["light"],
  monochrome: ["light"],
  coral:      ["light"],
};

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ThemesPage() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>("brutalist");
  const [category,    setCategory]    = useState("all");
  const [applied,     setApplied]     = useState<ThemeId | null>(null);
  const { setState: setBrix, reset: resetBrix } = useMascotStore();

  /* Set a themes-specific mascot message on mount, clear on leave */
  useEffect(() => {
    setBrix("waving", "Pick a theme. Own your aesthetic.", true);
    return () => resetBrix();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = THEMES.filter((t) =>
    category === "all" || CATEGORY_MAP[t.id]?.includes(category),
  );

  function handleApply(id: ThemeId) {
    setApplied(id);
    setActiveTheme(id);
    // Persist to localStorage so other parts of the app can read it
    if (typeof window !== "undefined") {
      localStorage.setItem("formcraft:defaultTheme", id);
    }
    setTimeout(() => setApplied(null), 2000);
  }

  return (
    <AppShell title="Themes">
      <div className="mx-auto max-w-7xl">
        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[#0A0A0A] bg-[var(--color-accent)] shadow-brut-md">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-black uppercase tracking-tight">
                Form Themes
              </h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Choose a visual style for your forms. The selected theme applies to
                all new forms by default.
              </p>
            </div>
          </div>

          {/* Active theme pill */}
          <div className="mt-5 inline-flex items-center gap-2 border-2 border-[var(--border-muted)] bg-[var(--bg-panel)] px-4 py-2 shadow-brut-xs">
            <span className="label-overline text-[var(--text-muted)]">Active:</span>
            <span
              className="inline-block h-3 w-3 border border-black/20"
              style={{ backgroundColor: THEMES.find((t) => t.id === activeTheme)?.colors.accent }}
            />
            <span className="font-display text-sm font-extrabold uppercase tracking-wide">
              {THEMES.find((t) => t.id === activeTheme)?.name}
            </span>
          </div>
        </motion.div>

        {/* ── Category filter ─────────────────────────────────────── */}
        <div className="mb-6 flex gap-0 border-2 border-[#0A0A0A] w-fit">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                "px-5 py-2 font-display text-xs font-extrabold uppercase tracking-wider transition-colors",
                i < CATEGORIES.length - 1 && "border-r-2 border-[#0A0A0A]",
                category === cat.id
                  ? "bg-[#0A0A0A] text-white"
                  : "bg-[var(--bg-panel)] hover:bg-[var(--bg-inset)] text-[var(--text-muted)]",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Theme grid ─────────────────────────────────────────── */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-2 border-[#0A0A0A]"
        >
          {filtered.map((theme, idx) => {
            const isActive = activeTheme === theme.id;
            const isApplied = applied === theme.id;
            const col = idx % (typeof window !== "undefined" && window.innerWidth >= 1280 ? 4 : 3);

            return (
              <motion.div
                key={theme.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                onClick={() => setActiveTheme(theme.id)}
                className={cn(
                  "group relative flex cursor-pointer flex-col overflow-hidden",
                  "border-r-2 border-b-2 border-[#0A0A0A] transition-all",
                  "last:border-r-0",
                  isActive && "ring-inset ring-2 ring-[var(--color-accent)]",
                )}
                style={{
                  borderRight: (idx + 1) % 4 === 0 ? "none" : undefined,
                }}
              >
                {/* Active check */}
                {isActive && (
                  <div className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center bg-[var(--color-accent)] border-2 border-[#0A0A0A]">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}

                {/* Badge */}
                {theme.badge && (
                  <div className="absolute left-3 top-3 z-10">
                    <span
                      className="px-2 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-wider border border-[#0A0A0A]"
                      style={{
                        backgroundColor: theme.colors.accent,
                        color:           theme.id === "monochrome" ? "#fff" : "#fff",
                      }}
                    >
                      {theme.badge}
                    </span>
                  </div>
                )}

                {/* Preview */}
                <ThemePreview theme={theme} />

                {/* Info */}
                <div className="flex flex-1 flex-col border-t-2 border-[#0A0A0A] bg-[var(--bg-panel)] p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-extrabold uppercase tracking-wide">
                      {theme.name}
                    </h3>
                    {isActive && (
                      <span className="label-overline text-[var(--color-accent)]">Active</span>
                    )}
                  </div>
                  <p className="mt-1.5 flex-1 text-sm text-[var(--text-muted)] leading-relaxed">
                    {theme.description}
                  </p>

                  {/* Color swatches */}
                  <div className="mt-4 flex gap-2">
                    {[theme.colors.bg, theme.colors.accent, theme.colors.text, theme.colors.border].map(
                      (c, i) => (
                        <span
                          key={i}
                          className="h-5 w-5 border border-black/20 rounded-sm"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ),
                    )}
                  </div>

                  {/* Apply button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(theme.id);
                    }}
                    className={cn(
                      "mt-4 flex h-9 w-full items-center justify-center gap-1.5",
                      "border-2 border-[#0A0A0A] font-display text-xs font-extrabold uppercase tracking-wider",
                      "transition-all active:translate-x-[2px] active:translate-y-[2px]",
                      isActive
                        ? "bg-[var(--bg-inset)] text-[var(--text-muted)] cursor-default"
                        : "bg-[var(--color-accent)] text-white shadow-brut-xs hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
                    )}
                    disabled={isActive}
                  >
                    {isApplied ? (
                      <>
                        <Check className="h-3 w-3" /> Applied!
                      </>
                    ) : isActive ? (
                      "Active theme"
                    ) : (
                      <>
                        <Star className="h-3 w-3" /> Set as default
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Coming soon banner ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="mt-8 flex items-center gap-4 border-2 border-[var(--border-muted)] bg-[var(--bg-panel)] p-5 shadow-brut-xs"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[var(--border-muted)] bg-[var(--color-yellow)]">
            <Sparkles className="h-5 w-5 text-[#0A0A0A]" />
          </div>
          <div>
            <p className="font-display text-sm font-extrabold uppercase tracking-wide">
              Per-form themes coming soon
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Currently themes are applied globally as your default. Per-form theme
              overrides will land in a future update — you'll be able to pick a theme
              per form in the form Settings tab.
            </p>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
