import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-page)] bg-dot-grid px-6">
      <div className="w-full max-w-md border-4 border-[#0A0A0A] bg-[var(--bg-panel)] shadow-[8px_8px_0_#0A0A0A]">
        {/* Accent stripe */}
        <div className="h-2 w-full bg-[#FF3B00]" />

        <div className="p-10 text-center">
          {/* Giant 404 */}
          <p
            aria-hidden
            className="pointer-events-none select-none font-display text-[9rem] font-black leading-none tracking-tighter text-[var(--border-muted)] opacity-20"
          >
            404
          </p>

          <div className="-mt-6">
            <Zap className="mx-auto mb-4 h-10 w-10 text-[#FF3B00]" />
            <h1 className="font-display text-2xl font-black uppercase tracking-tight">
              Page Not Found
            </h1>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              That page doesn&apos;t exist — or maybe it never did. Either way, it&apos;s not here.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#0A0A0A] bg-[#0A0A0A] px-5 py-2.5 font-display text-xs font-extrabold uppercase tracking-wider text-white shadow-[3px_3px_0_#FF3B00] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#FF3B00]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Go Home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#0A0A0A] bg-[var(--bg-panel)] px-5 py-2.5 font-display text-xs font-extrabold uppercase tracking-wider shadow-[3px_3px_0_#0A0A0A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#0A0A0A]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
