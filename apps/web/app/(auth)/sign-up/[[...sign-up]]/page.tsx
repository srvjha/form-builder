import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/app/(auth)/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Start building.
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Free forever. No credit card required.
        </p>
      </div>
      <div className="w-full">
        <SignUp appearance={clerkAppearance} />
      </div>
    </div>
  );
}
