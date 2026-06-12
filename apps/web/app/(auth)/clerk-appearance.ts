import type { ClerkAppearanceTheme } from "@clerk/nextjs/types";
import { dark, neobrutalism } from "@clerk/ui/themes";

const BASE = {
  variables: {
    borderRadius:           "0px",
    colorPrimary:           "#FF3B00",
    colorDanger:            "#D50000",
    fontFamily:             "inherit",
    fontSize:               "14px",
    colorPrimaryForeground: "#ffffff",
  },
  elements: {
    rootBox: "!w-full",
    cardBox: "!w-full",
    footerActionLink: "!text-[#FF3B00]",
  },
} satisfies Partial<ClerkAppearanceTheme>;

export const clerkAppearanceDark: ClerkAppearanceTheme = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: [dark, neobrutalism] as any,
  variables: {
    ...BASE.variables,
    colorBackground:      "#141414",
    colorForeground:      "#F5F0E8",
    colorMutedForeground: "#888480",
    colorNeutral:         "#F5F0E8",
    colorInput:           "#1E1E1E",
    colorInputForeground: "#F5F0E8",
  },
  elements: {
    ...BASE.elements,
    headerTitle:                  "!text-white",
    headerSubtitle:               "!text-white/70",
    socialButtonsBlockButton:     "!text-white",
    socialButtonsBlockButtonText: "!text-white",
    dividerText:                  "!text-white/50",
    formFieldLabel:               "!text-white",
    formFieldHintText:            "!text-white/60",
    formFieldInput:               "!text-white placeholder:!text-white/40",
    identityPreviewText:          "!text-white",
    identityPreviewEditButton:    "!text-white/70",
    footer:                       "!bg-[#141414]",
    footerActionText:             "!text-white/60",
    footerActionLink:             "!text-[#FF3B00]",
    footerPages:                  "!text-white/60 [&_*]:!text-white/60",
    footerPagesLink:              "!text-white/60",
  },
};

export const clerkAppearanceLight: ClerkAppearanceTheme = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: neobrutalism as any,
  variables: {
    ...BASE.variables,
    colorBackground:      "#FFFFFF",
    colorForeground:      "#0A0A0A",
    colorMutedForeground: "#6B6B6B",
    colorNeutral:         "#0A0A0A",
    colorInput:           "#EDE8DF",
    colorInputForeground: "#0A0A0A",
  },
  elements: {
    ...BASE.elements,
  },
};

// Default export used as SSR fallback (client hydrates to correct theme)
export const clerkAppearance = clerkAppearanceDark;
