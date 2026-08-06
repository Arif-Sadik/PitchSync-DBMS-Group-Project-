import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn("min-h-24 w-full resize-y rounded-[10px] border bg-white px-3 py-2 text-sm outline-none transition placeholder:text-[#94a09a] focus:border-[var(--primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_15%,transparent)]", className)}
      {...props}
    />
  );
}
