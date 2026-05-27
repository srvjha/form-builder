import { SignIn } from "@clerk/nextjs";

const clerkAppearance = {
  variables: {
    borderRadius:         "0px",
    colorPrimary:         "#FF3B00",
    colorDanger:          "#D50000",
    fontFamily:           "inherit",
    fontSize:             "14px",
    spacingUnit:          "16px",
    /* Feed Clerk's own internal token system — this is what actually
       controls the card + footer background colour. CSS classes alone
       cannot beat Clerk's scoped --cl-color-background. */
    colorBackground:      "var(--bg-panel)",
    colorInputBackground: "var(--bg-inset)",
    colorText:            "var(--text-primary)",
    colorTextSecondary:   "var(--text-muted)",
    colorNeutral:         "var(--text-primary)",
  },
  elements: {
    /* ── Card shell ───────────────────────────────────────── */
    card:                     "!rounded-none !border-2 !border-[#0A0A0A] !shadow-[4px_4px_0_#0A0A0A] !bg-[var(--bg-panel)] !p-0",
    cardBox:                  "!rounded-none !bg-[var(--bg-panel)]",

    /* ── Header ───────────────────────────────────────────── */
    headerTitle:              "!hidden",
    headerSubtitle:           "!hidden",
    header:                   "!hidden",

    /* ── Main content ─────────────────────────────────────── */
    main:                     "!bg-[var(--bg-panel)] !px-8 !pt-8",

    /* ── Social / OAuth ───────────────────────────────────── */
    socialButtonsBlockButton: "!rounded-none !border-2 !border-[#0A0A0A] !bg-[var(--bg-panel)] !text-[var(--text-primary)] !font-bold !uppercase !tracking-wider !text-xs !shadow-[2px_2px_0_#0A0A0A] hover:!translate-x-[1px] hover:!translate-y-[1px] hover:!shadow-[1px_1px_0_#0A0A0A] !transition-all",
    socialButtonsBlockButtonText: "!font-bold !uppercase !tracking-wider !text-xs",

    /* ── Divider ──────────────────────────────────────────── */
    dividerLine:              "!bg-[var(--border-muted)]",
    dividerText:              "!font-mono !text-xs !uppercase !tracking-widest !text-[var(--text-muted)] !bg-[var(--bg-panel)]",

    /* ── Form fields ──────────────────────────────────────── */
    formFieldLabel:           "!font-bold !uppercase !tracking-wider !text-xs !text-[var(--text-primary)]",
    formFieldInput:           "!rounded-none !border-2 !border-[#0A0A0A] !font-mono !text-sm !bg-[var(--bg-inset)] !text-[var(--text-primary)] focus:!ring-0 focus:!border-[var(--color-accent)] focus:!shadow-[3px_3px_0_var(--color-accent)] !transition-all",
    formFieldInputShowPasswordButton: "!rounded-none",
    formFieldHintText:        "!font-mono !text-xs !text-[var(--text-muted)]",
    formFieldErrorText:       "!font-mono !text-xs !text-[var(--color-red)]",

    /* ── Primary button ───────────────────────────────────── */
    formButtonPrimary:        "!rounded-none !bg-[var(--color-accent)] !border-2 !border-[#0A0A0A] !font-display !font-extrabold !uppercase !tracking-wider !shadow-[4px_4px_0_#0A0A0A] hover:!translate-x-[2px] hover:!translate-y-[2px] hover:!shadow-[2px_2px_0_#0A0A0A] !transition-all !text-white",

    /* ── Alert / errors ───────────────────────────────────── */
    alertText:                "!font-mono !text-xs",
    alert:                    "!rounded-none !border-2 !border-[var(--color-red)]",

    /* ── Identity preview ─────────────────────────────────── */
    identityPreviewText:      "!font-mono !text-xs",
    identityPreviewEditButton:"!rounded-none !font-mono !text-xs",

    /* ── Footer ───────────────────────────────────────────── */
    footer:                   "!bg-[var(--bg-inset)] !rounded-none !border-t-2 !border-[var(--border-muted)] !px-8 !py-4",
    footerAction:             "!bg-[var(--bg-inset)]",
    footerActionText:         "!text-[var(--text-muted)] !font-mono !text-xs",
    footerActionLink:         "!font-bold !text-[var(--color-accent)] hover:!underline !font-mono !text-xs",
    footerPages:              "!bg-[var(--bg-inset)]",
    footerPagesLink:          "!font-mono !text-xs !text-[var(--text-muted)] hover:!text-[var(--text-primary)]",

    /* ── Misc ─────────────────────────────────────────────── */
    badge:                    "!rounded-none !font-mono !text-[10px] !uppercase !tracking-widest",
    logoBox:                  "!hidden",
    logoImage:                "!hidden",
  },
} as const;

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full text-center mb-2">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight">
          Welcome back.
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Sign in to keep building.
        </p>
      </div>
      <div className="w-full">
        <SignIn appearance={clerkAppearance} />
      </div>
    </div>
  );
}
