"use client";

import { useParams }  from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Globe, Lock, ExternalLink, CalendarClock, Hash, Save, Link as LinkIcon,
} from "lucide-react";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch }   from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { trpc }     from "@/lib/trpc";
import { cn }       from "@/lib/utils";

/* ── Setting row: label + description left, control right ──── */
function Row({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,320px)] sm:gap-8 sm:px-5">
      <div className="min-w-0">
        <Label htmlFor={htmlFor} className="text-sm font-medium text-[var(--text-primary)]">{label}</Label>
        {hint && <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-muted)]">{hint}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/* ── Toggle row: switch sits right, stays inline on phones ──── */
function ToggleRow({
  id,
  label,
  desc,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  desc: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-4 py-4 sm:px-5">
      <div className="min-w-0">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium text-[var(--text-primary)]">{label}</Label>
        <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-muted)]">{desc}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

/* ── A group: small heading above a solid panel of rows ────── */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 font-sans text-[13px] font-semibold leading-tight tracking-normal text-[var(--text-primary)]">
        {title}
      </h2>
      <div className="divide-y-1 divide-[var(--border-muted)] overflow-hidden rounded-xl border-1 border-[var(--border-color)] bg-[var(--bg-panel)]">
        {children}
      </div>
    </section>
  );
}

