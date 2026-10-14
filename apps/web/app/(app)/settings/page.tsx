"use client";

import { useState }       from "react";
import { useUser }        from "@clerk/nextjs";
import { motion }         from "framer-motion";
import { User, Palette, Bell } from "lucide-react";
import { AppShell }       from "@/components/layout/app-shell";
import { Switch }         from "@/components/ui/switch";
import { Label }          from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useThemeStore }  from "@/stores/theme-store";
import { cn }             from "@/lib/utils";

const COLOR_MODES = [
  { id: "light",  label: "Light" },
  { id: "dark",   label: "Dark"  },
  { id: "system", label: "System" },
] as const;

const CARD = "rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] shadow-soft-sm";

export default function SettingsPage() {
  const { user } = useUser();
  const { colorMode, setColorMode } = useThemeStore();

  return (
    <AppShell title="Settings">
      <div className="mx-auto w-full max-w-2xl">
        <Tabs defaultValue="profile">
          <TabsList className="mb-6 w-full overflow-x-auto sm:w-auto">
            <TabsTrigger value="profile" className="gap-1.5"><User className="h-3.5 w-3.5" /> Profile</TabsTrigger>
            <TabsTrigger value="appearance" className="gap-1.5"><Palette className="h-3.5 w-3.5" /> Appearance</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> Notifications</TabsTrigger>
          </TabsList>

          {/* ── Profile ──────────────────────────────────────────── */}
          <TabsContent value="profile">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn(CARD, "space-y-6 p-5 sm:p-6")}>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-display text-xl font-bold text-white">
                  {user?.firstName?.[0] ?? user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="font-display truncate text-base font-semibold tracking-tight text-[var(--text-primary)]">
                    {user?.fullName ?? "Anonymous"}
                  </p>
                  <p className="truncate text-sm text-[var(--text-muted)]">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                Profile information is managed through your account. Click the avatar in the top bar to update your name, email, or password.
              </p>

              <dl className="divide-y divide-[var(--border-muted)] rounded-lg border border-[var(--border-muted)] bg-[var(--bg-inset)]">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-[var(--text-muted)]">User ID</dt>
                  <dd className="min-w-0 truncate font-mono text-xs text-[var(--text-secondary)]">{user?.id}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-[var(--text-muted)]">Member since</dt>
                  <dd className="text-sm text-[var(--text-secondary)]">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </dd>
                </div>
              </dl>
            </motion.div>
          </TabsContent>

          {/* ── Appearance ───────────────────────────────────────── */}
          <TabsContent value="appearance">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn(CARD, "p-5 sm:p-6")}>
              <p className="mb-1 text-sm font-semibold text-[var(--text-primary)]">Color mode</p>
              <p className="mb-4 text-sm text-[var(--text-muted)]">Choose how FormCraft looks on this device.</p>
              <div role="radiogroup" aria-label="Color mode" className="grid grid-cols-3 gap-2 rounded-lg bg-[var(--bg-inset)] p-1">
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
                        "rounded-md py-2 text-sm font-medium transition-all duration-150",
                        selected
                          ? "bg-[var(--bg-panel)] text-[var(--color-accent)] shadow-soft-sm"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </TabsContent>

          {/* ── Notifications ────────────────────────────────────── */}
          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={CARD}>
              <div className="border-b border-[var(--border-muted)] px-5 py-4 sm:px-6">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Email notifications</p>
              </div>
              <div className="divide-y divide-[var(--border-muted)] px-5 sm:px-6">
                {[
                  { label: "New response",      desc: "Get an email every time someone submits your form.", defaultOn: true },
                  { label: "Weekly digest",     desc: "A weekly summary of all your form activity.",         defaultOn: false },
                  { label: "Milestone alerts",  desc: "Notify when a form hits 10, 100, 1000 responses.",   defaultOn: true },
                ].map(({ label, desc, defaultOn }) => {
                  const [on, setOn] = useState(defaultOn);
                  return (
                    <div key={label} className="flex items-center justify-between gap-4 py-4">
                      <div className="min-w-0">
                        <Label className="text-sm font-medium">{label}</Label>
                        <p className="mt-0.5 text-sm text-[var(--text-muted)]">{desc}</p>
                      </div>
                      <Switch checked={on} onCheckedChange={setOn} />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
