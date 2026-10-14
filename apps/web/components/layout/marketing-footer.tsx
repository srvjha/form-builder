import Link from "next/link";
import { APP_NAME, ROUTES } from "@/lib/constants";

/* Only routes that exist in the app */
const LINKS = [
  { label: "Explore public forms", href: ROUTES.explore },
  { label: "Create an account",    href: ROUTES.signUp },
  { label: "Sign in",              href: ROUTES.signIn },
];

const SOCIALS = [
  { label: "GitHub",      href: "https://github.com/srvjha" },
  { label: "X (Twitter)", href: "https://x.com/J_srv001" },
];

const linkCls =
  "text-[16px] underline decoration-transparent decoration-[0.07em] underline-offset-[0.25em] transition-[text-decoration-color] hover:decoration-current";

/* Continues the inverted closing field; the name returns at full width, cut by the bottom edge */
export function MarketingFooter() {
  return (
    <footer className="overflow-hidden bg-[var(--text-primary)] text-[var(--bg-page)]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="flex flex-col gap-10 pt-12 sm:flex-row sm:justify-between">
          <p className="max-w-[22rem] text-[16px] leading-relaxed">
            Forms, responses and analytics in one place, built by one developer.
          </p>
          <div className="flex gap-16">
            <ul className="space-y-3">
              {LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkCls}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {SOCIALS.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noreferrer" className={linkCls}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-16 text-[13px] opacity-70">
          © {new Date().getFullYear()} {APP_NAME}
        </p>

        {/* Same column and left edge as the text above; sized to fill it, cut only by the bottom edge */}
        <div aria-hidden className="mt-6 [container-type:inline-size]">
          <p className="select-none whitespace-nowrap font-display text-[23.5cqw] leading-[0.8] tracking-[-0.04em] [transform:translateY(18%)]">
            {APP_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
