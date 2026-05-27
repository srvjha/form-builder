"use client";

import { useParams } from "next/navigation";
import { useState }  from "react";
import { toast }     from "sonner";
import { Globe, Lock, Copy, Check } from "lucide-react";
import { Button }    from "@/components/ui/button";
import { Input }     from "@/components/ui/input";
import { Switch }    from "@/components/ui/switch";
import { Label }     from "@/components/ui/label";
import { Skeleton }  from "@/components/ui/skeleton";
import { trpc }      from "@/lib/trpc";
import { ROUTES }    from "@/lib/constants";

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const { data: form, isLoading, refetch } = trpc.forms.get.useQuery({ formId: id }, { enabled: !!id });
  const publishMutation   = trpc.forms.publish.useMutation({ onSuccess: () => { toast.success("Form published!"); refetch(); } });
  const unpublishMutation = trpc.forms.unpublish.useMutation({ onSuccess: () => { toast.success("Unpublished."); refetch(); } });
  const updateMutation    = trpc.forms.update.useMutation({ onSuccess: () => refetch() });

  const origin  = typeof window !== "undefined" ? window.location.origin : "";
  const formUrl = form ? `${origin}${ROUTES.publicForm(form.slug)}` : "";

  function copyLink() {
    navigator.clipboard.writeText(formUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Status */}
        <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md">
          <div className="border-b-2 border-[#0A0A0A] px-6 py-4">
            <p className="label-overline">Status</p>
          </div>
          <div className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {form?.status === "published"
                ? <Globe className="h-5 w-5 text-[var(--color-green)]" />
                : <Lock  className="h-5 w-5 text-[var(--text-muted)]" />}
              <div>
                <p className="font-display text-sm font-extrabold uppercase tracking-tight">
                  {form?.status === "published" ? "Live — accepting responses" : "Draft — not accepting responses"}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {form?.status === "published" ? "Anyone with the link can respond." : "Publish to make this form available."}
                </p>
              </div>
            </div>
            {isLoading ? <Skeleton className="h-9 w-28" /> : (
              form?.status === "published" ? (
                <Button size="sm" variant="secondary" loading={unpublishMutation.isPending} onClick={() => unpublishMutation.mutate({ formId: id })}>
                  <Lock className="h-3.5 w-3.5" /> Unpublish
                </Button>
              ) : (
                <Button size="sm" loading={publishMutation.isPending} onClick={() => publishMutation.mutate({ formId: id })}>
                  <Globe className="h-3.5 w-3.5" /> Publish
                </Button>
              )
            )}
          </div>
        </div>

        {/* Share link */}
        {form?.status === "published" && (
          <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md">
            <div className="border-b-2 border-[#0A0A0A] px-6 py-4">
              <p className="label-overline">Share link</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <Input value={formUrl} readOnly className="flex-1 font-mono text-xs" />
                <Button size="sm" variant="secondary" onClick={copyLink} className="gap-1.5 shrink-0">
                  {copied ? <Check className="h-3.5 w-3.5 text-[var(--color-green)]" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                Share this link to collect responses. Works on any device.
              </p>
            </div>
          </div>
        )}

        {/* Settings */}
        {form && (
          <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md">
            <div className="border-b-2 border-[#0A0A0A] px-6 py-4">
              <p className="label-overline">Response settings</p>
            </div>
            <div className="divide-y-2 divide-[var(--border-muted)] px-6">
              {[
                {
                  key: "oneResponsePerIp",
                  label: "One response per IP",
                  desc: "Prevent the same IP from submitting multiple times.",
                  val: !!form.settings?.oneResponsePerIp,
                },
                {
                  key: "showProgressBar",
                  label: "Show progress bar",
                  desc: "Display a progress indicator at the top while filling.",
                  val: !!form.settings?.showProgressBar,
                },
                {
                  key: "collectEmail",
                  label: "Collect email",
                  desc: "Ask for respondent email before the form.",
                  val: !!form.collectEmail,
                },
              ].map(({ key, label, desc, val }) => (
                <div key={key} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <Label className="text-sm font-semibold">{label}</Label>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
                  </div>
                  <Switch
                    checked={val}
                    onCheckedChange={(v) => {
                      if (key === "collectEmail") {
                        updateMutation.mutate({ formId: id, collectEmail: v });
                      } else {
                        updateMutation.mutate({ formId: id, settings: { ...form.settings, [key]: v } as any });
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
