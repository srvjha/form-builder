"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useAuth } from "@clerk/nextjs";
import { trpc } from "@/lib/trpc";
import { API_URL } from "@/lib/constants";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime:          60 * 1000,
        retry:              1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const { getToken } = useAuth();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          url: `${API_URL}/api/trpc`,
          async headers() {
            const token = await getToken();
            return {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "x-trpc-source": "nextjs-client",
              // Bypass ngrok's browser-warning interstitial page (free tier)
              // Without this header, ngrok returns its own HTML with no CORS headers.
              "ngrok-skip-browser-warning": "true",
            };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
