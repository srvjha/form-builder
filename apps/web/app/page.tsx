import { SignUpButton } from "@clerk/nextjs";
import {
  BarChart3,
  Shield,
  Zap,
  MousePointerClick,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Builder",
    description:
      "Drag and drop your way to a production-ready form in minutes. No coding required.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Every submission is encrypted. GDPR-compliant with built-in data retention controls.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Track completion rates, drop-offs, and responses as they happen with live dashboards.",
  },
  {
    icon: MousePointerClick,
    title: "One-click Integrations",
    description:
      "Connect to Slack, Notion, Google Sheets, Zapier, and 100+ tools instantly.",
  },
];

const highlights = [
  "No credit card required",
  "Up and running in 60 seconds",
  "Free tier includes 100 responses/mo",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl"
        />

        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Now with AI-powered field suggestions
          </Badge>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Build forms that
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}actually work
            </span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
            Create beautiful, high-converting forms in minutes. Collect data,
            analyse responses, and automate your workflow — all in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <SignUpButton mode="modal">
              <Button size="lg" className="gap-2">
                Start building for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SignUpButton>

            <Button variant="outline" size="lg">
              See a demo
            </Button>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="features"
        className="container mx-auto px-6 py-24"
      >
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-4 text-muted-foreground">
            Designed for teams that care about the details.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-border bg-muted/30 px-6 py-24"
      >
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              How it works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              From idea to live form in three steps
            </h2>
          </div>

          <ol className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your form",
                description:
                  "Pick a template or start blank. Add fields by dragging from the panel.",
              },
              {
                step: "02",
                title: "Customise & publish",
                description:
                  "Match your brand colours, set up logic, then hit publish. Your form gets a shareable link instantly.",
              },
              {
                step: "03",
                title: "Collect & analyse",
                description:
                  "Responses arrive in real-time. Export to CSV or forward to your tools automatically.",
              },
            ].map(({ step, title, description }) => (
              <li key={step} className="flex flex-col gap-3">
                <span className="text-4xl font-black text-primary/20">
                  {step}
                </span>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24 text-center">
        <div className="rounded-2xl bg-primary px-8 py-16 text-primary-foreground">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Ready to build your first form?
          </h2>
          <p className="mb-8 text-primary-foreground/80">
            Join thousands of teams already using FormBuilder. Free to start, no
            credit card needed.
          </p>

          <SignUpButton mode="modal">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 font-semibold"
            >
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SignUpButton>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <span className="text-[10px] font-bold text-primary-foreground">
                F
              </span>
            </div>
            FormBuilder
          </div>
          <p>© {new Date().getFullYear()} FormBuilder. All rights reserved.</p>
          <nav className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
