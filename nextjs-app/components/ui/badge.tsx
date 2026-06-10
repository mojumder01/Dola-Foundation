import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#0F3D8C] text-white hover:bg-[#0b2e6a]",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        gold: "border-transparent bg-[#F4B400] text-[#1A1A2E]",
        green: "border-transparent bg-[#1F9D55] text-white",
        ongoing: "border-transparent bg-green-100 text-green-800",
        completed: "border-transparent bg-blue-100 text-blue-800",
        upcoming: "border-transparent bg-yellow-100 text-yellow-800",
        pending: "border-transparent bg-yellow-100 text-yellow-800",
        approved: "border-transparent bg-green-100 text-green-800",
        rejected: "border-transparent bg-red-100 text-red-800",
        active: "border-transparent bg-blue-100 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
