"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { ROUTES, FORM_STATUS_LABELS, FORM_STATUS_COLORS } from "@/lib/constants";
import { cn, formatRelative, formatNumber } from "@/lib/utils";

type Status = keyof typeof FORM_STATUS_COLORS;

function StatusPill({ status }: { status: string }) {
  const c = FORM_STATUS_COLORS[status as Status];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-px text-xs font-medium", c?.bg, c?.text, c?.border)}>
      {FORM_STATUS_LABELS[status as Status] ?? status}
    </span>
  );
}

/* A count set large and inline inside the summary sentence */
function Count({ n, one, many }: { n: number; one: string; many: string }) {
  return (
    <span className="whitespace-nowrap">
      <span className="font-display text-[36px] leading-none text-[var(--text-primary)] tabular-nums sm:text-[44px]">
        {formatNumber(n)}
      </span>{" "}
      {n === 1 ? one : many}
    </span>
  );
}

/* Shown on small screens only, where the sidebar's button is tucked into the drawer */
function MobileCreateButton() {
  return (
    <Link
      href={ROUTES.formNew}
      aria-label="Create form"
      className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-action)] text-white transition-colors hover:bg-[var(--color-action-hover)] lg:hidden"
    >
      <Plus className="h-4 w-4" />
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const { data: forms, isLoading, error, refetch } = trpc.forms.list.useQuery();

  const stats = forms
    ? {
        totalForms:     forms.length,
        publishedForms: forms.filter((f: any) => f.status === "published").length,
        totalResponses: forms.reduce((acc: number, f: any) => acc + (f.responseCount ?? 0), 0),
        draftForms:     forms.filter((f: any) => f.status === "draft").length,
      }
    : null;

  const hasForms = !!forms && forms.length > 0;

  return (
    <AppShell title="Dashboard" actions={<MobileCreateButton />}>
      <div className="mx-auto w-full max-w-4xl">
        {/* Greeting + the numbers, said in one sentence */}
        <section className="pb-10 pt-2 sm:pb-14 sm:pt-6">
          <h2 className="text-[40px] text-[var(--text-primary)] sm:text-[56px]">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h2>

          <div className="mt-5 max-w-2xl text-lg leading-[1.9] text-[var(--text-secondary)] sm:text-xl">
            {isLoading && (
              <div className="space-y-3 pt-2">
                <Skeleton className="h-8 w-full max-w-md rounded-md" />
                <Skeleton className="h-8 w-2/3 max-w-xs rounded-md" />
              </div>
            )}
            {!isLoading && stats && hasForms && (
              <p>
                You have <Count n={stats.totalForms} one="form" many="forms" />,{" "}
                <Count n={stats.totalResponses} one="response" many="responses" /> and{" "}
                <Count n={stats.publishedForms} one="published" many="published" />
                {stats.draftForms > 0 && (
                  <span className="text-[var(--text-muted)]">
                    , with {stats.draftForms} still in draft
                  </span>
                )}
                .
              </p>
            )}
            {!isLoading && !error && !hasForms && (
              <p>No forms yet. Build one, publish it, and its responses will be counted here.</p>
            )}
          </div>
        </section>

        {/* Recent forms */}
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="text-[15px] text-[var(--text-primary)]">Recent forms</h3>
            {hasForms && (
              <Link
                href={ROUTES.forms}
                className="text-sm font-medium text-[var(--color-accent)] hover:underline hover:underline-offset-4"
              >
                View all forms
              </Link>
            )}
          </div>

          {error && <ErrorState description={error.message} onRetry={() => refetch()} />}

          {isLoading && (
            <div className="divide-y divide-[var(--border-muted)] rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-4 sm:px-5">
                  <Skeleton className="h-4 flex-1 rounded" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="hidden h-4 w-16 rounded sm:block" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && !hasForms && (
            <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-panel)] px-6 py-12 text-center">
              <h3 className="text-base text-[var(--text-primary)]">Create your first form</h3>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-[var(--text-secondary)]">
                Start from a blank form, add a few questions and share the link.
              </p>
              <Link
                href={ROUTES.formNew}
                className="mt-5 inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-inset)] px-4 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-soft)]"
              >
                <Plus className="h-4 w-4" />
                Create form
              </Link>
            </div>
          )}

          {!isLoading && !error && hasForms && (
            <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]">
              {/* Column labels (wide screens) */}
              <div className="hidden grid-cols-[minmax(0,1fr)_104px_104px_120px] gap-4 border-b border-[var(--border-muted)] px-5 py-2.5 text-xs text-[var(--text-muted)] sm:grid">
                <span>Title</span>
                <span>Status</span>
                <span className="text-right">Responses</span>
                <span className="text-right">Updated</span>
              </div>
              <ul className="divide-y divide-[var(--border-muted)]">
                {forms!.slice(0, 8).map((form: any) => (
                  <li
                    key={form.id}
                    className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3.5 transition-colors hover:bg-[var(--bg-inset)] sm:grid-cols-[minmax(0,1fr)_104px_104px_120px] sm:px-5"
                  >
                    <div className="min-w-0">
                      <Link
                        href={ROUTES.formEdit(form.id)}
                        className="block truncate text-sm font-medium text-[var(--text-primary)] after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-[var(--color-accent)]"
                      >
                        {form.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)] sm:hidden">
                        {formatNumber(form.responseCount ?? 0)} responses, updated {formatRelative(form.updatedAt)}
                      </p>
                    </div>
                    <div>
                      <StatusPill status={form.status} />
                    </div>
                    <span className="hidden text-right text-sm tabular-nums text-[var(--text-secondary)] sm:block">
                      {formatNumber(form.responseCount ?? 0)}
                    </span>
                    <span className="hidden text-right text-sm text-[var(--text-muted)] sm:block">
                      {formatRelative(form.updatedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
