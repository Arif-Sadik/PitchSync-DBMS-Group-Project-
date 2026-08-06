import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none", {
  variants: {
    variant: {
      default: "border-transparent bg-[var(--primary-soft)] text-[var(--primary)]",
      outline: "bg-[var(--surface)] text-[var(--text-muted)]",
      unavailable: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-secondary)]",
      danger: "border-[#efc8ce] bg-[var(--bd-red-soft)] text-[var(--bd-red-deep)]",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
