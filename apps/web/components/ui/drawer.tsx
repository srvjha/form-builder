"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-[var(--z-modal)] bg-[var(--bg-overlay)]", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-[var(--z-modal)] flex flex-col",
        "w-full sm:max-w-[480px]",
        "bg-[var(--bg-panel)]",
        "border-l-[3px] border-[var(--border-color)]",
        "shadow-[-8px_0px_0px_var(--border-color)]",
        "focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, children, onClose, ...props }: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) => (
  <div
    className={cn(
      "flex items-center justify-between px-6 py-4",
      "border-b-2 border-[var(--border-color)]",
      "shrink-0",
      className,
    )}
    {...props}
  >
    <div className="flex-1">{children}</div>
    {onClose && (
      <button
        onClick={onClose}
        className={cn(
          "inline-flex items-center justify-center h-8 w-8 ml-4",
          "border-2 border-[var(--border-color)] rounded-none",
          "hover:bg-[var(--bg-inset)] transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]",
        )}
        aria-label="Close drawer"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn("text-base font-extrabold uppercase tracking-wide", className)}
    {...props}
  />
);

const DrawerBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto px-6 py-5", className)} {...props} />
);

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-end gap-3 px-6 py-4 shrink-0",
      "border-t-2 border-[var(--border-color)]",
      className,
    )}
    {...props}
  />
);

export {
  Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose,
  DrawerContent, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter,
};
