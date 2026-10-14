"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Search, MoreHorizontal, Eye, Edit3, BarChart2, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
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
      toast.success("Form duplicated!");
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
        <Button size="sm" asChild>
          <Link href={ROUTES.formNew}>
            <Plus className="h-3.5 w-3.5" />
            New Form
          </Link>
        </Button>
      }
    >
      {/* Search */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          leftSlot={<Search className="h-4 w-4" />}
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        {forms && (
          <span className="text-xs tabular-nums text-[var(--text-muted)]">
            {filtered.length} / {forms.length} forms
          </span>
        )}
      </div>

      {/* Error */}
      {error && <ErrorState description={error.message} onRetry={() => refetch()} />}

      {/* Loading grid */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[152px] rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && filtered.length === 0 && (
        <EmptyState
          icon={<FileText className="h-6 w-6 text-[var(--color-accent)]" />}
          title={search ? "No forms match" : "No forms yet"}
          description={
            search
              ? `No forms found for "${search}". Try a different search.`
              : "Create your first form and start collecting responses."
          }
          action={
            !search
              ? { label: "Create your first form", onClick: () => router.push(ROUTES.formNew) }
              : undefined
          }
        />
      )}

      {/* Forms grid */}
      {!isLoading && !error && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filtered.map((form: any, i: number) => (
              <motion.div
                key={form.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                className="group relative rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] shadow-soft-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-soft-md"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-base font-semibold tracking-tight text-[var(--text-primary)]">
                        {form.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        {formatRelative(form.updatedAt)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Form actions" className="shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100">
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

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        FORM_STATUS_COLORS[form.status as keyof typeof FORM_STATUS_COLORS]?.bg,
                        FORM_STATUS_COLORS[form.status as keyof typeof FORM_STATUS_COLORS]?.text,
                        FORM_STATUS_COLORS[form.status as keyof typeof FORM_STATUS_COLORS]?.border,
                      )}
                    >
                      {FORM_STATUS_LABELS[form.status as keyof typeof FORM_STATUS_LABELS]}
                    </span>
                    <span className="text-xs tabular-nums text-[var(--text-muted)]">
                      {formatNumber(form.responseCount ?? 0)} responses
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

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