export default function FormSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const utils  = trpc.useUtils();

  const { data: form, isLoading, error, refetch } = trpc.forms.get.useQuery(
    { formId: id },
    { enabled: !!id },
  );

  const updateMut = trpc.forms.update.useMutation({
    onSuccess: () => {
      toast.success("Settings saved.");
      utils.forms.get.invalidate({ formId: id });
    },
    onError: (e) => toast.error(e.message),
  });

  /* ── Local state, seeded from server ─────────────────────── */
  const [title,          setTitle]          = useState("");
  const [description,    setDescription]    = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectUrl,    setRedirectUrl]    = useState("");
  const [maxResponses,   setMaxResponses]   = useState("");
  const [closesAt,       setClosesAt]       = useState("");
  const [slug,           setSlug]           = useState("");
  const [visibility,     setVisibility]     = useState<"public" | "unlisted">("unlisted");
  const [shuffleFields,  setShuffleFields]  = useState(false);
  const [requireAuth,    setRequireAuth]    = useState(false);

  /* Seed once data loads */
  useEffect(() => {
    if (!form) return;
    setTitle(form.title ?? "");
    setDescription(form.description ?? "");
    setSuccessMessage(form.successMessage ?? "");
    setRedirectUrl(form.redirectUrl ?? "");
    setMaxResponses(form.maxResponses != null ? String(form.maxResponses) : "");
    setClosesAt(
      form.closesAt
        ? new Date(form.closesAt).toISOString().slice(0, 16) // yyyy-MM-ddTHH:mm
        : "",
    );
    setSlug(form.slug ?? "");
    setVisibility(form.visibility ?? "unlisted");
    setShuffleFields(!!form.settings?.shuffleFields);
    setRequireAuth(!!form.settings?.requireAuth);
  }, [form?.id]);

  function handleSave() {
    const slugValue = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    updateMut.mutate({
      formId: id,
      title:          title.trim() || "Untitled Form",
      description:    description.trim() || undefined,
      successMessage: successMessage.trim() || undefined,
      redirectUrl:    redirectUrl.trim() || undefined,
      maxResponses:   maxResponses ? Number(maxResponses) : undefined,
      closesAt:       closesAt ? new Date(closesAt).toISOString() : undefined,
      slug:           slugValue || undefined,
      visibility,
      settings: {
        shuffleFields,
        requireAuth,
        // preserve the other settings from the server
        showProgressBar:  form?.settings?.showProgressBar  ?? true,
        oneResponsePerIp: form?.settings?.oneResponsePerIp ?? false,
        maxFields:        (form?.settings as any)?.maxFields ?? 20,
      },
    });
  }

  if (error) return <div className="p-6"><ErrorState description={error.message} onRetry={refetch} /></div>;

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="h-full overflow-y-auto px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* ── Details ──────────────────────────────────────────── */}
        <Group title="Form details">
          {isLoading ? (
            <div className="space-y-3 p-4 sm:p-5">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : (
            <>
              <Row label="Title" htmlFor="set-title">
                <Input
                  id="set-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled form"
                />
              </Row>

              <Row label="Description" hint="Shown to respondents at the top of the form." htmlFor="set-desc">
                <Textarea
                  id="set-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell respondents what this form is about"
                  rows={3}
                />
              </Row>

              <Row
                label="Link"
                htmlFor="set-slug"
                hint={<>Public address: <span className="break-all font-mono text-[var(--text-secondary)]">{origin}/f/{slug || "your-slug"}</span></>}
              >
                <Input
                  id="set-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  placeholder="my-form"
                  leftSlot={<LinkIcon className="h-4 w-4" />}
                  spellCheck={false}
                />
              </Row>

              <Row label="Visibility" hint="Public forms appear on the Explore page. Unlisted forms open only from their link.">
                <div className="grid grid-cols-2 gap-1 rounded-md bg-[var(--bg-inset)] p-1" role="radiogroup" aria-label="Visibility">
                  {(["unlisted", "public"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={visibility === v}
                      onClick={() => setVisibility(v)}
                      className={cn(
                        "flex h-8 items-center justify-center gap-1.5 rounded-[6px] text-sm font-medium transition-colors",
                        visibility === v
                          ? "bg-[var(--bg-panel)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                      )}
                    >
                      {v === "public" ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      {v === "public" ? "Public" : "Unlisted"}
                    </button>
                  ))}
                </div>
              </Row>
            </>
          )}
        </Group>

        {/* ── After submission ─────────────────────────────────── */}
        <Group title="After someone submits">
          <Row label="Success message" hint="Shown on the confirmation screen." htmlFor="set-success">
            <Textarea
              id="set-success"
              value={successMessage}
              onChange={(e) => setSuccessMessage(e.target.value)}
              placeholder="Thank you! Your response has been recorded."
              rows={2}
            />
          </Row>

          <Row label="Redirect URL" hint="Send people here instead of the confirmation screen. Leave blank to show the screen." htmlFor="set-redirect">
            <Input
              id="set-redirect"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://example.com/thank-you"
              leftSlot={<ExternalLink className="h-4 w-4" />}
            />
          </Row>
        </Group>

        {/* ── Limits ───────────────────────────────────────────── */}
        <Group title="Limits">
          <Row label="Max responses" hint="Close the form after this many responses. Leave blank for no limit." htmlFor="set-max">
            <Input
              id="set-max"
              type="number"
              min={1}
              value={maxResponses}
              onChange={(e) => setMaxResponses(e.target.value)}
              placeholder="No limit"
              leftSlot={<Hash className="h-4 w-4" />}
            />
          </Row>

          <Row label="Close on" hint="Stop accepting responses after this date and time." htmlFor="set-close">
            <Input
              id="set-close"
              type="datetime-local"
              value={closesAt}
              onChange={(e) => setClosesAt(e.target.value)}
              leftSlot={<CalendarClock className="h-4 w-4" />}
            />
          </Row>
        </Group>

        {/* ── Behaviour toggles ────────────────────────────────── */}
        <Group title="Behaviour">
          <ToggleRow
            id="set-shuffle"
            label="Shuffle fields"
            desc="Show the questions in a random order for each respondent."
            checked={shuffleFields}
            onCheckedChange={setShuffleFields}
          />
          <ToggleRow
            id="set-auth"
            label="Require sign-in"
            desc="Respondents must sign in with a FormCraft account to submit."
            checked={requireAuth}
            onCheckedChange={setRequireAuth}
          />
        </Group>

        {/* ── Save ─────────────────────────────────────────────── */}
        <div className="flex justify-end pb-6">
          <Button
            loading={updateMut.isPending}
            onClick={handleSave}
            className="h-10 w-full gap-2 !bg-[var(--color-action)] px-5 text-sm font-medium !text-white shadow-none hover:!bg-[var(--color-action-hover)] hover:shadow-none hover:brightness-100 sm:w-auto"
          >
            <Save className="h-4 w-4" />
            Save settings
          </Button>
        </div>

      </div>
    </div>
  );
}
