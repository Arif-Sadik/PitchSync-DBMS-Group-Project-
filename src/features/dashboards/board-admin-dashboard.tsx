import Link from "next/link";
import { CheckCircle2, Trophy, UserRound, UsersRound } from "lucide-react";
import { MetricCard } from "@/components/data-display/metric-card";
import { SectionCard } from "@/components/data-display/section-card";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { PageHeader } from "@/components/page/page-header";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/features/shared/state-panel";

export function BoardAdminDashboard() {
  return <><PageHeader eyebrow="Board operations" title="Cricket administration" description="Coordinate the frontend record areas prepared for players, teams, and competitions." /><section className="grid grid-cols-3 gap-4"><MetricCard label="Player management" icon={UserRound} /><MetricCard label="Team management" icon={UsersRound} /><MetricCard label="Tournament overview" icon={Trophy} /></section><section className="grid grid-cols-3 gap-4"><Button asChild><Link href="/players"><UserRound />Open player registry</Link></Button><Button asChild variant="outline"><Link href="/teams"><UsersRound />Open team management</Link></Button><Button asChild variant="outline"><Link href="/tournaments"><Trophy />Open tournaments</Link></Button></section><section className="grid grid-cols-2 gap-5"><SectionCard title="Pending approvals" icon={CheckCircle2}><StatePanel title="No approval records available" /></SectionCard><SectionCard title="Recent registrations" icon={UserRound}><StatePanel title="No registration records available" /></SectionCard></section><SectionCard title="Upcoming fixtures" description="Competition fixtures will populate this table after integration."><DataTableShell columns={["Fixture", "Competition", "Format", "Venue", "Date", "Status"]} emptyTitle="No fixtures available" /></SectionCard></>;
}
