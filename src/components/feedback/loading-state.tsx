import { LoaderCircle } from "lucide-react";

export function LoadingState({ title = "Loading records", compact = false }: { title?: string; compact?: boolean }) {
  return <div className={`flex flex-col items-center justify-center text-center ${compact ? "min-h-40 p-5" : "min-h-64 p-8"}`} role="status" aria-live="polite"><LoaderCircle className="mb-3 size-6 animate-spin text-[var(--primary)]" aria-hidden="true" /><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-[var(--text-muted)]">Waiting for a data source response.</p></div>;
}
