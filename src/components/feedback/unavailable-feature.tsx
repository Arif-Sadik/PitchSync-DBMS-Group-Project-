import { CircleSlash2 } from "lucide-react";

export function UnavailableFeature({ title, description = "No information is available for this section.", compact = false }: { title: string; description?: string; compact?: boolean }) {
  return <div className={`flex flex-col items-center justify-center text-center ${compact ? "min-h-40 p-5" : "min-h-56 p-8"}`}><div className="mb-3 grid size-11 place-items-center rounded-full border bg-[var(--surface-muted)]"><CircleSlash2 className="size-5 text-[var(--text-muted)]" /></div><p className="font-semibold">{title}</p><p className="mt-1 max-w-md text-sm leading-5 text-[var(--text-muted)]">{description}</p></div>;
}
