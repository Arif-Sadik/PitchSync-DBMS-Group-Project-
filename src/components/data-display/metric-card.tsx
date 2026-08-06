import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function MetricCard({ label, value = "—", helper = "Awaiting backend integration", icon: Icon }: { label: string; value?: string; helper?: string; icon: LucideIcon }) {
  return <Card className="relative overflow-hidden p-5"><div className="absolute inset-y-0 left-0 w-1 bg-[var(--primary)] opacity-75" /><div className="flex items-start justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)]">{label}</p><p className="heading-font mt-3 text-3xl font-semibold leading-none">{value}</p><p className="mt-3 text-xs text-[var(--text-muted)]">{helper}</p></div><div className="grid size-10 place-items-center rounded-[10px] bg-[var(--primary-soft)]"><Icon className="size-5 text-[var(--primary)]" /></div></div></Card>;
}
