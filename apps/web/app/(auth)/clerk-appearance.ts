import type { ClerkAppearanceTheme } from "@clerk/nextjs/types";
import { dark } from "@clerk/ui/themes";

const BASE = {
  variables: {
    borderRadius:           "0.5rem",
    colorPrimary:           "#2563EB",
    colorDanger:            "#EF4444",
    fontFamily:             "inherit",
    fontSize:               "14px",
    colorPrimaryForeground: "#ffffff",
  },
  elements: {
    rootBox: "!w-full",
    cardBox: "!w-full",
    card: "!shadow-[0_1px_3px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)] !rounded-xl",
    footerActionLink: "!text-[#2563EB]",
  },
} satisfies Partial<ClerkAppearanceTheme>;

export const clerkAppearanceDark: ClerkAppearanceTheme = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: dark as any,
  variables: {
    ...BASE.variables,
    colorPrimary:         "#60A5FA",
    colorBackground:      "#12151F",
    colorForeground:      "#E6E9F2",
    colorMutedForeground: "#8B93A7",
    colorNeutral:         "#E6E9F2",
    colorInput:           "#181C28",
    colorInputForeground: "#E6E9F2",
  },
  elements: {
    ...BASE.elements,
    card:                         "!bg-[#12151F] !border !border-[#2A3040] !rounded-xl !shadow-[0_1px_3px_rgba(0,0,0,0.5)]",
    headerTitle:                  "!text-[#E6E9F2]",
    headerSubtitle:               "!text-[#8B93A7]",
    socialButtonsBlockButton:     "!text-[#E6E9F2] !border-[#2A3040] !bg-[#181C28]",
    socialButtonsBlockButtonText: "!text-[#E6E9F2]",
    dividerText:                  "!text-[#8B93A7]",
    dividerLine:                  "!bg-[#2A3040]",
    formFieldLabel:               "!text-[#B6BDCE]",
    formFieldHintText:            "!text-[#8B93A7]",
    formFieldInput:               "!text-[#E6E9F2] !bg-[#181C28] !border-[#2A3040] placeholder:!text-[#8B93A7]",
    identityPreviewText:          "!text-[#E6E9F2]",
    identityPreviewEditButton:    "!text-[#B6BDCE]",
    footer:                       "!bg-[#12151F]",
    footerActionText:             "!text-[#8B93A7]",
    footerActionLink:             "!text-[#60A5FA]",
    footerPages:                  "!text-[#8B93A7] [&_*]:!text-[#8B93A7]",
    footerPagesLink:              "!text-[#8B93A7]",
  },
};

export const clerkAppearanceLight: ClerkAppearanceTheme = {
  variables: {
    ...BASE.variables,
    colorBackground:      "#FFFFFF",
    colorForeground:      "#0F172A",
    colorMutedForeground: "#64748B",
    colorNeutral:         "#0F172A",
    colorInput:           "#F1F3F8",
    colorInputForeground: "#0F172A",
  },
  elements: {
    ...BASE.elements,
    socialButtonsBlockButton: "!border-[#DDE2EC] !bg-[#FFFFFF]",
    dividerLine:              "!bg-[#DDE2EC]",
    formFieldInput:           "!border-[#DDE2EC] !bg-[#F1F3F8]",
  },
};

// Default export used as SSR fallback (client hydrates to correct theme)
export const clerkAppearance = clerkAppearanceDark;
