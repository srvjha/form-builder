import Link from "next/link";
import { Zap } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  Product: [
    { label: "Features",  href: "/#features" },
    { label: "Explore",   href: ROUTES.explore },
  ],
  Company: [
    { label: "Privacy",  href: "/privacy" },
    { label: "Terms",    href: "/terms" },
    { label: "Contact",  href: "/contact" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="border-t-2 border-[var(--border-color)] bg-[var(--bg-page)]">
      <div className="mx-auto max-w-content px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={ROUTES.home} className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center bg-[var(--color-accent)] border-2 border-[var(--border-color)]">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-sm font-extrabold uppercase tracking-widest">
                {APP_NAME}
              </span>
            </Link>
            <p className="max-w-xs text-sm text-[var(--text-muted)] leading-relaxed">
              The form builder that doesn&apos;t apologise. Build, deploy, collect.
            </p>
            <div className="mt-5 flex gap-2">
              {/* GitHub */}
              <a
                href="https://github.com/srvjha"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center border-2 border-[var(--border-color)] hover:bg-[var(--bg-inset)] transition-colors"
                aria-label="GitHub"
              >
                {/* GitHub mark SVG */}
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.021C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="https://x.com/J_srv001"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center border-2 border-[var(--border-color)] hover:bg-[var(--bg-inset)] transition-colors"
                aria-label="X (Twitter)"
              >
                {/* X logo SVG */}
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="label-overline mb-4">{group}</h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Built with ♥ and no rounded corners.
          </p>
        </div>
      </div>
    </footer>
  );
}
