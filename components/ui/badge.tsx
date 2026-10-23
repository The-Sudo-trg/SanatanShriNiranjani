import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full font-bold", {
  variants: {
    variant: {
      live: "animate-pulse bg-red-600 px-2 py-0.5 text-[9px] text-white",
      verified: "bg-green-100 px-2 py-0.5 text-[9px] text-green-700",
      tag: "bg-amber-50 px-2 py-0.5 text-[10px] text-saffron",
      qr: "bg-saffron px-1 text-[8px] text-white",
      price: "rounded-lg bg-saffron px-2.5 py-1 text-xs text-white",
    },
  },
  defaultVariants: { variant: "tag" },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
