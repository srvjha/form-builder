import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* Syne is only used by the Brutalist respondent theme */
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

const SITE_URL = "https://formcraft.srvjha.in";

export const metadata: Metadata = {
  title: {
    default: "FormCraft | Build forms and read every answer",
    template: "%s | FormCraft",
  },
  description:
    "Build a form in minutes, share one link, and see every response with readable labels and a funnel that shows where people stop.",
  keywords: ["form builder", "surveys", "analytics", "typeform alternative", "open source"],
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "FormCraft",
    title: "FormCraft | Build forms and read every answer",
    description: "Build a form in minutes, share one link, and read every answer.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@J_srv001",
    creator: "@J_srv001",
    title: "FormCraft | Build forms and read every answer",
    description: "Build a form in minutes, share one link, and read every answer.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable}`}
      >
        <head>
          {/* Gambarino (display) + General Sans (text), from Fontshare */}
          <link rel="preconnect" href="https://api.fontshare.com" />
          <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
          <link
            rel="stylesheet"
            href="https://api.fontshare.com/v2/css?f[]=gambarino@400&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap"
          />
          {/* Set light/dark before first paint so there is no flash */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var m=JSON.parse(localStorage.getItem("formcraft-theme")||"{}").state.colorMode;var d=m==="dark"||((m==null||m==="system")&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
            }}
          />
        </head>
        <body className="font-sans antialiased bg-page text-[var(--text-primary)]">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
