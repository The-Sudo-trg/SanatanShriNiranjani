import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// DESIGN.md §5.6 button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-xl text-xs font-bold shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-saffron text-white hover:bg-deepSaffron",
        indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
        memorial: "bg-stone-800 text-white hover:bg-stone-900",
        nature: "bg-emerald-600 text-white hover:bg-emerald-700",
        ghost: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        amber: "bg-amber-600 text-white hover:bg-amber-700",
      },
      size: {
        default: "px-3 py-2.5",
        sm: "px-2.5 py-1",
        lg: "w-full py-2.5",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
