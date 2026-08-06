import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function PitchSyncMark({ subtitle, compact = false, dark = false }: { subtitle?: string; compact?: boolean; dark?: boolean }) {
  return <div className="flex items-center gap-3"><div className={cn("relative grid place-items-center rounded-[10px] border", compact ? "size-9" : "size-11", dark ? "border-white/20 bg-white/10" : "border-[var(--border)] bg-[var(--primary-soft)]")}><Shield className={cn(compact ? "size-5" : "size-6", dark ? "text-white" : "text-[var(--primary)]")} strokeWidth={1.7} /><span className={cn("absolute h-px w-3", dark ? "bg-[#d7bd66]" : "bg-[var(--accent-gold)]")} /></div><div><p className={cn("heading-font font-semibold uppercase tracking-[0.06em]", compact ? "text-xl" : "text-2xl", dark ? "text-white" : "text-[var(--text)]")}>PitchSync</p>{subtitle ? <p className={cn("mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em]", dark ? "text-white/55" : "text-[var(--text-muted)]")}>{subtitle}</p> : null}</div></div>;
}
