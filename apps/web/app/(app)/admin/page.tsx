"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { keepPreviousData } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/error-state";
import { StatusPill } from "@/components/shared/status-pill";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartEmpty,
  ChartPanel,
  HorizontalBarList,
  KpiRow,
  RANGE_OPTIONS,
  SegmentedControl,
  SmallAreaChart,
  fillDays,
  formatCount,
  parseDays,
  percent,
  type BarItem,
  type KpiItem,
} from "@/components/charts";
import { FORM_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

/* ── Response shape (the procedure's output is untyped) ───────── */
type AdminOverview = {
  days: number;
  totals: { users: number; forms: number; publishedForms: number; responses: number; views: number };
  inPeriod: { users: number; forms: number; responses: number; views: number };
  daily: { date: string; signups: number; forms: number; responses: number; views: number }[];
  formsByStatus: { status: string; count: number }[];
  topForms: { id: string; title: string; slug: string; status: string; ownerEmail: string | null; responses: number }[];
  recentUsers: { id: string; fullName: string | null; email: string; createdAt: string | null; forms: number }[];
};

const DAILY_KEYS = ["signups", "forms", "responses", "views"] as const;
const TRENDS = [
  { key: "signups", title: "Sign-ups" },
  { key: "forms", title: "Forms created" },
  { key: "responses", title: "Responses" },
  { key: "views", title: "Views" },
] as const;
const STATUS_ORDER = ["published", "draft", "closed", "archived"] as const;

export default function AdminPage() {
  return (
    <AppShell title="Admin">
      <Suspense fallback={<KpiRow items={[]} loading count={5} className="mx-auto w-full max-w-6xl" />}>
        <AdminGate />
      </Suspense>
    </AppShell>
  );
}

function AdminGate() {
  const me = trpc.admin.me.useQuery();

  if (me.isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
        <Skeleton className="h-9 w-64" />
        <KpiRow items={[]} loading count={5} />
      </div>
    );
  }
  if (me.error) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <ErrorState description={me.error.message} onRetry={() => me.refetch()} />
      </div>
    );
  }
  if (!me.data?.isAdmin) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] px-6 py-12 text-center">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">You don&apos;t have access to this page.</h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-[var(--text-secondary)]">
            The admin area is limited to platform administrators.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex text-sm font-medium text-[var(--color-accent)] hover:underline hover:underline-offset-4"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }
  return <AdminView />;
}

function AdminView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const days = parseDays(searchParams.get("days"));

  const query = trpc.admin.overview.useQuery({ days }, { placeholderData: keepPreviousData });
  const data = query.data as AdminOverview | undefined;
  const loading = query.isLoading;
  const refetching = query.isFetching && !query.isLoading;
  const shownDays = data?.days ?? days;

  function setDays(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("days", String(next));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const daily = useMemo(() => fillDays(data?.daily ?? [], shownDays, DAILY_KEYS), [data?.daily, shownDays]);

  const since = `in the last ${shownDays} days`;
  const kpis: KpiItem[] = data
    ? [
        { label: "Users", value: formatCount(data.totals.users), sub: `+${data.inPeriod.users.toLocaleString()} ${since}` },
        { label: "Forms", value: formatCount(data.totals.forms), sub: `+${data.inPeriod.forms.toLocaleString()} ${since}` },
        {
          label: "Published forms",
          value: formatCount(data.totals.publishedForms),
          sub: `${percent(data.totals.publishedForms, data.totals.forms)}% of all forms`,
        },
        { label: "Responses", value: formatCount(data.totals.responses), sub: `+${data.inPeriod.responses.toLocaleString()} ${since}` },
        { label: "Views", value: formatCount(data.totals.views), sub: `+${data.inPeriod.views.toLocaleString()} ${since}` },
      ]
    : [];

  const periodTotals = {
    signups: data?.inPeriod.users,
    forms: data?.inPeriod.forms,
    responses: data?.inPeriod.responses,
    views: data?.inPeriod.views,
  };

  const statusCounts = new Map((data?.formsByStatus ?? []).map((s) => [s.status, Number(s.count)]));
  const statusItems: BarItem[] = [
    ...STATUS_ORDER,
    ...[...statusCounts.keys()].filter((k) => !(STATUS_ORDER as readonly string[]).includes(k)),
  ].map((status) => {
    const count = statusCounts.get(status) ?? 0;
    return {
      id: status,
      label: FORM_STATUS_LABELS[status as keyof typeof FORM_STATUS_LABELS] ?? status,
      value: count,
      valueLabel: `${count.toLocaleString()} · ${percent(count, data?.totals.forms ?? 0)}%`,
    };
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
      <SegmentedControl
        label="Date range"
        options={RANGE_OPTIONS}
        value={String(days) as (typeof RANGE_OPTIONS)[number]["value"]}
        onChange={(v) => setDays(Number(v))}
      />

      {query.error && !data ? (
        <ErrorState description={query.error.message} onRetry={() => query.refetch()} />
      ) : (
        <div
          aria-busy={refetching}
          className={cn("space-y-4 transition-opacity sm:space-y-6", refetching && "opacity-60")}
        >
          <KpiRow items={kpis} loading={loading} count={5} />

          {/* Small multiples: each metric on its own scale, never a shared or dual axis */}
          <ChartPanel title="Daily activity" description={`Last ${shownDays} days, each chart on its own scale`}>
            <div className="mt-3 grid grid-cols-1 gap-px overflow-hidden rounded-b-xl border-t border-[var(--border-muted)] bg-[var(--border-muted)] sm:grid-cols-2 lg:grid-cols-4 [&>*]:bg-[var(--bg-panel)]">
              {TRENDS.map((t) => (
                <SmallAreaChart
                  key={t.key}
                  title={t.title}
                  data={daily}
                  dataKey={t.key}
                  total={periodTotals[t.key]}
                  loading={loading}
                />
              ))}
            </div>
          </ChartPanel>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <ChartPanel title="Forms by status" description="All forms on the platform">
              <div className="px-2 pb-4 pt-3 sm:px-4 sm:pb-5">
                {loading ? (
                  <div className="space-y-4 px-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-8" />
                    ))}
                  </div>
                ) : (data?.totals.forms ?? 0) === 0 ? (
                  <div className="px-2"><ChartEmpty message="No forms have been created yet." /></div>
                ) : (
                  <HorizontalBarList ariaLabel="Forms by status" items={statusItems} />
                )}
              </div>
            </ChartPanel>

            <TopFormsTable loading={loading} rows={data?.topForms ?? []} days={shownDays} className="lg:col-span-2" />
          </div>

          <RecentUsersTable loading={loading} rows={data?.recentUsers ?? []} />
        </div>
      )}
    </div>
  );
}

/* ── Tables ─────────────────────────────────────────────────── */
const th = "px-4 py-2.5 font-medium whitespace-nowrap";
const td = "px-4 py-3";

function SkeletonRows({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className={cn(td, j === 0 && "sm:pl-6")}>
              <Skeleton className={cn("h-4", j === 0 ? "w-36" : "w-16")} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function TopFormsTable({
  loading,
  rows,
  days,
  className,
}: {
  loading: boolean;
  rows: AdminOverview["topForms"];
  days: number;
  className?: string;
}) {
  return (
    <ChartPanel title="Top forms" description={`By responses in the last ${days} days`} className={className}>
      {!loading && rows.length === 0 ? (
        <div className="px-4 pb-5 pt-3 sm:px-6">
          <ChartEmpty message={`No form received a response in the last ${days} days.`} />
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto pb-2">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-y border-[var(--border-muted)] text-left text-[13px] text-[var(--text-secondary)]">
                <th scope="col" className={cn(th, "sm:pl-6")}>Form</th>
                <th scope="col" className={th}>Owner</th>
                <th scope="col" className={th}>Status</th>
                <th scope="col" className={cn(th, "text-right sm:pr-6")}>Responses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-muted)]">
              {loading ? (
                <SkeletonRows cols={4} />
              ) : (
                rows.map((f) => (
                  <tr key={f.id} className="transition-colors hover:bg-[var(--bg-inset)]">
                    <td className={cn(td, "max-w-[260px] sm:pl-6")}>
                      {f.status === "published" && f.slug ? (
                        <a
                          href={`/f/${f.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate font-medium text-[var(--color-accent)] hover:underline hover:underline-offset-4"
                          title={`Open /f/${f.slug}`}
                        >
                          {f.title || "Untitled form"}
                        </a>
                      ) : (
                        <span className="block truncate font-medium text-[var(--text-primary)]">
                          {f.title || "Untitled form"}
                        </span>
                      )}
                    </td>
                    <td className={cn(td, "max-w-[220px] truncate text-[var(--text-secondary)]")}>
                      {f.ownerEmail ?? "—"}
                    </td>
                    <td className={td}><StatusPill status={f.status} /></td>
                    <td className={cn(td, "text-right tabular-nums text-[var(--text-primary)] sm:pr-6")}>
                      {Number(f.responses).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </ChartPanel>
  );
}

function formatJoined(iso: string | null) {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return "—";
  }
}

function RecentUsersTable({ loading, rows }: { loading: boolean; rows: AdminOverview["recentUsers"] }) {
  return (
    <ChartPanel title="Recent users" description="Newest sign-ups first">
      {!loading && rows.length === 0 ? (
        <div className="px-4 pb-5 pt-3 sm:px-6">
          <ChartEmpty message="No one has signed up yet." />
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto pb-2">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-y border-[var(--border-muted)] text-left text-[13px] text-[var(--text-secondary)]">
                <th scope="col" className={cn(th, "sm:pl-6")}>Name</th>
                <th scope="col" className={th}>Email</th>
                <th scope="col" className={th}>Joined</th>
                <th scope="col" className={cn(th, "text-right sm:pr-6")}>Forms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-muted)]">
              {loading ? (
                <SkeletonRows cols={4} />
              ) : (
                rows.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-[var(--bg-inset)]">
                    <td className={cn(td, "max-w-[220px] truncate font-medium text-[var(--text-primary)] sm:pl-6")}>
                      {u.fullName || "—"}
                    </td>
                    <td className={cn(td, "max-w-[260px] truncate text-[var(--text-secondary)]")}>{u.email}</td>
                    <td className={cn(td, "whitespace-nowrap tabular-nums text-[var(--text-secondary)]")}>
                      {formatJoined(u.createdAt)}
                    </td>
                    <td className={cn(td, "text-right tabular-nums text-[var(--text-primary)] sm:pr-6")}>
                      {Number(u.forms).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </ChartPanel>
  );
}
