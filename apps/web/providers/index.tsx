"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/lib/trpc";

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 min — avoid refetching immediately on focus
            retry: 1,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          // Appends /api/trpc — matches the mount point in apps/server/src/server.ts
          url: `${getApiUrl()}/api/trpc`,
          headers() {
            return {
              // Bypasses ngrok's browser-warning interstitial page on free tier
              "ngrok-skip-browser-warning": "true",
            };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
