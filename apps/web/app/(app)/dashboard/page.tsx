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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ROUTES, FORM_STATUS_LABELS } from "@/lib/constants";
import { formatRelative } from "@/lib/utils";

const formStatusVariant: Record<string, "published" | "draft" | "closed" | "archived"> = {
  published: "published",
  draft:     "draft",
  closed:    "closed",
  archived:  "archived",
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: forms, isLoading, error, refetch } = trpc.forms.list.useQuery();

  const stats = forms
    ? {
        totalForms:     forms.length,
        publishedForms: forms.filter((f: any) => f.status === "published").length,
        totalResponses: forms.reduce((acc: number, f: any) => acc + (f.responseCount ?? 0), 0),
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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[112px]" />
          ))
        ) : (
          <>
            <StatMetric label="Total Forms"     value={stats?.totalForms ?? 0}     delay={0} />
            <StatMetric label="Published"        value={stats?.publishedForms ?? 0}  delay={0.05} />
            <StatMetric label="Total Responses" value={stats?.totalResponses ?? 0} delay={0.1} />
            <StatMetric label="Avg Completion"  value="—"                            delay={0.15} />
          </>
        )}
      </div>

      {/* Forms table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Forms</CardTitle>
          <Button variant="ghost" size="sm" asChild className="ml-auto">
            <Link href={ROUTES.forms}>
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {error && (
            <div className="p-6">
              <ErrorState
                description={error.message}
                onRetry={() => refetch()}
              />
            </div>
          )}

          {isLoading && (
            <div className="divide-y-2 divide-[var(--border-muted)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && (!forms || forms.length === 0) && (
            <div className="p-8">
              <EmptyState
                icon={<FileText className="h-8 w-8 text-[var(--text-muted)]" />}
                title="No forms yet"
                description="Create your first form and start collecting responses."
                action={{ label: "+ Create Your First Form", onClick: () => router.push(ROUTES.formNew) }}
              />
            </div>
          )}

          {!isLoading && !error && forms && forms.length > 0 && (
            <div className="divide-y-2 divide-[var(--border-muted)]">
              {forms.slice(0, 8).map((form: any, i: number) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="group flex items-center gap-4 px-6 py-4 hover:bg-[var(--bg-inset)] transition-colors cursor-pointer"
                  onClick={() => router.push(ROUTES.formEdit(form.id))}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[var(--border-muted)] bg-[var(--bg-inset)] group-hover:border-[var(--color-accent)]">
                    <FileText className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {form.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Updated {formatRelative(form.updatedAt)}
                    </p>
                  </div>
                  <Badge variant={formStatusVariant[form.status] ?? "default"} dot>
                    {FORM_STATUS_LABELS[form.status as keyof typeof FORM_STATUS_LABELS] ?? form.status}
                  </Badge>
                  <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                    {form.responseCount ?? 0} resp.
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
