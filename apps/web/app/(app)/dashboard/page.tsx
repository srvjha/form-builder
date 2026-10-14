"use client";

import { Plus, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { StatMetric } from "@/components/shared/stat-metric";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { ROUTES, FORM_STATUS_LABELS, FORM_STATUS_COLORS } from "@/lib/constants";
import { cn, formatRelative } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { data: forms, isLoading, error, refetch } = trpc.forms.list.useQuery();

  const stats = forms
    ? {
        totalForms:     forms.length,
        publishedForms: forms.filter((f: any) => f.status === "published").length,
        totalResponses: forms.reduce((acc: number, f: any) => acc + (f.responseCount ?? 0), 0),
        draftForms:     forms.filter((f: any) => f.status === "draft").length,
      }
    : null;

  return (
    <AppShell
      title="Dashboard"
      actions={
        <Button size="sm" asChild>
          <Link href={ROUTES.formNew}>
            <Plus className="h-3.5 w-3.5" />
            New Form
          </Link>
        </Button>
      }
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-xl" />
          ))
        ) : (
          <>
            <StatMetric label="Total Forms"     value={stats?.totalForms ?? 0}     delay={0} />
            <StatMetric label="Published"        value={stats?.publishedForms ?? 0}  delay={0.05} />
            <StatMetric label="Total Responses" value={stats?.totalResponses ?? 0} delay={0.1} />
            <StatMetric label="Drafts"          value={stats?.draftForms ?? 0}      delay={0.15} />
          </>
        )}
      </div>

      {/* Forms table */}
      <section className="mt-8 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] shadow-soft-sm">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-muted)] px-5 py-4">
          <h2 className="font-display text-base font-semibold tracking-tight text-[var(--text-primary)]">Your forms</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.forms}>
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
        <div>
          {error && (
            <div className="p-5">
              <ErrorState
                description={error.message}
                onRetry={() => refetch()}
              />
            </div>
          )}

          {isLoading && (
            <div className="divide-y divide-[var(--border-muted)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && (!forms || forms.length === 0) && (
            <div className="p-5">
              <EmptyState
                icon={<FileText className="h-8 w-8 text-[var(--text-muted)]" />}
                title="No forms yet"
                description="Create your first form and start collecting responses."
                action={{ label: "+ Create Your First Form", onClick: () => router.push(ROUTES.formNew) }}
              />
            </div>
          )}

          {!isLoading && !error && forms && forms.length > 0 && (
            <div className="divide-y divide-[var(--border-muted)]">
              {forms.slice(0, 8).map((form: any, i: number) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="group flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--bg-inset)] sm:gap-4"
                  onClick={() => router.push(ROUTES.formEdit(form.id))}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-soft)]">
                    <FileText className="h-4 w-4 text-[var(--color-accent)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                      {form.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Updated {formatRelative(form.updatedAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      FORM_STATUS_COLORS[form.status as keyof typeof FORM_STATUS_COLORS]?.bg,
                      FORM_STATUS_COLORS[form.status as keyof typeof FORM_STATUS_COLORS]?.text,
                      FORM_STATUS_COLORS[form.status as keyof typeof FORM_STATUS_COLORS]?.border,
                    )}
                  >
                    {FORM_STATUS_LABELS[form.status as keyof typeof FORM_STATUS_LABELS] ?? form.status}
                  </span>
                  <span className="hidden text-xs tabular-nums text-[var(--text-muted)] sm:inline">
                    {form.responseCount ?? 0} responses
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
