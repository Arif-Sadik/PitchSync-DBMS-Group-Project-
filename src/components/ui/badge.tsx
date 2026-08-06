import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none", {
  variants: {
    variant: {
      default: "border-transparent bg-[var(--primary-soft)] text-[var(--primary)]",
      outline: "bg-white text-[var(--text-muted)]",
      planned: "border-[#eadfb8] bg-[#faf6e9] text-[#866d1e]",
      unavailable: "border-[#d5e1e7] bg-[#eff4f6] text-[var(--info)]",
      danger: "border-[#efcece] bg-[#faeeee] text-[var(--danger)]",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
