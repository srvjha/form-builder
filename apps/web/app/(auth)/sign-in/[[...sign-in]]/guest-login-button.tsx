"use client";

import { useSignIn, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserRound, Loader2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useThemeStore } from "@/stores/theme-store";

const GUEST_EMAIL = "test@gmail.com";
const GUEST_PASSWORD = "rDx6AbhUW49sTC5";

export function GuestLoginButton() {
  const { signIn, fetchStatus } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDark = useThemeStore((s) => s.resolved === "dark");

  async function handleGuestLogin() {
    if (!signIn) return;
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await signIn.password({
        identifier: GUEST_EMAIL,
        password: GUEST_PASSWORD,
      });
      if (signInError) {
        setError("Guest login failed. Please try again.");
        return;
      }
      if (signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
      }
      router.push(ROUTES.dashboard);
    } catch {
      setError("Guest login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#ccc]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#999]">or</span>
        <div className="h-px flex-1 bg-[#ccc]" />
      </div>

      <button
        onClick={handleGuestLogin}
        disabled={loading || fetchStatus === "fetching"}
        className={`flex w-full items-center justify-center gap-2 border-2 px-4 py-3 font-bold text-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-50 ${
          isDark
            ? "border-black/10 bg-[#141414] text-white shadow-[4px_4px_0_rgba(255,255,255,0.1)] hover:shadow-[2px_2px_0_rgba(255,255,255,0.1)]"
            : "border-black bg-white text-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000]"
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserRound className="h-4 w-4" />
        )}
        {loading ? "Signing in…" : "Continue as Guest"}
      </button>

      {error && (
        <p className="mt-2 font-mono text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
