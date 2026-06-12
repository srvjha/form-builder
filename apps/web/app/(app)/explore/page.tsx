"use client";

import { useState }      from "react";
import Link              from "next/link";
import { motion }        from "framer-motion";
import { Search, Eye, ExternalLink } from "lucide-react";
import { AppShell }      from "@/components/layout/app-shell";
import { Input }         from "@/components/ui/input";
import { Badge }         from "@/components/ui/badge";
import { Skeleton }      from "@/components/ui/skeleton";
import { EmptyState }    from "@/components/shared/empty-state";
import { ErrorState }    from "@/components/shared/error-state";
import { trpc }          from "@/lib/trpc";
import { ROUTES }        from "@/lib/constants";
import { formatRelative } from "@/lib/utils";

export default function ExplorePage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = trpc.explore.listForms.useQuery(
    { page: 1, pageSize: 24, search: search || undefined },
    { keepPreviousData: true } as any,
  );

  const forms = data?.items ?? [];

  return (
    <AppShell title="Explore">
      {/* Search */}
      <div className="mb-6 flex items-center gap-3">
        <Input
          leftSlot={<Search className="h-4 w-4" />}
          placeholder="Search public forms…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {data && (
          <span className="font-mono text-xs text-[var(--text-muted)]">
            {data.total} public form{data.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {error && <ErrorState description={error.message} onRetry={refetch} />}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      )}

      {!isLoading && !error && forms.length === 0 && (
        <EmptyState
          icon={<Search className="h-8 w-8 text-[var(--text-muted)]" />}
          title={search ? "No results" : "Nothing here yet"}
          description={search ? `No public forms match "${search}".` : "Be the first to publish a public form."}
        />
      )}

      {!isLoading && forms.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form: any, i: number) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
              className="group border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brut-xs"
            >
              <div className="h-1.5 w-full bg-[var(--color-accent)]" />
              <div className="p-5">
                <div className="mb-4">
                  <h3 className="font-display text-base font-extrabold uppercase tracking-tight truncate">
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {form.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {formatRelative(form.updatedAt)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3 w-3 text-[var(--text-muted)]" />
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {form.responseCount ?? 0}
                    </span>
                  </div>
                </div>

                <Link
                  href={ROUTES.publicForm(form.slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-1.5 border-2 border-[#0A0A0A] bg-[var(--bg-inset)] py-2 font-display text-xs font-extrabold uppercase tracking-wider transition-all hover:bg-[#0A0A0A] hover:text-white"
                >
                  Open Form <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
