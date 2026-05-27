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
              toast:       "!rounded-none !font-sans",
              title:       "!font-bold !uppercase !tracking-wide !text-xs",
              description: "!text-xs",
              closeButton: "!rounded-none",
            },
          }}
        />
      </ThemeProvider>
    </TRPCProvider>
  );
}
