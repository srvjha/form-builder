"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, Pencil, Undo2, Redo2, Globe, Lock } from "lucide-react";
import { Button }     from "@/components/ui/button";
import { cn }         from "@/lib/utils";
import { Skeleton }   from "@/components/ui/skeleton";
import { Sidebar }    from "@/components/layout/sidebar";
import { trpc }       from "@/lib/trpc";
import { ROUTES }     from "@/lib/constants";
import { useBuilderStore } from "@/stores/builder-store";
import { useStore } from "zustand";

const TABS = [
  { label: "Build",     seg: "edit"      },
  { label: "Design",    seg: "design"    },
  { label: "Responses", seg: "responses" },
  { label: "Analytics", seg: "analytics" },
  { label: "Share",     seg: "share"     },
  { label: "Settings",  seg: "settings"  },
];

/* Status pill: blue when live, neutral otherwise (one theme colour) */
const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  published: { label: "Published", className: "text-[var(--color-accent)] bg-[var(--color-accent-soft)] border-transparent" },
  draft:     { label: "Draft",     className: "text-[var(--text-secondary)] border-[var(--border-color)]" },
  closed:    { label: "Closed",    className: "text-[var(--text-muted)] border-[var(--border-color)]" },
  archived:  { label: "Archived",  className: "text-[var(--text-muted)] border-[var(--border-color)]" },
};

export default function FormEditorLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const router   = useRouter();

  const { data: form, isLoading, refetch } = trpc.forms.get.useQuery(
    { formId: id },
    { enabled: !!id },
  );

  const publishMutation   = trpc.forms.publish.useMutation({
    onSuccess: () => { toast.success("Published"); refetch(); },
    onError:   (e) => toast.error(e.message),
  });
  const unpublishMutation = trpc.forms.unpublish.useMutation({
    onSuccess: () => { toast.success("Unpublished"); refetch(); },
    onError:   (e) => toast.error(e.message),
  });

  const { isDirty, isSaving, previewMode, setPreviewMode } = useBuilderStore();
  const temporalStore = useStore(useBuilderStore.temporal);
  const canUndo = temporalStore.pastStates.length > 0;
  const canRedo = temporalStore.futureStates.length > 0;

  /* Active tab from pathname */
  const activeTab = TABS.find((t) => pathname.endsWith(t.seg))?.seg ?? "edit";

  const status = form ? (STATUS_STYLE[form.status] ?? STATUS_STYLE.draft!) : null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ── Header: title, state, actions, tabs ─────────────── */}
        <header className="shrink-0 border-b-1 border-[var(--border-color)] bg-[var(--bg-panel)]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 pb-2 pt-4 sm:px-6">
            {/* Title + status */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <h1 className="truncate font-display text-[28px] leading-[1.1] text-[var(--text-primary)]">
                  {form?.title ?? "Form"}
                </h1>
              )}
              {form && status && (
                <span
                  className={cn(
                    "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border-1 px-2.5 text-xs font-medium",
                    status.className,
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                  {status.label}
                </span>
              )}
              <span className="hidden shrink-0 text-xs text-[var(--text-muted)] sm:inline" aria-live="polite">
                {isSaving ? "Saving…" : isDirty ? "Unsaved changes" : ""}
              </span>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              {activeTab === "edit" && (
                <div className="hidden items-center md:flex">
                  <button
                    type="button"
                    onClick={() => temporalStore.undo()}
                    disabled={!canUndo}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Undo (⌘Z)"
                    aria-label="Undo"
                  >
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => temporalStore.redo()}
                    disabled={!canRedo}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Redo (⌘⇧Z)"
                    aria-label="Redo"
                  >
                    <Redo2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {activeTab === "edit" && (
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  aria-pressed={previewMode}
                  className={cn(
                    "flex h-9 items-center gap-1.5 rounded-md border-1 px-3 text-sm font-medium transition-colors",
                    previewMode
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      : "border-[var(--border-color)] bg-[var(--bg-panel)] text-[var(--text-primary)] hover:bg-[var(--bg-inset)]",
                  )}
                >
                  {previewMode ? <Pencil className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {previewMode ? "Edit" : "Preview"}
                </button>
              )}

              {form && (
                form.status === "published" ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={unpublishMutation.isPending}
                    onClick={() => unpublishMutation.mutate({ formId: id })}
                    className="h-9 gap-1.5 border-1 px-3 text-sm font-medium shadow-none"
                  >
                    <Lock className="h-4 w-4" /> Unpublish
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    loading={publishMutation.isPending}
                    onClick={() => publishMutation.mutate({ formId: id })}
                    className="h-9 gap-1.5 !bg-[var(--color-action)] px-4 text-sm font-medium !text-white shadow-none hover:!bg-[var(--color-action-hover)] hover:shadow-none hover:brightness-100"
                  >
                    <Globe className="h-4 w-4" /> Publish
                  </Button>
                )
              )}
            </div>
          </div>

          {/* ── Tabs: underline bar ───────────────────────────── */}
          <nav className="flex items-stretch gap-1 overflow-x-auto px-2 sm:px-4" aria-label="Form sections">
            {TABS.map(({ label, seg }) => {
              const isActive = activeTab === seg;
              return (
                <Link
                  key={seg}
                  href={`/forms/${id}/${seg}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex h-10 shrink-0 items-center px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="form-tab-indicator"
                      className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[var(--color-accent)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </header>

        {/* ── Content ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
