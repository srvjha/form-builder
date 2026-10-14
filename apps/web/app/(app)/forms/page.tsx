"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreHorizontal, Eye, Edit3, BarChart2, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogBody,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { ROUTES, FORM_STATUS_LABELS, FORM_STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { formatRelative, formatNumber } from "@/lib/utils";

export default function FormsPage() {
  const router = useRouter();
  const [search, setSearch]             = useState("");
  const [deleteId, setDeleteId]         = useState<string | null>(null);

  const { data: forms, isLoading, error, refetch } = trpc.forms.list.useQuery();
  const deleteMutation = trpc.forms.delete.useMutation({
    onSuccess: () => {
      toast.success("Form deleted");
      setDeleteId(null);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const cloneMutation = trpc.forms.clone.useMutation({
    onSuccess: (cloned) => {
      toast.success("Form duplicated");
      refetch();
      router.push(ROUTES.formEdit(cloned.id));
    },
    onError: (err) => toast.error(err.message),
  });

  const filtered = forms?.filter((f: any) =>
    f.title.toLowerCase().includes(search.toLowerCase()),
  ) ?? [];

  return (
    <AppShell
      title="Forms"
      actions={
        <Link
          href={ROUTES.formNew}
          aria-label="Create form"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-action)] text-white transition-colors hover:bg-[var(--color-action-hover)] lg:hidden"
        >
          <Plus className="h-4 w-4" />
        </Link>
      }
    >
      <div className="mx-auto w-full max-w-5xl">
      {/* Search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Input
          leftSlot={<Search className="h-4 w-4" />}
          placeholder="Search forms by title"
          aria-label="Search forms"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        {forms && (
          <span className="text-sm tabular-nums text-[var(--text-muted)]">
            {search ? `${filtered.length} of ${forms.length} forms` : `${forms.length} ${forms.length === 1 ? "form" : "forms"}`}
          </span>
        )}
      </div>

      {/* Error */}
      {error && <ErrorState description={error.message} onRetry={() => refetch()} />}

      {/* Loading rows */}
      {isLoading && (
        <div className="divide-y divide-[var(--border-muted)] rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4 sm:px-5">
              <Skeleton className="h-4 flex-1 rounded" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="hidden h-4 w-16 rounded sm:block" />
              <Skeleton className="hidden h-4 w-20 rounded sm:block" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-panel)] px-6 py-12 text-center">
          <h3 className="text-base text-[var(--text-primary)]">
            {search ? "No forms match that search" : "Create your first form"}
          </h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-[var(--text-secondary)]">
            {search
              ? `Nothing is titled "${search}". Check the spelling or clear the search.`
              : "Start from a blank form, add a few questions and share the link."}
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
              href={ROUTES.formNew}
              className="mt-5 inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-inset)] px-4 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-soft)]"
            >
              <Plus className="h-4 w-4" />
              Create form
            </Link>
          )}
        </div>
      )}

      {/* Forms table */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]">
          <div className="hidden grid-cols-[minmax(0,1fr)_104px_104px_120px_32px] gap-4 border-b border-[var(--border-muted)] px-5 py-2.5 text-xs text-[var(--text-muted)] sm:grid">
            <span>Title</span>
            <span>Status</span>
            <span className="text-right">Responses</span>
            <span className="text-right">Updated</span>
            <span className="sr-only">Actions</span>
          </div>
          <ul className="divide-y divide-[var(--border-muted)]">
            {filtered.map((form: any) => {
              const c = FORM_STATUS_COLORS[form.status as keyof typeof FORM_STATUS_COLORS];
              return (
                <li
                  key={form.id}
                  className="group relative grid grid-cols-[minmax(0,1fr)_auto_32px] items-center gap-x-3 px-4 py-3 transition-colors hover:bg-[var(--bg-inset)] sm:grid-cols-[minmax(0,1fr)_104px_104px_120px_32px] sm:gap-x-4 sm:px-5"
                >
                  <div className="min-w-0">
                    <Link
                      href={ROUTES.formEdit(form.id)}
                      className="block truncate text-sm font-medium text-[var(--text-primary)] after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-[var(--color-accent)]"
                    >
                      {form.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)] sm:hidden">
                      {formatNumber(form.responseCount ?? 0)} responses, updated {formatRelative(form.updatedAt)}
                    </p>
                  </div>
                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-px text-xs font-medium",
                        c?.bg, c?.text, c?.border,
                      )}
                    >
                      {FORM_STATUS_LABELS[form.status as keyof typeof FORM_STATUS_LABELS] ?? form.status}
                    </span>
                  </div>
                  <span className="hidden text-right text-sm tabular-nums text-[var(--text-secondary)] sm:block">
                    {formatNumber(form.responseCount ?? 0)}
                  </span>
                  <span className="hidden text-right text-sm text-[var(--text-muted)] sm:block">
                    {formatRelative(form.updatedAt)}
                  </span>
                  <div className="relative z-10 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${form.title}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => router.push(ROUTES.formEdit(form.id))}>
                          <Edit3 className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.push(ROUTES.publicForm(form.slug))}>
                          <Eye className="h-4 w-4" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.push(ROUTES.formAnalytics(form.id))}>
                          <BarChart2 className="h-4 w-4" /> Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => cloneMutation.mutate({ formId: form.id })}
                          disabled={cloneMutation.isPending}
                        >
                          <Copy className="h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem destructive onSelect={() => setDeleteId(form.id)}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(o) => {
          if (!o) setDeleteId(null);
        }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete form</DialogTitle>
            <DialogDescription>
              This will archive the form and stop accepting new responses.
              Existing responses are preserved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={() => deleteId && deleteMutation.mutate({ formId: deleteId })}
            >
              Delete form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
