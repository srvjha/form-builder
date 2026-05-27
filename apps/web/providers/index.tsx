"use client";

import { Toaster } from "sonner";
import { TRPCProvider } from "./trpc-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <ThemeProvider>
        {children}
        <Toaster
          position="bottom-right"
          richColors={false}
          closeButton
          toastOptions={{
            duration: 5000,
            classNames: {
              toast:
                "!rounded-none !border-2 !border-[#0A0A0A] !shadow-[4px_4px_0_#0A0A0A] !bg-[var(--bg-panel)] !text-[var(--text-primary)] !font-sans",
              title:
                "!font-display !font-extrabold !uppercase !tracking-wider !text-xs",
              description:
                "!text-xs !text-[var(--text-muted)]",
              success:
                "!border-[#00C853] !shadow-[4px_4px_0_#00C853]",
              error:
                "!border-[#FF3B00] !shadow-[4px_4px_0_#FF3B00]",
              warning:
                "!border-[#FFD600] !shadow-[4px_4px_0_#FFD600]",
              info:
                "!border-[#0066CC] !shadow-[4px_4px_0_#0066CC]",
              closeButton:
                "!rounded-none !border !border-[var(--border-muted)] !bg-[var(--bg-inset)] hover:!bg-[var(--bg-panel)]",
              icon:
                "!shrink-0",
            },
          }}
        />
      </ThemeProvider>
    </TRPCProvider>
  );
}
