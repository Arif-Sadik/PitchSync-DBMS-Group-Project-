import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-10 w-full rounded-[10px] border bg-[var(--surface)] px-3 text-sm text-[var(--text)] shadow-[0_1px_1px_rgba(6,61,50,.03)] outline-none transition placeholder:text-[#87938D] focus:border-[var(--bd-green)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--bd-green)_16%,transparent)] disabled:bg-[var(--surface-muted)]",
        className,
      )}
      {...props}
    />
  );
}
