"use client";

import { Fragment, useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Trash2, ChevronDown, ChevronUp, Mail, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button }      from "@/components/ui/button";
import { Skeleton }    from "@/components/ui/skeleton";
import { EmptyState }  from "@/components/shared/empty-state";
import { ErrorState }  from "@/components/shared/error-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { trpc }        from "@/lib/trpc";
import { buildCsv, downloadCsv, formatAnswerValue } from "@/lib/utils";

const PAGE_SIZE = 20;

export default function ResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  /* Deep link from the "View Response" email: ?response=<id> */
  const [expandedId, setExpandedId]   = useState<string | null>(searchParams.get("response"));
  const [deleteId,   setDeleteId]     = useState<string | null>(null);
  const [page,       setPage]         = useState(1);
  const [exporting,  setExporting]    = useState(false);

  const { data, isLoading, error, refetch } = trpc.forms.listResponses.useQuery(
    { formId: id, page, pageSize: PAGE_SIZE },
    { enabled: !!id },
  );
  const { data: form } = trpc.forms.get.useQuery({ formId: id }, { enabled: !!id });
  const fieldsById = useMemo(
    () => new Map(((form as any)?.fields ?? []).map((f: any) => [f.id, f])),
    [form],
  );

  /* Scroll the deep-linked response into view once it renders */
  useEffect(() => {
    const target = searchParams.get("response");
    if (target && data) document.getElementById(`response-${target}`)?.scrollIntoView({ block: "center" });
  }, [data, searchParams]);

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

  const responses  = data?.items ?? [];
  const total      = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="h-full overflow-y-auto px-4 py-6 sm:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] text-[var(--text-primary)]">Responses</h1>
            {data && (
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {total} response{total !== 1 ? "s" : ""} so far
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
          <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b border-[var(--border-muted)] px-4 py-3 last:border-b-0">
                <Skeleton className="h-5 w-2/3" />
              </div>
            ))}
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
            <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]">
              <table className="w-full table-fixed border-collapse text-left text-sm">
                <thead className="bg-[var(--bg-inset)]">
                  <tr className="border-b border-[var(--border-color)]">
                    <th scope="col" className="px-4 py-2.5 text-[13px] font-medium text-[var(--text-secondary)]">Respondent</th>
                    <th scope="col" className="hidden w-[170px] px-4 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] sm:table-cell">Submitted</th>
                    <th scope="col" className="hidden w-[100px] px-4 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] sm:table-cell">Time taken</th>
                    <th scope="col" className="w-[56px] px-4 py-2.5"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((res: any, i: number) => {
                    const isExpanded = expandedId === res.id;
                    const isLast     = i === responses.length - 1;
                    const submitted  = format(new Date(res.submittedAt), "MMM d, yyyy HH:mm");
                    const duration   = res.completionTimeMs ? `${Math.round(res.completionTimeMs / 1000)}s` : "—";
                    return (
                      <Fragment key={res.id}>
                        <tr
                          id={`response-${res.id}`}
                          aria-expanded={isExpanded}
                          className={`cursor-pointer transition-colors hover:bg-[var(--bg-inset)] ${isExpanded ? "bg-[var(--bg-inset)]" : ""} ${!isLast || isExpanded ? "border-b border-[var(--border-muted)]" : ""}`}
                          onClick={() => setExpandedId(isExpanded ? null : res.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex min-w-0 items-center gap-2">
                              {isExpanded
                                ? <ChevronUp   className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                                : <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />}
                              <div className="min-w-0">
                                <p className="truncate text-sm text-[var(--text-primary)]">
                                  {res.respondentEmail ?? <span className="text-[var(--text-muted)]">Anonymous</span>}
                                </p>
                                <p className="truncate text-xs text-[var(--text-muted)] sm:hidden">
                                  {submitted} · {duration}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 text-sm tabular-nums text-[var(--text-secondary)] sm:table-cell">
                            {submitted}
                          </td>
                          <td className="hidden px-4 py-3 text-sm tabular-nums text-[var(--text-secondary)] sm:table-cell">
                            {duration}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <button
                              type="button"
                              aria-label="Delete response"
                              onClick={(e) => { e.stopPropagation(); setDeleteId(res.id); }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <tr className={!isLast ? "border-b border-[var(--border-color)]" : ""}>
                              <td colSpan={4} className="p-0">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <dl className="divide-y divide-[var(--border-muted)] px-4 py-2 sm:px-10">
                                    {(res.answers ?? []).length === 0 && (
                                      <p className="py-3 text-sm text-[var(--text-muted)]">This response has no answers.</p>
                                    )}
                                    {(res.answers ?? []).map((ans: any) => {
                                      const field = fieldsById.get(ans.fieldId) as any;
                                      const text  = formatAnswerValue(field, ans.value);
                                      return (
                                        <div key={ans.id} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
                                          <dt className="text-[13px] text-[var(--text-muted)]">{field?.label ?? "Deleted field"}</dt>
                                          <dd className="whitespace-pre-wrap break-words text-sm text-[var(--text-primary)]">
                                            {text || <span className="text-[var(--text-muted)]">No answer</span>}
                                          </dd>
                                        </div>
                                      );
                                    })}
                                  </dl>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous page"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] transition-colors hover:bg-[var(--bg-inset)] disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next page"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] transition-colors hover:bg-[var(--bg-inset)] disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
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
            <DialogTitle>Delete response</DialogTitle>
            <DialogDescription>This permanently removes this response and all its answers. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="danger"
              loading={deleteMut.isPending}
              onClick={() => deleteId && deleteMut.mutate({ formId: id, responseId: deleteId })}
            >
              Delete response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

