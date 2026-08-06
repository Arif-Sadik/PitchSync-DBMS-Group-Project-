import { CircleAlert } from "lucide-react";

export function ErrorState({ title = "Unable to display records", message = "The requested data could not be prepared. Try the view again when a data service is available.", compact = false }: { title?: string; message?: string; compact?: boolean }) {
  return <div className={`flex flex-col items-center justify-center text-center ${compact ? "min-h-40 p-5" : "min-h-64 p-8"}`} role="alert"><div className="mb-4 grid size-11 place-items-center rounded-full border border-[#efcece] bg-[#faeeee]"><CircleAlert className="size-5 text-[var(--danger)]" aria-hidden="true" /></div><p className="font-semibold">{title}</p><p className="mt-1 max-w-md text-sm leading-5 text-[var(--text-muted)]">{message}</p></div>;
}
