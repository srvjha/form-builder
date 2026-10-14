import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

/* The mark: a blue rounded square with a white lightning bolt.
   Same drawing as app/icon.svg (the favicon), so the tab and the page match. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("h-8 w-8 shrink-0", className)}>
      <rect width="32" height="32" rx="9" fill="#2563EB" />
      <path d="M18.6 5.5 9.4 17.4h6.1l-1.9 9.1 9.4-12.3h-6.2l1.8-8.7Z" fill="#FFFFFF" />
    </svg>
  );
}

/* Mark + wordmark lockup */
export function Logo({ className, markClassName, textClassName }: { className?: string; markClassName?: string; textClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className={cn("font-display text-[26px] leading-none tracking-[-0.02em] text-[var(--text-primary)]", textClassName)}>
        {APP_NAME}
      </span>
    </span>
  );
}
