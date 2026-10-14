"use client";

import { useState }      from "react";
import Link              from "next/link";
import { motion }        from "framer-motion";
import { Search, Eye, ExternalLink, Compass } from "lucide-react";
import { AppShell }      from "@/components/layout/app-shell";
import { Input }         from "@/components/ui/input";
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
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          leftSlot={<Search className="h-4 w-4" />}
          placeholder="Search public forms…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        {data && (
          <span className="text-xs tabular-nums text-[var(--text-muted)]">
            {data.total} public form{data.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {error && <ErrorState description={error.message} onRetry={refetch} />}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
        </div>
      )}

      {!isLoading && !error && forms.length === 0 && (
        <EmptyState
          icon={<Compass className="h-6 w-6 text-[var(--color-accent)]" />}
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
              className="group flex flex-col rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] p-5 shadow-soft-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-soft-md"
            >
              <div className="mb-4 min-w-0">
                <h3 className="truncate font-display text-base font-semibold tracking-tight text-[var(--text-primary)]">
                  {form.title}
                </h3>
                {form.description && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {form.description}
                  </p>
                )}
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  {formatRelative(form.updatedAt)}
                </span>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-3 w-3 text-[var(--text-muted)]" />
                  <span className="text-xs tabular-nums text-[var(--text-muted)]">
                    {form.responseCount ?? 0}
                  </span>
                </div>
              </div>

              <Link
                href={ROUTES.publicForm(form.slug)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-inset)] py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]"
              >
                Open form <ExternalLink className="h-3 w-3" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
