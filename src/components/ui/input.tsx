import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-10 w-full rounded-[10px] border bg-white px-3 text-sm text-[var(--text)] shadow-[0_1px_1px_rgba(13,38,48,.02)] outline-none transition placeholder:text-[#94a09a] focus:border-[var(--primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_15%,transparent)] disabled:bg-[var(--surface-muted)]",
        className,
      )}
      {...props}
    />
  );
}
