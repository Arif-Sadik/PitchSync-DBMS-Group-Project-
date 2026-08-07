import Link from "next/link";
import { CalendarClock, CheckCircle2, ClipboardPen, ListChecks, Timer } from "lucide-react";
import { MetricCard } from "@/components/data-display/metric-card";
import { SectionCard } from "@/components/data-display/section-card";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/page/page-header";
import { Button } from "@/components/ui/button";

export function MatchOfficialDashboard() {
  return <><PageHeader eyebrow="Match operations" title="Official’s workspace" description="Review assignments, match details, and recorded results." actions={<Button asChild variant="outline"><Link href="/matches/preview">Match details</Link></Button>} /><section className="grid grid-cols-[1.5fr_.75fr_.75fr] gap-4"><SectionCard title="Today’s assignment" icon={CalendarClock}><EmptyState compact title="No assignment available" description="No assignment has been recorded for today." /></SectionCard><MetricCard label="Pending summaries" icon={Timer} /><MetricCard label="Completed this season" icon={CheckCircle2} /></section><SectionCard title="Upcoming assignments" icon={ListChecks}><DataTableShell columns={["Match", "Competition", "Role", "Venue", "Date", "Status"]} emptyTitle="No upcoming assignments" /></SectionCard><section className="grid grid-cols-[.8fr_1.2fr] gap-5"><SectionCard title="Quick match entry" icon={ClipboardPen}><div className="rounded-[10px] border border-dashed bg-[var(--surface-muted)] p-5"><p className="text-sm font-medium text-[var(--text-muted)]">No match is available for entry.</p><Button className="mt-4 w-full" disabled aria-disabled="true">Open match entry</Button></div></SectionCard><SectionCard title="Recent results"><DataTableShell minWidth={540} columns={["Match", "Competition", "Result", "Submitted"]} emptyTitle="No results available" /></SectionCard></section></>;
}
