import { Construction } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PlannedFeature({ title, description = "This capability is intentionally deferred beyond the current frontend milestone.", compact = false }: { title: string; description?: string; compact?: boolean }) {
  return <div className={`flex flex-col items-center justify-center text-center ${compact ? "min-h-40 p-5" : "min-h-56 p-8"}`}><div className="mb-3 grid size-11 place-items-center rounded-full border border-[#eadfb8] bg-[#faf6e9]"><Construction className="size-5 text-[#866d1e]" /></div><div className="mb-2"><Badge variant="planned">Planned</Badge></div><p className="font-semibold">{title}</p><p className="mt-1 max-w-md text-sm leading-5 text-[var(--text-muted)]">{description}</p></div>;
}
