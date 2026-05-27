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
import { Badge } from "@/components/ui/badge";
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
import { ROUTES, FORM_STATUS_LABELS } from "@/lib/constants";
import { formatRelative, formatNumber } from "@/lib/utils";
import { useMascotStore } from "@/stores/mascot-store";

const statusVariant: Record<string, "published" | "draft" | "closed" | "archived"> = {
  published: "published",
  draft:     "draft",
  closed:    "closed",
  archived:  "archived",
};

export default function FormsPage() {
  const router = useRouter();
  const [search, setSearch]             = useState("");
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const { setState: setBrix, reset: resetBrix } = useMascotStore();

  const { data: forms, isLoading, error, refetch } = trpc.forms.list.useQuery();
  const deleteMutation = trpc.forms.delete.useMutation({
    onSuccess: () => {
      toast.success("Form deleted");
      setBrix("success", "One less form. Clean slate.");
      setTimeout(resetBrix, 3000);
      setDeleteId(null);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
      setBrix("error", "Something went wrong.");
      setTimeout(resetBrix, 3000);
    },
  });

  const cloneMutation = trpc.forms.clone.useMutation({
    onSuccess: (cloned) => {
      toast.success("Form duplicated!");
      setBrix("excited", "Copy incoming!");
      setTimeout(resetBrix, 2500);
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
      <div className="mb-6 flex items-center gap-3">
        <Input
          leftSlot={<Search className="h-4 w-4" />}
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        {forms && (
          <span className="font-mono text-xs text-[var(--text-muted)]">
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
            <Skeleton key={i} className="h-[160px]" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && filtered.length === 0 && (
        <EmptyState
          icon={<FileText className="h-8 w-8 text-[var(--text-muted)]" />}
          title={search ? "No forms match" : "No forms yet"}
          description={
            search
              ? `No forms found for "${search}". Try a different search.`
              : "Create your first form and start collecting responses."
          }
          action={
            !search
              ? { label: "+ Create Your First Form", onClick: () => router.push(ROUTES.formNew) }
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
                className="group relative border-2 border-[var(--border-color)] bg-[var(--bg-panel)] shadow-brut-md transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brut-xs"
              >
                {/* Color strip by status */}
                <div className={`h-1 w-full ${
                  form.status === "published" ? "bg-[var(--color-green)]" :
                  form.status === "draft"     ? "bg-[var(--color-yellow)]" :
                  form.status === "closed"    ? "bg-[var(--color-red)]" :
                  "bg-[var(--border-muted)]"
                }`} />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-base font-extrabold uppercase tracking-tight">
                        {form.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        {formatRelative(form.updatedAt)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="shrink-0 opacity-0 group-hover:opacity-100">
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
                    <Badge variant={statusVariant[form.status] ?? "default"} dot>
                      {FORM_STATUS_LABELS[form.status as keyof typeof FORM_STATUS_LABELS]}
                    </Badge>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
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
          if (!o) { setDeleteId(null); resetBrix(); }
          else setBrix("thinking", "You sure about that?");
        }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete Form</DialogTitle>
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
              Delete Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
