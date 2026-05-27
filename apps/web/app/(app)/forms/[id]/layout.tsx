"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Eye, Settings2, Undo2, Redo2, Zap, Globe, Lock,
  BarChart2, FileText, Share2, Wrench, Palette,
} from "lucide-react";
import { Button }     from "@/components/ui/button";
import { Badge }      from "@/components/ui/badge";
import { Skeleton }   from "@/components/ui/skeleton";
import { Sidebar }    from "@/components/layout/sidebar";
import { trpc }       from "@/lib/trpc";
import { ROUTES }     from "@/lib/constants";
import { useBuilderStore } from "@/stores/builder-store";
import { useStore } from "zustand";

const TABS = [
  { label: "Build",     icon: Wrench,    seg: "edit"      },
  { label: "Design",    icon: Palette,   seg: "design"    },
  { label: "Responses", icon: FileText,  seg: "responses" },
  { label: "Analytics", icon: BarChart2, seg: "analytics" },
  { label: "Share",     icon: Share2,    seg: "share"     },
  { label: "Settings",  icon: Settings2, seg: "settings"  },
];

const STATUS_VARIANT: Record<string, "published" | "draft" | "closed" | "archived"> = {
  published: "published", draft: "draft", closed: "closed", archived: "archived",
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
    onSuccess: () => { toast.success("Form published!"); refetch(); },
    onError:   (e) => toast.error(e.message),
  });
  const unpublishMutation = trpc.forms.unpublish.useMutation({
    onSuccess: () => { toast.success("Form unpublished."); refetch(); },
    onError:   (e) => toast.error(e.message),
  });

  const { isDirty, isSaving, previewMode, setPreviewMode } = useBuilderStore();
  const temporalStore = useStore(useBuilderStore.temporal);
  const canUndo = temporalStore.pastStates.length > 0;
  const canRedo = temporalStore.futureStates.length > 0;

  /* Active tab from pathname */
  const activeTab = TABS.find((t) => pathname.endsWith(t.seg))?.seg ?? "edit";

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-page)]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* ── Top bar ──────────────────────────────────────────── */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b-2 border-[#0A0A0A] bg-[var(--bg-panel)] px-4">
          {/* Form title + status */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-[#0A0A0A] bg-[var(--color-accent)]">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <h1 className="truncate font-display text-sm font-extrabold uppercase tracking-tight">
                {form?.title ?? "Form"}
              </h1>
            )}
            {form && (
              <Badge variant={STATUS_VARIANT[form.status] ?? "default"} dot className="shrink-0">
                {form.status}
              </Badge>
            )}
            {isDirty && !isSaving && (
              <span className="font-mono text-xs text-[var(--text-muted)] shrink-0">Unsaved</span>
            )}
            {isSaving && (
              <span className="font-mono text-xs text-[var(--color-yellow)] shrink-0">Saving…</span>
            )}
          </div>

          {/* Undo / redo — only shown on builder tab */}
          {activeTab === "edit" && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => temporalStore.undo()}
                disabled={!canUndo}
                className="flex h-8 w-8 items-center justify-center border-2 border-[#0A0A0A] bg-[var(--bg-panel)] disabled:opacity-30 hover:bg-[var(--bg-inset)] transition-colors"
                title="Undo (⌘Z)"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => temporalStore.redo()}
                disabled={!canRedo}
                className="flex h-8 w-8 items-center justify-center border-2 border-[#0A0A0A] bg-[var(--bg-panel)] disabled:opacity-30 hover:bg-[var(--bg-inset)] transition-colors"
                title="Redo (⌘⇧Z)"
              >
                <Redo2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Preview toggle */}
          {activeTab === "edit" && (
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex h-8 items-center gap-1.5 border-2 border-[#0A0A0A] px-3 font-display text-xs font-extrabold uppercase tracking-wider transition-colors ${
                previewMode ? "bg-[#0A0A0A] text-white" : "bg-[var(--bg-panel)] hover:bg-[var(--bg-inset)]"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              {previewMode ? "Editing" : "Preview"}
            </button>
          )}

          {/* Publish / unpublish */}
          {form && (
            form.status === "published" ? (
              <Button
                size="sm"
                variant="secondary"
                loading={unpublishMutation.isPending}
                onClick={() => unpublishMutation.mutate({ formId: id })}
                className="gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" /> Unpublish
              </Button>
            ) : (
              <Button
                size="sm"
                loading={publishMutation.isPending}
                onClick={() => publishMutation.mutate({ formId: id })}
                className="gap-1.5"
              >
                <Globe className="h-3.5 w-3.5" /> Publish
              </Button>
            )
          )}
        </header>

        {/* ── Tab navigation ───────────────────────────────────── */}
        <nav className="flex h-10 shrink-0 items-stretch border-b-2 border-[#0A0A0A] bg-[var(--bg-panel)]">
          {TABS.map(({ label, icon: Icon, seg }) => {
            const isActive = activeTab === seg;
            return (
              <Link
                key={seg}
                href={`/forms/${id}/${seg}`}
                className={`relative flex items-center gap-1.5 px-5 font-display text-xs font-extrabold uppercase tracking-wider transition-colors ${
                  isActive
                    ? "text-[var(--color-accent)] bg-[var(--bg-page)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inset)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="form-tab-indicator"
                    className="absolute bottom-0 inset-x-0 h-[3px] bg-[var(--color-accent)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Content ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
