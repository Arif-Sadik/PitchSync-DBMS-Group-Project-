"use client";

import { ClipboardList, Flag, MapPin, UsersRound } from "lucide-react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { DetailField } from "@/components/data-display/detail-field";
import { DetailGrid } from "@/components/data-display/detail-grid";
import { SectionCard } from "@/components/data-display/section-card";
import { BackendStatusBadge } from "@/components/feedback/backend-status-badge";
import { BackendUnavailable } from "@/components/feedback/backend-unavailable";
import { PlannedFeature } from "@/components/feedback/planned-feature";
import { StatePanel } from "@/features/shared/state-panel";
import { TabNavigation } from "@/components/navigation/tab-navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const tabs = [{ value: "summary", label: "Summary" }, { value: "scorecard", label: "Scorecard" }, { value: "officials", label: "Officials" }, { value: "incidents", label: "Incidents" }, { value: "documents", label: "Documents" }] as const;

export function MatchDetails() {
  return <><header className="rounded-xl border bg-white p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">Competition management</p><h1 className="heading-font mt-2 text-3xl font-semibold">Match details</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Match reference: <strong className="text-[var(--text)]">—</strong></p></div><BackendStatusBadge /></div><DetailGrid columns={4}><DetailField label="Tournament" /><DetailField label="Teams" /><DetailField label="Venue" /><DetailField label="Date" /><DetailField label="Status" value={<BackendStatusBadge />} /><DetailField label="Result" /></DetailGrid></header><Tabs defaultValue="summary"><TabNavigation tabs={tabs} /><TabsContent value="summary"><div className="space-y-5"><section className="grid grid-cols-2 gap-5"><SectionCard title="Match Details" icon={MapPin}><DetailGrid columns={2}><DetailField label="Format" /><DetailField label="Stage" /><DetailField label="Scheduled start" /><DetailField label="Scheduled end" /><DetailField label="Toss" /><DetailField label="Conditions" /></DetailGrid></SectionCard><SectionCard title="Assigned Officials" icon={UsersRound}><DetailGrid columns={2}><DetailField label="On-field officials" /><DetailField label="Third official" /><DetailField label="Match referee" /><DetailField label="Reserve official" /></DetailGrid></SectionCard></section><SectionCard title="Innings Summary" icon={ClipboardList}><DataTableShell columns={["Innings", "Team", "Score", "Overs", "Status"]} emptyTitle="No innings records available" /></SectionCard><SectionCard title="Disciplinary and Incident Reports" icon={Flag}><StatePanel title="No incident reports available" /></SectionCard></div></TabsContent><TabsContent value="scorecard"><BackendUnavailable title="Scorecard unavailable" /></TabsContent><TabsContent value="officials"><BackendUnavailable title="Official assignments unavailable" /></TabsContent><TabsContent value="incidents"><PlannedFeature title="Incident management" /></TabsContent><TabsContent value="documents"><PlannedFeature title="Match documents" /></TabsContent></Tabs></>;
}
