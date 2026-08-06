import Link from "next/link";
import { Activity, LockKeyhole, ShieldAlert, UserRound, UsersRound, Workflow } from "lucide-react";
import { PageHeader } from "@/components/page/page-header";
import { MetricCard } from "@/components/data-display/metric-card";
import { SectionCard } from "@/components/data-display/section-card";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { BackendUnavailable } from "@/components/feedback/backend-unavailable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/features/shared/state-panel";

export function SuperAdminDashboard() {
  return <><PageHeader eyebrow="System administration" title="Administrative overview" description="Review platform record areas and frontend readiness from one institutional workspace." /><section className="grid grid-cols-4 gap-4"><MetricCard label="Registered users" icon={UserRound} /><MetricCard label="Role allocations" icon={LockKeyhole} /><MetricCard label="Active records" icon={Workflow} /><MetricCard label="Access events" icon={Activity} /></section><section className="grid grid-cols-2 gap-5"><SectionCard title="Recent activity" description="Administrative events will be listed here."><StatePanel title="No activity records available" /></SectionCard><SectionCard title="Role allocation" description="Role assignment information awaits a data source."><StatePanel title="No role allocations available" /></SectionCard></section><SectionCard title="System access activity" description="A structured view of access events without fabricated logs."><DataTableShell columns={["Account", "Role", "Activity", "Timestamp", "Status"]} emptyTitle="No access activity available" /></SectionCard><section className="grid grid-cols-[1.2fr_.8fr] gap-5"><SectionCard title="Administrative actions" description="Open the implemented record-management areas." icon={ShieldAlert}><div className="grid grid-cols-3 gap-3"><Button asChild variant="outline"><Link href="/players"><UserRound />Players</Link></Button><Button asChild variant="outline"><Link href="/teams"><UsersRound />Teams</Link></Button><Button asChild variant="outline"><Link href="/integrity/complaints"><ShieldAlert />Complaints</Link></Button><button type="button" disabled className="col-span-3 flex h-10 cursor-not-allowed items-center justify-between rounded-[10px] border bg-[var(--surface-muted)] px-4 text-sm text-[var(--text-muted)]"><span>Generate administrative report</span><Badge variant="planned">Planned</Badge></button></div></SectionCard><SectionCard title="Backend integration" description="Current milestone boundary"><BackendUnavailable compact /></SectionCard></section></>;
}
