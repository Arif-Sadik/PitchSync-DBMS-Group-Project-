import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepIndicator({ steps, current }: { steps: readonly string[]; current: number }) {
  return <ol className="grid grid-cols-3 overflow-hidden rounded-xl border bg-white" aria-label="Registration progress">{steps.map((step, index) => { const complete = index < current; const active = index === current; return <li key={step} className={cn("relative flex items-center gap-3 border-r px-5 py-4 last:border-r-0", active && "bg-[var(--primary-soft)]")} aria-current={active ? "step" : undefined}><span className={cn("grid size-7 place-items-center rounded-full border text-xs font-bold", complete || active ? "border-[var(--primary)] bg-[var(--primary)] text-white" : "bg-white text-[var(--text-muted)]")}>{complete ? <Check className="size-4" /> : index + 1}</span><span className={cn("text-sm font-medium", active ? "text-[var(--primary)]" : "text-[var(--text-muted)]")}>{step}</span></li>; })}</ol>;
}
