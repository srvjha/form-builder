"use client";

import { useId, useState } from "react";
import { useUser }        from "@clerk/nextjs";
import { AppShell }       from "@/components/layout/app-shell";
import { Switch }         from "@/components/ui/switch";
import { Label }          from "@/components/ui/label";
import { useThemeStore }  from "@/stores/theme-store";
import { cn }             from "@/lib/utils";

const COLOR_MODES = [
  { id: "light",  label: "Light" },
  { id: "dark",   label: "Dark"  },
  { id: "system", label: "System" },
] as const;

const NOTIFICATIONS = [
  { label: "New response",      desc: "Get an email every time someone submits your form.", defaultOn: true },
  { label: "Weekly digest",     desc: "A weekly summary of all your form activity.",         defaultOn: false },
  { label: "Milestone alerts",  desc: "Notify when a form hits 10, 100, 1000 responses.",   defaultOn: true },
] as const;

const PANEL = "rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)]";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8">
      <div>
        <h3 className="text-[15px] text-[var(--text-primary)]">{title}</h3>
        {description && <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/* One row per notification; owns its own state so hooks are never called inside a loop */
function NotificationRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
      <div className="min-w-0">
        <Label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)]">{label}</Label>
        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{desc}</p>
      </div>
      <Switch id={id} checked={on} onCheckedChange={setOn} />
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useUser();
  const { colorMode, setColorMode } = useThemeStore();

  return (
    <AppShell title="Settings">
      <div className="mx-auto w-full max-w-4xl space-y-10 pt-2">
        {/* ── Profile ──────────────────────────────────────────── */}
        <Section title="Profile" description="Managed through your account.">
          <div className={PANEL}>
            <div className="flex items-center gap-4 px-4 py-4 sm:px-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-lg font-semibold text-[var(--color-accent)]">
                {user?.firstName?.[0] ?? user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">
                  {user?.fullName ?? "Anonymous"}
                </p>
                <p className="truncate text-sm text-[var(--text-secondary)]">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            <dl className="divide-y divide-[var(--border-muted)] border-t border-[var(--border-muted)]">
              <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
                <dt className="shrink-0 text-sm text-[var(--text-secondary)]">User ID</dt>
                <dd className="min-w-0 truncate font-mono text-xs text-[var(--text-secondary)]">{user?.id}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
                <dt className="text-sm text-[var(--text-secondary)]">Member since</dt>
                <dd className="text-sm text-[var(--text-primary)]">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </dd>
              </div>
            </dl>

            <p className="border-t border-[var(--border-muted)] px-4 py-3 text-sm text-[var(--text-muted)] sm:px-5">
              To change your name, email or password, open the avatar menu in the top bar.
            </p>
          </div>
        </Section>

        {/* ── Appearance ───────────────────────────────────────── */}
        <Section title="Appearance" description="How FormCraft looks on this device.">
          <div className={cn(PANEL, "px-4 py-4 sm:px-5")}>
            <p id="color-mode-label" className="mb-3 text-sm font-medium text-[var(--text-primary)]">Color mode</p>
            <div
              role="radiogroup"
              aria-labelledby="color-mode-label"
              className="grid w-full grid-cols-3 gap-1 rounded-md border border-[var(--border-color)] bg-[var(--bg-inset)] p-1 sm:w-80"
            >
              {COLOR_MODES.map(({ id, label }) => {
                const selected = colorMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setColorMode(id)}
                    className={cn(
                      "h-8 rounded-[6px] text-sm font-medium transition-colors duration-150",
                      selected
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {colorMode === "system" && (
              <p className="mt-3 text-sm text-[var(--text-muted)]">Follows your operating system setting.</p>
            )}
          </div>
        </Section>

        {/* ── Notifications ────────────────────────────────────── */}
        <Section title="Notifications" description="Emails sent to your account address.">
          <div className={cn(PANEL, "divide-y divide-[var(--border-muted)]")}>
            {NOTIFICATIONS.map((n) => (
              <NotificationRow key={n.label} label={n.label} desc={n.desc} defaultOn={n.defaultOn} />
            ))}
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
