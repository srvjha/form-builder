import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const getPath = generatePath("/themes");

// ── Built-in theme presets ────────────────────────────────────────────────────
// These live as code so they work before any DB seed is run.
// Down the road the ThemeService can merge DB-persisted themes on top.
export const BUILTIN_THEMES = [
  {
    id: "brutalist",
    slug: "brutalist",
    name: "Brutalist",
    description: "Bold offset shadows, thick black borders. Raw & unapologetic.",
    category: "featured",
    isDefault: true,
    badge: "Default",
    colors: {
      primary:    "#FF3B00",
      background: "#F5F0E8",
      surface:    "#FFFFFF",
      text:       "#0A0A0A",
      textMuted:  "#6B6B6B",
      accent:     "#FF3B00",
      border:     "#0A0A0A",
      error:      "#D50000",
    },
    fonts: { heading: "Syne", body: "Inter", mono: "JetBrains Mono" },
    style: "brutalist",
  },
  {
    id: "ocean",
    slug: "ocean",
    name: "Ocean",
    description: "Cool blues and crisp whites. Trustworthy & professional.",
    category: "minimal",
    isDefault: false,
    badge: null,
    colors: {
      primary:    "#0EA5E9",
      background: "#F0F9FF",
      surface:    "#FFFFFF",
      text:       "#0C4A6E",
      textMuted:  "#64748B",
      accent:     "#0EA5E9",
      border:     "#BAE6FD",
      error:      "#EF4444",
    },
    fonts: { heading: "Inter", body: "Inter", mono: "Fira Code" },
    style: "minimal",
  },
  {
    id: "midnight",
    slug: "midnight",
    name: "Midnight",
    description: "Deep dark surfaces with electric indigo accents.",
    category: "dark",
    isDefault: false,
    badge: "Dark",
    colors: {
      primary:    "#818CF8",
      background: "#0F0F1A",
      surface:    "#1A1A2E",
      text:       "#E2E8F0",
      textMuted:  "#94A3B8",
      accent:     "#818CF8",
      border:     "#312E81",
      error:      "#F87171",
    },
    fonts: { heading: "Syne", body: "Inter", mono: "JetBrains Mono" },
    style: "modern",
  },
  {
    id: "forest",
    slug: "forest",
    name: "Forest",
    description: "Earthy greens and natural tones. Calm & grounded.",
    category: "nature",
    isDefault: false,
    badge: null,
    colors: {
      primary:    "#16A34A",
      background: "#F0FDF4",
      surface:    "#FFFFFF",
      text:       "#14532D",
      textMuted:  "#4B7C5E",
      accent:     "#16A34A",
      border:     "#86EFAC",
      error:      "#EF4444",
    },
    fonts: { heading: "Inter", body: "Inter", mono: "Fira Code" },
    style: "minimal",
  },
  {
    id: "solar",
    slug: "solar",
    name: "Solar",
    description: "Warm amber and golden tones. Energetic & optimistic.",
    category: "warm",
    isDefault: false,
    badge: null,
    colors: {
      primary:    "#D97706",
      background: "#FFFBEB",
      surface:    "#FFFFFF",
      text:       "#78350F",
      textMuted:  "#92400E",
      accent:     "#F59E0B",
      border:     "#FDE68A",
      error:      "#EF4444",
    },
    fonts: { heading: "Inter", body: "Inter", mono: "Fira Code" },
    style: "minimal",
  },
  {
    id: "lavender",
    slug: "lavender",
    name: "Lavender",
    description: "Soft purples and violets. Creative & expressive.",
    category: "soft",
    isDefault: false,
    badge: null,
    colors: {
      primary:    "#7C3AED",
      background: "#FAF5FF",
      surface:    "#FFFFFF",
      text:       "#2E1065",
      textMuted:  "#7E22CE",
      accent:     "#8B5CF6",
      border:     "#DDD6FE",
      error:      "#EF4444",
    },
    fonts: { heading: "Inter", body: "Inter", mono: "Fira Code" },
    style: "minimal",
  },
  {
    id: "monochrome",
    slug: "monochrome",
    name: "Monochrome",
    description: "Pure black and white. Timeless & editorial.",
    category: "minimal",
    isDefault: false,
    badge: "Minimal",
    colors: {
      primary:    "#171717",
      background: "#FAFAFA",
      surface:    "#FFFFFF",
      text:       "#171717",
      textMuted:  "#737373",
      accent:     "#262626",
      border:     "#D4D4D4",
      error:      "#DC2626",
    },
    fonts: { heading: "Inter", body: "Inter", mono: "Fira Code" },
    style: "minimal",
  },
  {
    id: "coral",
    slug: "coral",
    name: "Coral",
    description: "Warm coral and rose tones. Vibrant & friendly.",
    category: "warm",
    isDefault: false,
    badge: null,
    colors: {
      primary:    "#F43F5E",
      background: "#FFF1F2",
      surface:    "#FFFFFF",
      text:       "#881337",
      textMuted:  "#BE123C",
      accent:     "#FB7185",
      border:     "#FECDD3",
      error:      "#DC2626",
    },
    fonts: { heading: "Inter", body: "Inter", mono: "Fira Code" },
    style: "minimal",
  },
] as const;

export type BuiltinTheme = (typeof BUILTIN_THEMES)[number];

// ── Router ────────────────────────────────────────────────────────────────────
export const themesRouter = router({
  list: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/"),
        tags: ["themes"],
        summary: "List all available themes",
      },
    })
    .input(z.undefined())
    .output(z.any())
    .query(() => {
      return BUILTIN_THEMES;
    }),

  get: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/{slug}"),
        tags: ["themes"],
        summary: "Get a theme by slug",
      },
    })
    .input(z.object({ slug: z.string() }))
    .output(z.any())
    .query(({ input }) => {
      const theme = BUILTIN_THEMES.find((t) => t.slug === input.slug);
      if (!theme) throw new Error("Theme not found");
      return theme;
    }),
});
