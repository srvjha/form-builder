"use client";

import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">FormBuilder</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </a>
        </nav>

        <div className="flex min-w-[140px] items-center justify-end gap-3">
          {isLoaded && (
            isSignedIn ? (
              <UserButton
                appearance={{ elements: { avatarBox: "h-8 w-8" } }}
              />
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button size="sm">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )
          )}
        </div>

      </div>
    </header>
  );
}
