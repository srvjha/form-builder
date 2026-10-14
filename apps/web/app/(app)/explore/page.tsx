"use client";

import { useState }      from "react";
import Link              from "next/link";
import { Search, ExternalLink } from "lucide-react";
import { AppShell }      from "@/components/layout/app-shell";
import { Input }         from "@/components/ui/input";
import { Skeleton }      from "@/components/ui/skeleton";
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
      <div className="mx-auto w-full max-w-4xl">
        <p className="mb-6 max-w-xl text-[15px] text-[var(--text-secondary)]">
          Forms other people have published and made public. Open one to see how it is built, or fill it in.
        </p>

        {/* Search */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Input
            leftSlot={<Search className="h-4 w-4" />}
            placeholder="Search public forms"
            aria-label="Search public forms"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-sm"
          />
          {data && (
            <span className="text-sm tabular-nums text-[var(--text-muted)]">
              {data.total} public form{data.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {error && <ErrorState description={error.message} onRetry={refetch} />}

        {isLoading && (
          <div className="divide-y divide-[var(--border-muted)] rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2 px-4 py-4 sm:px-5">
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-3.5 w-3/4 rounded" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && forms.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-panel)] px-6 py-12 text-center">
            <h3 className="text-base text-[var(--text-primary)]">
              {search ? "No public forms match that search" : "No public forms yet"}
            </h3>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-[var(--text-secondary)]">
              {search
                ? `Nothing public is titled "${search}". Try a shorter search.`
                : "Publish a form and set its visibility to public to list it here."}
            </p>
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 inline-flex h-9 items-center rounded-md border border-[var(--border-color)] bg-[var(--bg-inset)] px-4 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-panel)]"
              >
                Clear search
              </button>
            ) : (
              <Link
                href={ROUTES.forms}
                className="mt-5 inline-flex h-9 items-center rounded-md border border-[var(--border-color)] bg-[var(--bg-inset)] px-4 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-soft)]"
              >
                Go to your forms
              </Link>
            )}
          </div>
        )}

        {!isLoading && forms.length > 0 && (
          <ul className="divide-y divide-[var(--border-muted)] overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]">
            {forms.map((form: any) => (
              <li
                key={form.id}
                className="group relative flex items-start gap-4 px-4 py-4 transition-colors hover:bg-[var(--bg-inset)] sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={ROUTES.publicForm(form.slug)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-[var(--text-primary)] after:absolute after:inset-0 group-hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-[var(--color-accent)]"
                  >
                    <span className="truncate">{form.title}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 text-[var(--text-muted)]" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </Link>
                  {form.description && (
                    <p className="mt-1 line-clamp-2 max-w-prose text-sm text-[var(--text-secondary)]">
                      {form.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[var(--text-muted)] sm:hidden">
                    {form.responseCount ?? 0} responses, updated {formatRelative(form.updatedAt)}
                  </p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-sm tabular-nums text-[var(--text-secondary)]">
                    {form.responseCount ?? 0} {(form.responseCount ?? 0) === 1 ? "response" : "responses"}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    Updated {formatRelative(form.updatedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
