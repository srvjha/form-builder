"use client";

import { useState }       from "react";
import { useUser }        from "@clerk/nextjs";
import { motion }         from "framer-motion";
import { User, Palette, Bell, Shield } from "lucide-react";
import { AppShell }       from "@/components/layout/app-shell";
import { Button }         from "@/components/ui/button";
import { Input }          from "@/components/ui/input";
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

export default function SettingsPage() {
  const { user } = useUser();
  const { colorMode, setColorMode } = useThemeStore();

  return (
    <AppShell title="Settings">
      <div className="mx-auto max-w-2xl">
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile"  className="gap-1.5"><User    className="h-3.5 w-3.5" /> Profile</TabsTrigger>
            <TabsTrigger value="appearance" className="gap-1.5"><Palette className="h-3.5 w-3.5" /> Appearance</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> Notifications</TabsTrigger>
          </TabsList>

          {/* ── Profile ──────────────────────────────────────────── */}
          <TabsContent value="profile">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] p-6 shadow-brut-md space-y-5">
                <div className="flex items-center gap-4 border-b-2 border-[var(--border-muted)] pb-5">
                  <div className="flex h-14 w-14 items-center justify-center border-2 border-[#0A0A0A] bg-[var(--color-accent)] font-display text-xl font-black text-white">
                    {user?.firstName?.[0] ?? user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="font-display text-base font-extrabold uppercase tracking-tight">
                      {user?.fullName ?? "Anonymous"}
                    </p>
                    <p className="font-mono text-xs text-[var(--text-muted)]">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                <p className="font-mono text-xs text-[var(--text-muted)]">
                  Profile information is managed through Clerk. Click the avatar in the top bar to update your name, email, or password.
                </p>

                <div className="border-2 border-[var(--border-muted)] bg-[var(--bg-inset)] p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-mono text-xs text-[var(--text-muted)]">User ID</span>
                    <span className="font-mono text-xs truncate max-w-[200px]">{user?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-xs text-[var(--text-muted)]">Member since</span>
                    <span className="font-mono text-xs">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ── Appearance ───────────────────────────────────────── */}
          <TabsContent value="appearance">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] p-6 shadow-brut-md">
                <p className="label-overline mb-5">Color mode</p>
                <div className="grid grid-cols-3 gap-0 border-2 border-[#0A0A0A]">
                  {COLOR_MODES.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setColorMode(id)}
                      className={cn(
                        "py-3 font-display text-xs font-extrabold uppercase tracking-wider border-r-2 border-[#0A0A0A] last:border-r-0 transition-colors",
                        colorMode === id
                          ? "bg-[#0A0A0A] text-white"
                          : "bg-[var(--bg-panel)] hover:bg-[var(--bg-inset)]",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 border-t-2 border-[var(--border-muted)] pt-5">
                  <p className="label-overline mb-3">Theme</p>
                  <div className="border-2 border-[var(--border-muted)] bg-[var(--bg-inset)] p-4">
                    <p className="font-display text-sm font-extrabold uppercase tracking-tight">Brutalist</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Raw concrete aesthetic. Zero rounded corners. Offset shadows. The only theme you need.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ── Notifications ────────────────────────────────────── */}
          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="border-2 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-brut-md">
                <div className="border-b-2 border-[#0A0A0A] px-6 py-4">
                  <p className="label-overline">Email notifications</p>
                </div>
                <div className="divide-y-2 divide-[var(--border-muted)] px-6">
                  {[
                    { label: "New response",      desc: "Get an email every time someone submits your form.", defaultOn: true },
                    { label: "Weekly digest",     desc: "A weekly summary of all your form activity.",         defaultOn: false },
                    { label: "Milestone alerts",  desc: "Notify when a form hits 10, 100, 1000 responses.",   defaultOn: true },
                  ].map(({ label, desc, defaultOn }) => {
                    const [on, setOn] = useState(defaultOn);
                    return (
                      <div key={label} className="flex items-center justify-between gap-4 py-4">
                        <div>
                          <Label className="text-sm font-semibold">{label}</Label>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
                        </div>
                        <Switch checked={on} onCheckedChange={setOn} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
