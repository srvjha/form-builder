import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

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

export const metadata: Metadata = {
  title: {
    default: "FormCraft — Build forms. Get answers.",
    template: "%s | FormCraft",
  },
  description:
    "Build production-grade forms, collect responses, and track analytics. Raw, honest, fast.",
  keywords: ["form builder", "surveys", "analytics", "typeform alternative"],
  openGraph: {
    type: "website",
    siteName: "FormCraft",
    title: "FormCraft — Build forms. Get answers.",
    description: "Build production-grade forms. No fluff.",
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
        <body className="font-sans antialiased bg-page text-[var(--text-primary)]">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
