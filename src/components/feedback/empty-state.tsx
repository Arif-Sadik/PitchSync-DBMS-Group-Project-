import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export function EmptyState({ title = "No records available", description = "Records will appear here when data is available.", icon: Icon = Inbox, action, compact = false }: { title?: string; description?: string; icon?: LucideIcon; action?: React.ReactNode; compact?: boolean }) {
  return <div className={`flex flex-col items-center justify-center text-center ${compact ? "min-h-40 p-5" : "min-h-64 p-8"}`}><div className="mb-4 grid size-11 place-items-center rounded-full border bg-[var(--surface-muted)]"><Icon className="size-5 text-[var(--text-muted)]" aria-hidden="true" /></div><p className="font-semibold">{title}</p><p className="mt-1 max-w-md text-sm leading-5 text-[var(--text-muted)]">{description}</p>{action ? <div className="mt-5">{action}</div> : null}</div>;
}
