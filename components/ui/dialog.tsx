"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// DESIGN.md §5.5 — Radix Dialog, overlay black/60, rounded-3xl sheet, ✕ top-right
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { scrollable?: boolean }
>(({ className, children, scrollable = false, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 space-y-3 rounded-3xl bg-white p-5 shadow-2xl focus:outline-none",
        scrollable && "max-h-[85vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Close
        aria-label="बंद करें"
        className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

export { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription };
