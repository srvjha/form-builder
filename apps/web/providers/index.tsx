"use client";

import { Toaster } from "sonner";
import { TRPCProvider } from "./trpc-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      {children}
      <Toaster
        position="bottom-right"
        richColors={false}
        closeButton
        toastOptions={{
          duration: 5000,
          classNames: {
            toast:
              "!rounded-lg !border !border-[var(--border-color)] !shadow-soft-lg !bg-[var(--bg-panel)] !text-[var(--text-primary)] !font-sans",
            title:
              "!font-semibold !text-xs",
            description:
              "!text-xs !text-[var(--text-muted)]",
            success:
              "!border-l-4 !border-l-[var(--color-green)]",
            error:
              "!border-l-4 !border-l-[var(--color-red)]",
            warning:
              "!border-l-4 !border-l-[var(--color-yellow)]",
            info:
              "!border-l-4 !border-l-[var(--color-accent)]",
            closeButton:
              "!rounded-md !border !border-[var(--border-muted)] !bg-[var(--bg-inset)] hover:!bg-[var(--bg-panel)]",
            icon:
              "!shrink-0",
          },
        }}
      />
    </TRPCProvider>
  );
}
