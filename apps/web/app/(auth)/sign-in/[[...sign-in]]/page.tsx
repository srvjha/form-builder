import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/app/(auth)/clerk-appearance";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full text-center mb-2">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight">
          Welcome back.
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Sign in to keep building.
        </p>
      </div>
      <div className="w-full">
        <SignIn appearance={clerkAppearance} />
      </div>
    </div>
  );
}
