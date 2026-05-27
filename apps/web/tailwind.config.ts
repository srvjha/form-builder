import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "var(--font-inter)", "sans-serif"],
        mono:    ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card:        { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover:     { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary:     { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary:   { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted:       { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent:      { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border:   "hsl(var(--border))",
        input:    "hsl(var(--input))",
        ring:     "hsl(var(--ring))",
        brut: {
          black:  "#0A0A0A",
          white:  "#F5F0E8",
          accent: "#FF3B00",
          yellow: "#FFD600",
          green:  "#00C853",
          red:    "#D50000",
        },
      },
      borderRadius: {
        none: "0px",
        sm:   "2px",
        DEFAULT: "var(--radius)",
        md:   "var(--radius)",
        lg:   "var(--radius)",
        xl:   "var(--radius)",
      },
      boxShadow: {
        "brut-xs":     "var(--shadow-xs)",
        "brut-sm":     "var(--shadow-sm)",
        "brut-md":     "var(--shadow-md)",
        "brut-lg":     "var(--shadow-lg)",
        "brut-xl":     "var(--shadow-xl)",
        "brut-accent": "var(--shadow-accent)",
        "brut-yellow": "var(--shadow-yellow)",
        none: "none",
      },
      borderWidth: {
        DEFAULT: "2px",
        "0": "0", "1": "1px", "2": "2px", "3": "3px", "4": "4px",
      },
      fontSize: {
        "2xs": ["11px", { lineHeight: "1.4" }],
        xs:    ["13px", { lineHeight: "1.4" }],
        sm:    ["14px", { lineHeight: "1.5" }],
        base:  ["15px", { lineHeight: "1.5" }],
        md:    ["17px", { lineHeight: "1.5" }],
        lg:    ["20px", { lineHeight: "1.4" }],
        xl:    ["24px", { lineHeight: "1.3" }],
        "2xl": ["30px", { lineHeight: "1.2" }],
        "3xl": ["38px", { lineHeight: "1.1" }],
        "4xl": ["48px", { lineHeight: "1.05" }],
        "5xl": ["64px", { lineHeight: "1" }],
        "6xl": ["80px", { lineHeight: "0.95" }],
      },
      letterSpacing: {
        tighter: "-0.03em",
        tight:   "-0.02em",
        normal:  "0em",
        wide:    "0.04em",
        wider:   "0.08em",
        widest:  "0.12em",
      },
      maxWidth: {
        narrow:  "760px",
        content: "1200px",
        wide:    "1440px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
