import Link from "next/link";
import { ArrowUpRight, Zap } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";

/* Only routes that exist in the app */
const FOOTER_LINKS = {
  Product: [
    { label: "Features",     href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Explore",      href: ROUTES.explore },
  ],
  "Get started": [
    { label: "Create an account", href: ROUTES.signUp },
    { label: "Sign in",           href: ROUTES.signIn },
    { label: "Dashboard",         href: ROUTES.dashboard },
  ],
};

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/srvjha",
    path: "M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.021C22 6.484 17.522 2 12 2z",
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/J_srv001",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

export function MarketingFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-[var(--border-muted)] bg-[var(--bg-panel)]">
      {/* soft glow along the top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[720px] -translate-x-1/2 rounded-full bg-[var(--color-accent)] opacity-[0.12] blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href={ROUTES.home} className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-gradient shadow-soft-sm">
                <Zap className="h-4 w-4 fill-[var(--color-highlight)] text-[var(--color-highlight)]" />
              </span>
              <span className="text-base font-semibold tracking-tight text-[var(--text-primary)]">{APP_NAME}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
              Build a form, share the link, and read every answer — with analytics that show where people drop off.
            </p>

            <Link
              href={ROUTES.signUp}
              className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-highlight)] px-4 py-2 text-sm font-semibold text-[var(--color-highlight-text)] shadow-soft-sm transition-transform hover:-translate-y-0.5"
            >
              Start building free
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{group}</h3>
              <ul className="mt-4 space-y-3">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      {label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[var(--border-muted)] py-6 sm:flex-row sm:items-center">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-2">
            {SOCIALS.map(({ label, href, path }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-muted)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized wordmark, cropped at the bottom edge */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.22em] text-center text-[17vw] font-bold leading-none tracking-tighter text-brand-gradient opacity-[0.14] md:text-[15vw]">
          {APP_NAME}
        </p>
      </div>
    </footer>
  );
}
