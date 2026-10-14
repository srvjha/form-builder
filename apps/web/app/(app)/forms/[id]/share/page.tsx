"use client";

import { useParams } from "next/navigation";
import { useState, useRef }  from "react";
import { toast }     from "sonner";
import { Globe, Lock, Copy, Check, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button }    from "@/components/ui/button";
import { Input }     from "@/components/ui/input";
import { Switch }    from "@/components/ui/switch";
import { Label }     from "@/components/ui/label";
import { Skeleton }  from "@/components/ui/skeleton";
import { trpc }      from "@/lib/trpc";
import { ROUTES }    from "@/lib/constants";

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const [copied,       setCopied]       = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  const { data: form, isLoading, refetch } = trpc.forms.get.useQuery({ formId: id }, { enabled: !!id });
  const publishMutation   = trpc.forms.publish.useMutation({ onSuccess: () => { toast.success("Form published"); refetch(); } });
  const unpublishMutation = trpc.forms.unpublish.useMutation({ onSuccess: () => { toast.success("Form unpublished"); refetch(); } });
  const updateMutation    = trpc.forms.update.useMutation({ onSuccess: () => refetch() });

  const origin  = typeof window !== "undefined" ? window.location.origin : "";
  const formUrl = form ? `${origin}${ROUTES.publicForm(form.slug)}` : "";

  const embedCode = form
    ? `<iframe\n  src="${formUrl}"\n  width="100%"\n  height="650"\n  frameborder="0"\n  style="border:1px solid #E4E4E7;border-radius:12px;"\n  title="${form.title}"\n></iframe>`
    : "";

  function copyLink() {
    navigator.clipboard.writeText(formUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyEmbed() {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  }

  function downloadQr() {
    const svg = qrRef.current;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${form?.slug ?? id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("QR code downloaded");
  }


  const isPublished = form?.status === "published";

  return (
    <div className="h-full overflow-y-auto px-4 py-6 sm:p-8">
      <div className="mx-auto max-w-2xl space-y-6">

        <h1 className="text-[32px] text-[var(--text-primary)]">Share</h1>

        {/* ── Status ─────────────────────────────────────────── */}
        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6">
            <div className="flex min-w-0 items-start gap-3">
              {isPublished
                ? <Globe className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" />
                : <Lock  className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-muted)]" />}
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[15px] font-semibold text-[var(--text-primary)]">
                  {isPublished ? "Live" : "Draft"}
                  {isPublished && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-green)]" aria-hidden />}
                </p>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                  {isPublished ? "Anyone with the link can respond." : "Publish to start accepting responses."}
                </p>
              </div>
            </div>
            {isLoading ? <Skeleton className="h-9 w-28" /> : (
              isPublished ? (
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
        </section>

        {/* ── Link, QR code and embed ─────────────────────────── */}
        {isPublished && (
          <section className="divide-y divide-[var(--border-muted)] rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]">

            {/* Link */}
            <div className="space-y-3 p-4 sm:p-6">
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Public link</h3>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Send this to anyone you want to hear from.</p>
              </div>
              <div className="flex gap-2">
                <Input
                  value={formUrl}
                  readOnly
                  aria-label="Public form link"
                  onFocus={(e) => e.currentTarget.select()}
                  className="min-w-0 flex-1 font-mono text-[13px]"
                />
                <Button size="sm" onClick={copyLink} className="shrink-0 gap-1.5">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy link"}
                </Button>
              </div>
            </div>

            {/* QR code */}
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
              <div className="w-fit shrink-0 rounded-md border border-[var(--border-color)] bg-white p-3">
                <QRCodeSVG
                  ref={qrRef}
                  value={formUrl}
                  size={140}
                  bgColor="#FFFFFF"
                  fgColor="#0A0A0A"
                  level="M"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">QR code</h3>
                  <p className="mt-0.5 max-w-sm text-sm text-[var(--text-secondary)]">
                    Scan to open the form on any device. Print it, put it on a slide, or add it to a poster.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={downloadQr}
                  className="w-fit gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download SVG
                </Button>
              </div>
            </div>

            {/* Embed */}
            <div className="space-y-3 p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">Embed on your site</h3>
                  <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                    Paste this snippet into any web page to show the form inline.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={copyEmbed}
                  className="shrink-0 gap-1.5"
                >
                  {copiedEmbed
                    ? <><Check className="h-3.5 w-3.5" /> Copied</>
                    : <><Copy className="h-3.5 w-3.5" /> Copy code</>}
                </Button>
              </div>
              <pre className="max-w-full overflow-x-auto rounded-md border border-[var(--border-color)] bg-[var(--bg-inset)] p-4 font-mono text-[12px] leading-relaxed text-[var(--text-primary)]"><code>{embedCode}</code></pre>
            </div>
          </section>
        )}

        {/* ── Response settings ──────────────────────────────── */}
        {form && (
          <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]">
            <h3 className="px-4 pt-4 text-[15px] font-semibold text-[var(--text-primary)] sm:px-6 sm:pt-5">Response settings</h3>
            <div className="divide-y divide-[var(--border-muted)] px-4 sm:px-6">
              {[
                {
                  key: "oneResponsePerIp",
                  label: "One response per IP",
                  desc: "Stop the same IP address from submitting more than once.",
                  val: !!form.settings?.oneResponsePerIp,
                },
                {
                  key: "showProgressBar",
                  label: "Show progress bar",
                  desc: "Show respondents how far through the form they are.",
                  val: !!form.settings?.showProgressBar,
                },
                {
                  key: "collectEmail",
                  label: "Collect email",
                  desc: "Ask for the respondent's email before the form.",
                  val: !!form.collectEmail,
                },
              ].map(({ key, label, desc, val }) => (
                <div key={key} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <Label htmlFor={`setting-${key}`} className="text-sm font-medium text-[var(--text-primary)]">{label}</Label>
                    <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{desc}</p>
                  </div>
                  <Switch
                    id={`setting-${key}`}
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
          </section>
        )}
      </div>
    </div>
  );
}
