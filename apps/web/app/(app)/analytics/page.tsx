"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { keepPreviousData } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChartEmpty,
  ChartPanel,
  HorizontalBarList,
  KpiRow,
  RANGE_OPTIONS,
  SegmentedControl,
  TimeSeriesCard,
  fillDays,
  formatCount,
  formatDuration,
  parseDays,
  percent,
  type BarItem,
  type KpiItem,
} from "@/components/charts";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

/* ── Response shape (the procedure's output is untyped) ───────── */
type FormSummary = { id: string; title: string; status: string; responseCount: number };
type PerForm = {
  formId: string;
  title: string;
  status: string;
  views: number;
  starts: number;
  submissions: number;
  abandons: number;
  completionRate: number;
};
type Overview = {
  days: number;
  formId: string | null;
  forms: FormSummary[];
  summary: {
    totalViews: number;
    uniqueViews: number;
    totalStarts: number;
    totalSubmissions: number;
    totalAbandons: number;
    completionRate: number;
    avgCompletionTimeMs: number | null;
    topCountries: { country: string; count: number }[];
    topReferrers: { referrer: string; count: number }[];
    dailyEvents: { date: string; views: number; starts: number; submissions: number; abandons: number }[];
  };
  perForm: PerForm[];
};

const METRICS = [
  { key: "views", label: "Views", noun: "views" },
  { key: "starts", label: "Starts", noun: "starts" },
  { key: "submissions", label: "Responses", noun: "responses" },
  { key: "abandons", label: "Drop-offs", noun: "drop-offs" },
] as const;
const METRIC_KEYS = METRICS.map((m) => m.key);

const linkClass =
  "text-sm font-medium text-[var(--color-accent)] hover:underline hover:underline-offset-4";

export default function AnalyticsPage() {
  return (
    <AppShell title="Analytics">
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsView />
      </Suspense>
    </AppShell>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
      <Skeleton className="h-10 w-full max-w-md" />
      <KpiRow items={[]} loading />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}

function AnalyticsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formParam = searchParams.get("form") || undefined;
  const days = parseDays(searchParams.get("days"));

  const query = trpc.analytics.overview.useQuery(
    { formId: formParam, days },
    { placeholderData: keepPreviousData },
  );
  const data = query.data as Overview | undefined;
  const loading = query.isLoading;
  const refetching = query.isFetching && !query.isLoading;

  function setParams(next: { form?: string | null; days?: number }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.form !== undefined) {
      if (next.form) params.set("form", next.form);
      else params.delete("form");
    }
    if (next.days !== undefined) params.set("days", String(next.days));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const forms = data?.forms ?? [];
  // The layout follows the data on screen, so a held previous render keeps its own shape
  const shownFormId = data ? data.formId : (formParam ?? null);
  const shownForm = forms.find((f) => f.id === shownFormId);

  const filters = (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={formParam ?? "all"}
        onValueChange={(v) => setParams({ form: v === "all" ? null : v })}
        disabled={loading && !data}
      >
        <SelectTrigger aria-label="Form" className="h-9 w-full sm:w-64">
          <SelectValue placeholder="All forms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All forms</SelectItem>
          {forms.length > 0 && <SelectSeparator />}
          {forms.map((f) => (
            <SelectItem key={f.id} value={f.id}>
              {f.title || "Untitled form"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <SegmentedControl
        label="Date range"
        options={RANGE_OPTIONS}
        value={String(days) as (typeof RANGE_OPTIONS)[number]["value"]}
        onChange={(v) => setParams({ days: Number(v) })}
      />
    </div>
  );

  if (query.error && !data) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
        {filters}
        <ErrorState description={query.error.message} onRetry={() => query.refetch()} />
        {formParam && (
          <button type="button" className={linkClass} onClick={() => setParams({ form: null })}>
            Show all forms instead
          </button>
        )}
      </div>
    );
  }

  if (data && forms.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-panel)] px-6 py-12 text-center">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">No forms to measure yet</h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-[var(--text-secondary)]">
            Create and publish a form. Its views, starts and responses will show up here.
          </p>
          <Link
            href="/forms/new"
            className="mt-5 inline-flex h-9 items-center rounded-md bg-[var(--color-action)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-action-hover)]"
          >
            Create form
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
      {filters}

      <div
        aria-busy={refetching}
        className={cn("space-y-4 transition-opacity sm:space-y-6", refetching && "opacity-60")}
      >
        <Body data={data} loading={loading} formId={shownFormId} formTitle={shownForm?.title} />
      </div>
    </div>
  );
}

