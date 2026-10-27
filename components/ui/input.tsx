import * as React from "react";
import { cn } from "@/lib/utils";

// DESIGN.md §5.2 pill/rounded inputs, amber borders
// Password-manager / form-filler extensions inject attributes (e.g.
// `fdprocessedid`) into inputs before hydration → suppress that warning only.
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      suppressHydrationWarning
      className={cn(
        "w-full rounded-xl border border-amber-200 bg-gray-50 px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron disabled:opacity-60",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
