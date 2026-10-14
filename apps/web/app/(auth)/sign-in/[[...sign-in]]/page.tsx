import { ThemedClerkSignIn } from "@/app/(auth)/themed-clerk-sign-in";
import { GuestLoginButton } from "./guest-login-button";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Welcome back.
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Sign in to keep building.
        </p>
      </div>
      <div className="w-full">
        <ThemedClerkSignIn />
        <GuestLoginButton />
      </div>
    </div>
  );
}