function Body({
  data,
  loading,
  formId,
  formTitle,
}: {
  data: Overview | undefined;
  loading: boolean;
  formId: string | null;
  formTitle?: string;
}) {
  const s = data?.summary;
  const days = data?.days ?? 30;
  const views = s?.totalViews ?? 0;
  const starts = s?.totalStarts ?? 0;
  const submissions = s?.totalSubmissions ?? 0;

  const daily = useMemo(
    () => fillDays(s?.dailyEvents ?? [], days, METRIC_KEYS),
    [s?.dailyEvents, days],
  );

  const kpis: KpiItem[] = [
    { label: "Views", value: formatCount(views) },
    {
      label: "Unique visitors",
      value: formatCount(s?.uniqueViews ?? 0),
      sub: views ? `${percent(s?.uniqueViews ?? 0, views)}% of views` : undefined,
    },
    {
      label: "Responses",
      value: formatCount(submissions),
      sub: starts ? `from ${starts.toLocaleString()} starts` : undefined,
    },
    { label: "Completion rate", value: `${s?.completionRate ?? 0}%`, sub: "responses per view" },
    { label: "Avg. time to complete", value: formatDuration(s?.avgCompletionTimeMs) },
  ];

  const editHref = formId ? `/forms/${formId}/edit` : "/forms";

  return (
    <>
      {formId && (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="min-w-0 truncate text-sm text-[var(--text-secondary)]">
            Showing <span className="font-medium text-[var(--text-primary)]">{formTitle ?? "this form"}</span>,
            last {days} days
          </p>
          <Link href={`/forms/${formId}/analytics`} className={linkClass}>
            Open full analytics for this form
          </Link>
        </div>
      )}

      <KpiRow items={kpis} loading={loading} count={5} />

      <TimeSeriesCard
        title="Over time"
        data={daily}
        metrics={METRICS}
        days={days}
        loading={loading}
        emptyMessage={
          formId
            ? `No one has opened this form in the last ${days} days. Publish it and share the link to start collecting.`
            : `None of your forms had visits in the last ${days} days. Share a published form to start collecting.`
        }
        emptyAction={
          <Link href={editHref} className={linkClass}>
            {formId ? "Open form" : "Go to forms"}
          </Link>
        }
      />

      {formId ? (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <Funnel loading={loading} views={views} starts={starts} submissions={submissions} />
          <TopCountries loading={loading} rows={s?.topCountries ?? []} />
          <TopReferrers loading={loading} rows={s?.topReferrers ?? []} />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <Funnel loading={loading} views={views} starts={starts} submissions={submissions} />
            <ResponsesByForm loading={loading} rows={mergeForms(data)} days={days} />
          </div>
          <FormsTable loading={loading} rows={mergeForms(data)} days={days} />
        </>
      )}
    </>
  );
}

/* Every form, with zero totals for those that had no events in range */
function mergeForms(data: Overview | undefined): PerForm[] {
  if (!data) return [];
  const byId = new Map(data.perForm.map((p) => [p.formId, p]));
  return data.forms
    .map(
      (f) =>
        byId.get(f.id) ?? {
          formId: f.id,
          title: f.title,
          status: f.status,
          views: 0,
          starts: 0,
          submissions: 0,
          abandons: 0,
          completionRate: 0,
        },
    )
    .sort((a, b) => b.submissions - a.submissions || b.views - a.views || a.title.localeCompare(b.title));
}

function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4 px-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3" style={{ width: `${90 - i * 18}%` }} />
        </div>
      ))}
    </div>
  );
}

function Funnel({
  loading,
  views,
  starts,
  submissions,
}: {
  loading: boolean;
  views: number;
  starts: number;
  submissions: number;
}) {
  const steps: BarItem[] = [
    { id: "viewed", label: "Viewed", value: views },
    { id: "started", label: "Started", value: starts },
    { id: "submitted", label: "Submitted", value: submissions },
  ].map((step) => ({
    ...step,
    valueLabel: `${step.value.toLocaleString()} · ${percent(step.value, views)}%`,
  }));

  return (
    <ChartPanel title="Funnel" description="Share of views reaching each step">
      <div className="px-2 pb-4 pt-3 sm:px-4 sm:pb-5">
        {loading ? (
          <ListSkeleton rows={3} />
        ) : views === 0 ? (
          <div className="px-2">
            <ChartEmpty message="No views in this period, so there is no funnel to show yet." />
          </div>
        ) : (
          <HorizontalBarList ariaLabel="Funnel" items={steps} max={views} />
        )}
      </div>
    </ChartPanel>
  );
}

