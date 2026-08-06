"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseDataStatus } from "@/lib/data-state";

export function DemoStateSwitcher() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  if (process.env.NEXT_PUBLIC_SHOW_STATE_SWITCHER !== "true") return null;
  const value = parseDataStatus(searchParams.get("state"));
  const update = (next: string) => { const params = new URLSearchParams(searchParams.toString()); params.set("state", next); router.replace(`${pathname}?${params.toString()}`); };
  return <div className="flex items-center gap-2 rounded-[10px] border bg-white p-1 pl-3"><span className="text-xs font-semibold text-[var(--text-muted)]">Visual state</span><Select value={value} onValueChange={update}><SelectTrigger className="h-8 min-w-44 border-0 bg-[var(--surface-muted)]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="loading">Loading</SelectItem><SelectItem value="empty">Empty</SelectItem><SelectItem value="error">Error</SelectItem><SelectItem value="backend-unavailable">Backend unavailable</SelectItem></SelectContent></Select></div>;
}
