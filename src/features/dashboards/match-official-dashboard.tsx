import Link from "next/link";
import { CalendarClock, CheckCircle2, ClipboardPen, ListChecks, Timer } from "lucide-react";
import { MetricCard } from "@/components/data-display/metric-card";
import { SectionCard } from "@/components/data-display/section-card";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/page/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MatchOfficialDashboard() {
  return <><PageHeader eyebrow="Match operations" title="Official’s workspace" description="Review assignment and match-detail layouts prepared for future competition records." actions={<Button asChild variant="outline"><Link href="/matches/preview">Preview match details</Link></Button>} /><section className="grid grid-cols-[1.5fr_.75fr_.75fr] gap-4"><SectionCard title="Today’s assignment" icon={CalendarClock}><EmptyState compact title="No assignment available" description="Assignments will appear after backend integration." /></SectionCard><MetricCard label="Pending summaries" icon={Timer} /><MetricCard label="Completed this season" icon={CheckCircle2} /></section><SectionCard title="Upcoming assignments" icon={ListChecks}><DataTableShell columns={["Match", "Competition", "Role", "Venue", "Date", "Status"]} emptyTitle="No assignments available" /></SectionCard><section className="grid grid-cols-[.8fr_1.2fr] gap-5"><SectionCard title="Quick match entry" icon={ClipboardPen}><div className="rounded-[10px] border border-dashed bg-[var(--surface-muted)] p-5"><div className="flex items-center justify-between"><p className="text-sm font-medium text-[var(--text-muted)]">Match result entry is outside this milestone.</p><Badge variant="planned">Planned</Badge></div><Button className="mt-4 w-full" disabled>Open match entry</Button></div></SectionCard><SectionCard title="Recent results"><DataTableShell minWidth={540} columns={["Match", "Competition", "Result", "Submitted"]} emptyTitle="No results available" /></SectionCard></section></>;
}
