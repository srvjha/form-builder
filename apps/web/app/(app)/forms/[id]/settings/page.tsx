"use client";

import { useParams }  from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Globe, Lock, Shuffle, UserCheck,
  ExternalLink, CalendarClock, Hash, Save, Link as LinkIcon,
} from "lucide-react";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch }   from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { trpc }     from "@/lib/trpc";

/* ── Tiny labelled field wrapper ────────────────────────────── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-extrabold uppercase tracking-wider">{label}</Label>
      {hint && <p className="text-xs text-[var(--text-muted)] -mt-1">{hint}</p>}
      {children}
    </div>
  );
}

/* ── Toggle row ─────────────────────────────────────────────── */
function ToggleRow({
  icon: Icon,
  label,
  desc,
  checked,
  onCheckedChange,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border-2 border-[#0A0A0A] bg-[var(--bg-inset)]">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div>
          <Label className="text-sm font-semibold">{label}</Label>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
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

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* ── Basics ───────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md">
            <div className="border-b-2 border-[#0A0A0A] px-6 py-4">
              <p className="label-overline">Form details</p>
            </div>
            <div className="space-y-5 p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-11" />)}
                </div>
              ) : (
                <>
                  <Field label="Title">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Untitled Form"
                    />
                  </Field>

                  <Field label="Description" hint="Shown to respondents at the top of the form.">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell respondents what this form is about…"
                      rows={3}
                    />
                  </Field>

                  <Field label="Custom URL slug" hint={`Public URL: ${typeof window !== "undefined" ? window.location.origin : ""}/f/${slug || "your-slug"}`}>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                      placeholder="my-awesome-form"
                      leftSlot={<LinkIcon className="h-4 w-4" />}
                      spellCheck={false}
                    />
                  </Field>

                  {/* Visibility */}
                  <Field label="Visibility" hint="Public forms appear on the /explore page.">
                    <div className="grid grid-cols-2 gap-0 border-2 border-[#0A0A0A]">
                      {(["unlisted", "public"] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setVisibility(v)}
                          className={`flex items-center justify-center gap-2 py-3 font-display text-xs font-extrabold uppercase tracking-wider border-r-2 border-[#0A0A0A] last:border-r-0 transition-colors ${
                            visibility === v
                              ? "bg-[#0A0A0A] text-white"
                              : "bg-[var(--bg-panel)] hover:bg-[var(--bg-inset)]"
                          }`}
                        >
                          {v === "public" ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                          {v}
                        </button>
                      ))}
                    </div>
                  </Field>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Submission behaviour ─────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
          <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md">
            <div className="border-b-2 border-[#0A0A0A] px-6 py-4">
              <p className="label-overline">After submission</p>
            </div>
            <div className="space-y-5 p-6">
              <Field
                label="Success message"
                hint="Shown on the confirmation screen after a successful submission."
              >
                <Textarea
                  value={successMessage}
                  onChange={(e) => setSuccessMessage(e.target.value)}
                  placeholder="Thank you! Your response has been recorded."
                  rows={2}
                />
              </Field>

              <Field
                label="Redirect URL"
                hint="Redirect to this URL instead of showing the success screen. Leave blank to show the default screen."
              >
                <Input
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://example.com/thank-you"
                  leftSlot={<ExternalLink className="h-4 w-4" />}
                />
              </Field>
            </div>
          </div>
        </motion.div>

        {/* ── Limits ───────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
          <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md">
            <div className="border-b-2 border-[#0A0A0A] px-6 py-4">
              <p className="label-overline">Limits</p>
            </div>
            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <Field
                label="Max responses"
                hint="Auto-close the form after this many responses. Leave blank for unlimited."
              >
                <Input
                  type="number"
                  min={1}
                  value={maxResponses}
                  onChange={(e) => setMaxResponses(e.target.value)}
                  placeholder="Unlimited"
                  leftSlot={<Hash className="h-4 w-4" />}
                />
              </Field>

              <Field
                label="Close at"
                hint="Automatically stop accepting responses after this date & time."
              >
                <Input
                  type="datetime-local"
                  value={closesAt}
                  onChange={(e) => setClosesAt(e.target.value)}
                  leftSlot={<CalendarClock className="h-4 w-4" />}
                />
              </Field>
            </div>
          </div>
        </motion.div>

        {/* ── Behaviour toggles ────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.15 }}>
          <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md">
            <div className="border-b-2 border-[#0A0A0A] px-6 py-4">
              <p className="label-overline">Behaviour</p>
            </div>
            <div className="divide-y-2 divide-[var(--border-muted)] px-6">
              <ToggleRow
                icon={Shuffle}
                label="Shuffle fields"
                desc="Randomise the order of questions for each respondent."
                checked={shuffleFields}
                onCheckedChange={setShuffleFields}
              />
              <ToggleRow
                icon={UserCheck}
                label="Require sign-in"
                desc="Respondents must be signed in with a FormCraft account to submit."
                checked={requireAuth}
                onCheckedChange={setRequireAuth}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Save button ──────────────────────────────────────── */}
        <div className="flex justify-end pb-4">
          <Button
            size="lg"
            loading={updateMut.isPending}
            onClick={handleSave}
            className="gap-2 shadow-brut-md"
          >
            <Save className="h-4 w-4" />
            Save settings
          </Button>
        </div>

      </div>
    </div>
  );
}