function ResponsesByForm({ loading, rows, days }: { loading: boolean; rows: PerForm[]; days: number }) {
  const top = rows.filter((r) => r.submissions > 0).slice(0, 8);
  const items: BarItem[] = top.map((r) => ({
    id: r.formId,
    label: r.title || "Untitled form",
    value: r.submissions,
    href: `/forms/${r.formId}/analytics`,
    details: [
      { label: "Views", value: r.views.toLocaleString() },
      { label: "Responses", value: r.submissions.toLocaleString() },
      { label: "Completion", value: `${r.completionRate}%` },
    ],
  }));

  return (
    <ChartPanel
      title="Responses by form"
      description={rows.length > 8 && top.length === 8 ? "Top 8 forms" : undefined}
    >
      <div className="px-2 pb-4 pt-3 sm:px-4 sm:pb-5">
        {loading ? (
          <ListSkeleton />
        ) : items.length === 0 ? (
          <div className="px-2">
            <ChartEmpty
              message={`No responses in the last ${days} days. Share a published form to start collecting.`}
              action={<Link href="/forms" className={linkClass}>Go to forms</Link>}
            />
          </div>
        ) : (
          <HorizontalBarList ariaLabel="Responses by form" items={items} />
        )}
      </div>
    </ChartPanel>
  );
}

function FormsTable({ loading, rows, days }: { loading: boolean; rows: PerForm[]; days: number }) {
  return (
    <ChartPanel title="All forms" description={`Last ${days} days`}>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-y border-[var(--border-muted)] text-left text-[13px] text-[var(--text-secondary)]">
              <th scope="col" className="px-4 py-2.5 font-medium sm:px-6">Form</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Views</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Responses</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium sm:pr-6">Completion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-muted)]">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 sm:px-6"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-4 py-3"><Skeleton className="ml-auto h-4 w-10" /></td>
                    <td className="px-4 py-3"><Skeleton className="ml-auto h-4 w-10" /></td>
                    <td className="px-4 py-3 sm:pr-6"><Skeleton className="ml-auto h-4 w-10" /></td>
                  </tr>
                ))
              : rows.map((r) => (
                  <tr key={r.formId} className="relative transition-colors hover:bg-[var(--bg-inset)]">
                    <td className="max-w-[320px] px-4 py-3 sm:px-6">
                      <Link
                        href={`/forms/${r.formId}/analytics`}
                        className="block truncate font-medium text-[var(--text-primary)] after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-[var(--color-accent)]"
                      >
                        {r.title || "Untitled form"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[var(--text-secondary)]">
                      {r.views.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[var(--text-primary)]">
                      {r.submissions.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[var(--text-secondary)] sm:pr-6">
                      {r.views ? `${r.completionRate}%` : "—"}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="h-2" />
    </ChartPanel>
  );
}

function referrerLabel(raw: string) {
  if (!raw) return "Direct";
  return raw.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] || raw;
}

function TopCountries({ loading, rows }: { loading: boolean; rows: { country: string; count: number }[] }) {
  const items: BarItem[] = rows.slice(0, 8).map((r) => ({
    id: r.country || "unknown",
    label: r.country || "Unknown",
    value: Number(r.count),
  }));
  return (
    <ChartPanel title="Top countries" description="Views by country">
      <div className="px-2 pb-4 pt-3 sm:px-4 sm:pb-5">
        {loading ? (
          <ListSkeleton />
        ) : items.length === 0 ? (
          <div className="px-2">
            <ChartEmpty message="No country data for this period. It appears once visitors open the form." />
          </div>
        ) : (
          <HorizontalBarList ariaLabel="Top countries" items={items} />
        )}
      </div>
    </ChartPanel>
  );
}

function TopReferrers({ loading, rows }: { loading: boolean; rows: { referrer: string; count: number }[] }) {
  // Several full URLs can share a host, so group by the label shown
  const grouped = new Map<string, number>();
  for (const r of rows) {
    const label = referrerLabel(r.referrer);
    grouped.set(label, (grouped.get(label) ?? 0) + Number(r.count));
  }
  const items: BarItem[] = [...grouped.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ id: label, label, value }));

  return (
    <ChartPanel title="Top referrers" description="Where views came from">
      <div className="px-2 pb-4 pt-3 sm:px-4 sm:pb-5">
        {loading ? (
          <ListSkeleton />
        ) : items.length === 0 ? (
          <div className="px-2">
            <ChartEmpty message="No referrers yet. Visits from shared links will show here." />
          </div>
        ) : (
          <HorizontalBarList ariaLabel="Top referrers" items={items} />
        )}
      </div>
    </ChartPanel>
  );
}
