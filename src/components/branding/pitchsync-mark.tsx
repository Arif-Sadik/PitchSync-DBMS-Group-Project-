import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function PitchSyncMark({ subtitle, compact = false, dark = false }: { subtitle?: string; compact?: boolean; dark?: boolean }) {
  return <div className="flex items-center gap-3"><div className={cn("relative grid place-items-center rounded-[10px] border", compact ? "size-9" : "size-11", dark ? "border-white/20 bg-white/10" : "border-[var(--border)] bg-[var(--bd-green-soft)]")}><Shield className={cn(compact ? "size-5" : "size-6", dark ? "text-[var(--text-on-dark)]" : "text-[var(--bd-green)]")} strokeWidth={1.7} /><span className="absolute size-1.5 rounded-full bg-[var(--bd-red)] shadow-[0_0_0_2px_rgba(255,255,255,.2)]" /></div><div><p className={cn("heading-font font-semibold uppercase tracking-[0.06em]", compact ? "text-xl" : "text-2xl", dark ? "text-[var(--text-on-dark)]" : "text-[var(--text)]")}>PitchSync</p>{subtitle ? <p className={cn("mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em]", dark ? "text-white/55" : "text-[var(--text-muted)]")}>{subtitle}</p> : null}</div></div>;
}
