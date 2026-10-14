import type { ClerkAppearanceTheme } from "@clerk/nextjs/types";
import { dark } from "@clerk/ui/themes";

// Values mirror the tokens in app/globals.css (Clerk needs literal colours).
const BASE = {
  variables: {
    borderRadius:           "0.5rem",
    colorPrimary:           "#2563EB",
    colorDanger:            "#DC2626",
    fontFamily:             "inherit",
    fontSize:               "14px",
    colorPrimaryForeground: "#FFFFFF",
  },
  elements: {
    rootBox: "!w-full",
    cardBox: "!w-full !shadow-none",
    card: "!shadow-none !rounded-xl",
    headerTitle: "!font-sans !font-semibold",
    formButtonPrimary: "!normal-case !shadow-none",
    footerActionLink: "!text-[#2563EB]",
  },
} satisfies Partial<ClerkAppearanceTheme>;

export const clerkAppearanceDark: ClerkAppearanceTheme = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: dark as any,
  variables: {
    ...BASE.variables,
    colorPrimary:         "#3B82F6",
    colorDanger:          "#F87171",
    colorBackground:      "#121212",
    colorForeground:      "#F5F5F5",
    colorMutedForeground: "#A3A3A3",
    colorNeutral:         "#F5F5F5",
    colorInput:           "#1A1A1A",
    colorInputForeground: "#F5F5F5",
  },
  elements: {
    ...BASE.elements,
    cardBox:                      "!w-full !shadow-none !border !border-[#262626] !rounded-xl",
    card:                         "!bg-[#121212] !rounded-xl !shadow-none",
    headerTitle:                  "!font-sans !font-semibold !text-[#F5F5F5]",
    headerSubtitle:               "!text-[#A3A3A3]",
    socialButtonsBlockButton:     "!text-[#F5F5F5] !border-[#262626] !bg-[#1A1A1A]",
    socialButtonsBlockButtonText: "!text-[#F5F5F5]",
    dividerText:                  "!text-[#A3A3A3]",
    dividerLine:                  "!bg-[#262626]",
    formFieldLabel:               "!text-[#D4D4D4]",
    formFieldHintText:            "!text-[#A3A3A3]",
    formFieldInput:               "!text-[#F5F5F5] !bg-[#1A1A1A] !border-[#262626] placeholder:!text-[#A3A3A3]",
    identityPreviewText:          "!text-[#F5F5F5]",
    identityPreviewEditButton:    "!text-[#D4D4D4]",
    footer:                       "!bg-[#121212] !border-t !border-[#262626]",
    footerActionText:             "!text-[#A3A3A3]",
    footerActionLink:             "!text-[#3B82F6]",
    footerPages:                  "!text-[#A3A3A3] [&_*]:!text-[#A3A3A3]",
    footerPagesLink:              "!text-[#A3A3A3]",
  },
};

export const clerkAppearanceLight: ClerkAppearanceTheme = {
  variables: {
    ...BASE.variables,
    colorBackground:      "#FFFFFF",
    colorForeground:      "#0A0A0A",
    colorMutedForeground: "#71717A",
    colorNeutral:         "#0A0A0A",
    colorInput:           "#F4F4F5",
    colorInputForeground: "#0A0A0A",
  },
  elements: {
    ...BASE.elements,
    cardBox:                  "!w-full !shadow-none !border !border-[#E4E4E7] !rounded-xl",
    card:                     "!bg-[#FFFFFF] !rounded-xl !shadow-none",
    headerTitle:              "!font-sans !font-semibold !text-[#0A0A0A]",
    headerSubtitle:           "!text-[#71717A]",
    socialButtonsBlockButton: "!text-[#0A0A0A] !border-[#E4E4E7] !bg-[#FFFFFF]",
    dividerLine:              "!bg-[#E4E4E7]",
    formFieldLabel:           "!text-[#3F3F46]",
    formFieldInput:           "!text-[#0A0A0A] !border-[#E4E4E7] !bg-[#F4F4F5]",
    footer:                   "!bg-[#FFFFFF] !border-t !border-[#E4E4E7]",
    footerActionText:         "!text-[#71717A]",
  },
};

// Default export used as SSR fallback (client hydrates to correct theme)
export const clerkAppearance = clerkAppearanceDark;
