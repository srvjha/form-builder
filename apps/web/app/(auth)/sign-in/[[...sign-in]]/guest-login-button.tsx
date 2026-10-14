"use client";

import { useSignIn, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserRound, Loader2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const GUEST_EMAIL = "test@gmail.com";
const GUEST_PASSWORD = "rDx6AbhUW49sTC5";

export function GuestLoginButton() {
  const { signIn, fetchStatus } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border-color)]" />
        <span className="text-xs text-[var(--text-muted)]">or</span>
        <div className="h-px flex-1 bg-[var(--border-color)]" />
      </div>

      <button
        onClick={handleGuestLogin}
        disabled={loading || fetchStatus === "fetching"}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-panel)] px-4 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-inset)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserRound className="h-4 w-4" />
        )}
        {loading ? "Signing in…" : "Continue as guest"}
      </button>

      {error && (
        <p role="alert" className="text-xs text-[var(--color-red)]">{error}</p>
      )}
    </div>
  );
}
