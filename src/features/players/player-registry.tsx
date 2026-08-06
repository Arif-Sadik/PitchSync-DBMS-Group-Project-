"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, UserRoundSearch } from "lucide-react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { DataStateView } from "@/components/feedback/data-state-view";
import { FilterBar } from "@/components/forms/filter-bar";
import { SearchField } from "@/components/forms/search-field";
import { Pagination } from "@/components/navigation/pagination";
import { PageActions } from "@/components/page/page-actions";
import { PageHeader } from "@/components/page/page-header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseDataStatus } from "@/lib/data-state";

const columns = ["Player", "Registry ID", "Team", "Formats", "Primary role", "Status", "Fitness", "Updated", "Actions"] as const;

export function PlayerRegistry() {
  const searchParams = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const setFilter = (key: string, value: string) => { const params = new URLSearchParams(searchParams.toString()); if (value && value !== "all") params.set(key, value); else params.delete(key); router.replace(`${pathname}${params.size ? `?${params}` : ""}`); };
  const state = { status: parseDataStatus(searchParams.get("state"), "empty"), data: [] as readonly never[], message: "Player records will appear after backend integration." } as const;
  return <><PageHeader eyebrow="Player & team management" title="Player registry" description="Search, filter, and review the structured player registry once the database service is connected." actions={<PageActions><Button asChild variant="outline"><Link href="/players/preview">Preview profile layout</Link></Button><Button asChild><Link href="/players/new"><Plus />Add Player</Link></Button></PageActions>} /><FilterBar><SearchField value={searchParams.get("q") ?? ""} onChange={(value) => setFilter("q", value)} placeholder="Search player registry" /><Select value={searchParams.get("status") ?? "all"} onValueChange={(value) => setFilter("status", value)}><SelectTrigger aria-label="Filter by status"><SelectValue placeholder="All statuses" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="unavailable">Unavailable</SelectItem></SelectContent></Select><Select value={searchParams.get("format") ?? "all"} onValueChange={(value) => setFilter("format", value)}><SelectTrigger aria-label="Filter by format"><SelectValue placeholder="All formats" /></SelectTrigger><SelectContent><SelectItem value="all">All formats</SelectItem><SelectItem value="test">Test</SelectItem><SelectItem value="odi">ODI</SelectItem><SelectItem value="t20">T20</SelectItem></SelectContent></Select><Select value={searchParams.get("team") ?? "all"} onValueChange={(value) => setFilter("team", value)}><SelectTrigger aria-label="Filter by team"><SelectValue placeholder="All teams" /></SelectTrigger><SelectContent><SelectItem value="all">All teams</SelectItem></SelectContent></Select></FilterBar><div className="overflow-hidden rounded-xl border bg-white">{state.status === "empty" || state.status === "ready" ? <DataTableShell columns={columns} emptyTitle="No players available" /> : <DataStateView state={state} emptyTitle="No players available" />}<Pagination /></div><div className="flex items-center gap-2 text-xs text-[var(--text-muted)]"><UserRoundSearch className="size-4" /><span>Filters change only the current view and do not create player records.</span></div></>;
}
