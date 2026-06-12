"use client";

import { SignIn } from "@clerk/nextjs";
import { useThemeStore } from "@/stores/theme-store";
import { clerkAppearanceDark, clerkAppearanceLight } from "@/app/(auth)/clerk-appearance";

export function ThemedClerkSignIn() {
  const resolved = useThemeStore((s) => s.resolved);
  return <SignIn appearance={resolved === "dark" ? clerkAppearanceDark : clerkAppearanceLight} />;
}
