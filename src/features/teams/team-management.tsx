"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, UsersRound } from "lucide-react";
import { DataStateView } from "@/components/feedback/data-state-view";
import { FilterBar } from "@/components/forms/filter-bar";
import { SearchField } from "@/components/forms/search-field";
import { PageHeader } from "@/components/page/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseDataStatus } from "@/lib/data-state";

export function TeamManagement() {
  const searchParams = useSearchParams(); const pathname = usePathname(); const router = useRouter();
  const setFilter = (key: string, value: string) => { const params = new URLSearchParams(searchParams.toString()); if (value && value !== "all") params.set(key, value); else params.delete(key); router.replace(`${pathname}${params.size ? `?${params}` : ""}`); };
  const state = { status: parseDataStatus(searchParams.get("state"), "empty"), data: [] as readonly never[], message: "Team records will appear after backend integration." } as const;
  return <><PageHeader eyebrow="Player & team management" title="Team management" description="Review and organize team records when a database-backed repository becomes available." actions={<Button disabled><Plus />Create Team<Badge variant="planned" className="ml-1">Planned</Badge></Button>} /><FilterBar><SearchField value={searchParams.get("q") ?? ""} onChange={(value) => setFilter("q", value)} placeholder="Search teams" /><Select value={searchParams.get("format") ?? "all"} onValueChange={(value) => setFilter("format", value)}><SelectTrigger aria-label="Filter by format"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All formats</SelectItem><SelectItem value="test">Test</SelectItem><SelectItem value="odi">ODI</SelectItem><SelectItem value="t20">T20</SelectItem></SelectContent></Select><Select value={searchParams.get("status") ?? "all"} onValueChange={(value) => setFilter("status", value)}><SelectTrigger aria-label="Filter by status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></FilterBar><section className="min-h-80 rounded-xl border bg-white"><DataStateView state={state} emptyTitle="No team records available">{() => <div className="grid grid-cols-3 gap-4 p-5" />}</DataStateView></section><p className="flex items-center gap-2 text-xs text-[var(--text-muted)]"><UsersRound className="size-4" />Team cards will appear here only when real records are returned.</p></>;
}
