"use client";

import { BookOpenCheck, CircleUserRound, FileSearch, Link2, ListTree, ShieldAlert } from "lucide-react";
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

const tabs = [{ value: "overview", label: "Overview" }, { value: "evidence", label: "Evidence" }, { value: "timeline", label: "Timeline" }, { value: "people", label: "Persons Involved" }, { value: "communications", label: "Communications" }, { value: "documents", label: "Documents" }] as const;

export function IntegrityCaseDetails() {
  return <><header className="rounded-xl border bg-white p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">Integrity management</p><h1 className="heading-font mt-2 text-3xl font-semibold">Integrity case record</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Case reference: <strong className="text-[var(--text)]">—</strong></p></div><BackendStatusBadge /></div><div className="mt-6"><DetailGrid columns={4}><DetailField label="Status" value={<BackendStatusBadge />} /><DetailField label="Priority" /><DetailField label="Filed date" /><DetailField label="Assigned officer" /><DetailField label="Category" /><DetailField label="Security classification" /></DetailGrid></div></header><Tabs defaultValue="overview"><TabNavigation tabs={tabs} /><TabsContent value="overview"><div className="grid grid-cols-2 gap-5"><SectionCard title="Case Summary" icon={FileSearch}><StatePanel title="No case summary available" /></SectionCard><SectionCard title="Key Facts" icon={BookOpenCheck}><StatePanel title="No verified facts available" /></SectionCard><SectionCard title="Linked Complaints" className="col-span-2" icon={Link2}><DataTableShell columns={["Reference", "Category", "Filed date", "Status"]} emptyTitle="No linked complaints available" /></SectionCard><SectionCard title="Status Timeline" icon={ListTree}><StatePanel title="No timeline events available" /></SectionCard><SectionCard title="Risk Assessment" icon={ShieldAlert}><StatePanel fallback="backend-unavailable" title="Risk assessment unavailable" /></SectionCard><SectionCard title="Persons Involved" className="col-span-2" icon={CircleUserRound}><StatePanel title="No persons are associated with this view" /></SectionCard></div></TabsContent><TabsContent value="evidence"><PlannedFeature title="Evidence management" /></TabsContent><TabsContent value="timeline"><BackendUnavailable title="Case timeline unavailable" /></TabsContent><TabsContent value="people"><PlannedFeature title="Persons involved management" /></TabsContent><TabsContent value="communications"><PlannedFeature title="Communications management" /></TabsContent><TabsContent value="documents"><PlannedFeature title="Document management" /></TabsContent></Tabs></>;
}
