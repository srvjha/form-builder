"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Trash2, ChevronDown, ChevronUp, Mail, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button }      from "@/components/ui/button";
import { Badge }       from "@/components/ui/badge";
import { Skeleton }    from "@/components/ui/skeleton";
import { EmptyState }  from "@/components/shared/empty-state";
import { ErrorState }  from "@/components/shared/error-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { trpc }        from "@/lib/trpc";
import { buildCsv, downloadCsv } from "@/lib/utils";

const PAGE_SIZE = 20;

export default function ResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [deleteId,   setDeleteId]     = useState<string | null>(null);
  const [page,       setPage]         = useState(1);
  const [exporting,  setExporting]    = useState(false);

  const { data, isLoading, error, refetch } = trpc.forms.listResponses.useQuery(
    { formId: id, page, pageSize: PAGE_SIZE },
    { enabled: !!id },
  );
  const deleteMut = trpc.forms.deleteResponse.useMutation({
    onSuccess: () => { toast.success("Response deleted"); setDeleteId(null); refetch(); },
    onError:   (e) => toast.error(e.message),
  });

  /* tRPC export query (lazy — only runs when we call refetch()) */
  const exportQuery = trpc.forms.exportResponses.useQuery(
    { formId: id },
    { enabled: false },
  );

  async function handleExport() {
    setExporting(true);
    try {
      const result = await exportQuery.refetch();
      if (!result.data) { toast.error("Export failed"); return; }
      const { fields, responses } = result.data as any;
      const csv = buildCsv(fields, responses);
      downloadCsv(`responses-${id.slice(0, 8)}.csv`, csv);
      toast.success(`Exported ${responses.length} response${responses.length !== 1 ? "s" : ""}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Export failed");
    } finally {
      setExporting(false);
    }
  }

  const responses  = data?.responses ?? [];
  const total      = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="label-overline mb-1">Responses</p>
            {data && (
              <p className="font-mono text-xs text-[var(--text-muted)]">
                {total} total response{total !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {total > 0 && (
            <Button
              size="sm"
              variant="secondary"
              disabled={exporting}
              onClick={handleExport}
              className="gap-1.5"
            >
              {exporting
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Download className="h-3.5 w-3.5" />}
              Export CSV
            </Button>
          )}
        </div>

        {/* Error */}
        {error && <ErrorState description={error.message} onRetry={refetch} />}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && responses.length === 0 && (
          <EmptyState
            icon={<Mail className="h-8 w-8 text-[var(--text-muted)]" />}
            title="No responses yet"
            description="Share your form link to start collecting responses."
          />
        )}

        {/* Responses */}
        {!isLoading && responses.length > 0 && (
          <>
            <div className="border-2 border-[#0A0A0A]">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_160px_120px_80px] gap-4 border-b-2 border-[#0A0A0A] bg-[#0A0A0A] px-4 py-2.5">
                <span className="font-display text-xs font-extrabold uppercase tracking-wider text-white">Respondent</span>
                <span className="font-display text-xs font-extrabold uppercase tracking-wider text-white">Submitted</span>
                <span className="font-display text-xs font-extrabold uppercase tracking-wider text-white">Duration</span>
                <span className="font-display text-xs font-extrabold uppercase tracking-wider text-white">Actions</span>
              </div>

              {responses.map((res: any, i: number) => {
                const isExpanded = expandedId === res.id;
                return (
                  <div key={res.id} className={i < responses.length - 1 ? "border-b-2 border-[#0A0A0A]" : ""}>
                    <div
                      className="grid grid-cols-[1fr_160px_120px_80px] cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-[var(--bg-inset)]"
                      onClick={() => setExpandedId(isExpanded ? null : res.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isExpanded
                          ? <ChevronUp   className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" />
                          : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />}
                        <span className="truncate font-mono text-xs">
                          {res.respondentEmail ?? <span className="text-[var(--text-muted)]">Anonymous</span>}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {format(new Date(res.submittedAt), "MMM d, yyyy HH:mm")}
                      </span>
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {res.completionTimeMs ? `${Math.round(res.completionTimeMs / 1000)}s` : "—"}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteId(res.id); }}
                        className="flex h-7 w-7 items-center justify-center border-2 border-[#0A0A0A] hover:bg-[var(--color-red)] hover:text-white transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t-2 border-dashed border-[var(--border-muted)]"
                        >
                          <div className="grid gap-4 p-6 sm:grid-cols-2">
                            {(res.answers ?? []).map((ans: any) => (
                              <div key={ans.id} className="border-2 border-[var(--border-muted)] bg-[var(--bg-inset)] p-4">
                                <p className="label-overline mb-1.5 text-[var(--text-muted)]">{ans.field?.label ?? "Field"}</p>
                                <p className="text-sm font-semibold text-[var(--text-primary)] break-words">
                                  {Array.isArray(ans.value)
                                    ? ans.value.join(", ")
                                    : (ans.value || <span className="italic text-[var(--text-muted)]">No answer</span>)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center border-2 border-[#0A0A0A] bg-[var(--bg-panel)] disabled:opacity-30 hover:bg-[var(--bg-inset)] transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center border-2 border-[#0A0A0A] bg-[var(--bg-panel)] disabled:opacity-30 hover:bg-[var(--bg-inset)] transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete Response</DialogTitle>
            <DialogDescription>This permanently removes this response and all its answers. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="danger"
              loading={deleteMut.isPending}
              onClick={() => deleteId && deleteMut.mutate({ formId: id, responseId: deleteId })}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
