"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Medal, Plus, SearchCheck, Trophy } from "lucide-react";
import { MetricCard } from "@/components/data-display/metric-card";
import { DataStateView } from "@/components/feedback/data-state-view";
import { FilterBar } from "@/components/forms/filter-bar";
import { SearchField } from "@/components/forms/search-field";
import { PageActions } from "@/components/page/page-actions";
import { PageHeader } from "@/components/page/page-header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseDataStatus } from "@/lib/data-state";

export function TournamentManagement() {
  const searchParams = useSearchParams(); const pathname = usePathname(); const router = useRouter();
  const setFilter = (key: string, value: string) => { const params = new URLSearchParams(searchParams.toString()); if (value && value !== "all") params.set(key, value); else params.delete(key); router.replace(`${pathname}${params.size ? `?${params}` : ""}`); };
  const state = { status: parseDataStatus(searchParams.get("state"), "empty"), data: [] as readonly never[], message: "No competition records found." } as const;
  return <><PageHeader eyebrow="Competition management" title="Tournament management" description="Search, filter, and review tournament and competition records." actions={<PageActions><Button asChild variant="outline"><Link href="/matches/preview">Match details</Link></Button><Button disabled aria-disabled="true"><Plus />Create Competition</Button></PageActions>} /><section className="grid grid-cols-4 gap-4"><MetricCard label="Competitions" icon={Trophy} /><MetricCard label="Active formats" icon={Medal} /><MetricCard label="Scheduled matches" icon={CalendarDays} /><MetricCard label="Pending setup" icon={SearchCheck} /></section><FilterBar><SearchField value={searchParams.get("q") ?? ""} onChange={(value) => setFilter("q", value)} placeholder="Search competitions" /><Select value={searchParams.get("status") ?? "all"} onValueChange={(value) => setFilter("status", value)}><SelectTrigger aria-label="Filter by status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="planned">Planned</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select><Select value={searchParams.get("format") ?? "all"} onValueChange={(value) => setFilter("format", value)}><SelectTrigger aria-label="Filter by format"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All formats</SelectItem><SelectItem value="test">Test</SelectItem><SelectItem value="odi">ODI</SelectItem><SelectItem value="t20">T20</SelectItem></SelectContent></Select><Select value={searchParams.get("year") ?? "all"} onValueChange={(value) => setFilter("year", value)}><SelectTrigger aria-label="Filter by year"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All years</SelectItem></SelectContent></Select></FilterBar><section className="min-h-80 rounded-xl border bg-white"><DataStateView state={state} emptyTitle="No competitions found">{() => <div className="grid grid-cols-3 gap-4 p-5" />}</DataStateView></section></>;
}
