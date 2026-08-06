"use client";

import { BookOpenCheck, CircleUserRound, FileSearch, Link2, ListTree, ShieldAlert } from "lucide-react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { DetailField } from "@/components/data-display/detail-field";
import { DetailGrid } from "@/components/data-display/detail-grid";
import { SectionCard } from "@/components/data-display/section-card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { InformationUnavailable } from "@/components/feedback/information-unavailable";
import { UnavailableFeature } from "@/components/feedback/unavailable-feature";
import { StatePanel } from "@/features/shared/state-panel";
import { TabNavigation } from "@/components/navigation/tab-navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const tabs = [{ value: "overview", label: "Overview" }, { value: "evidence", label: "Evidence" }, { value: "timeline", label: "Timeline" }, { value: "people", label: "Persons Involved" }, { value: "communications", label: "Communications" }, { value: "documents", label: "Documents" }] as const;

export function IntegrityCaseDetails() {
  return <><header className="rounded-xl border bg-white p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">Integrity management</p><h1 className="heading-font mt-2 text-3xl font-semibold">Integrity case record</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Case reference: <strong className="text-[var(--text)]">—</strong></p></div><StatusBadge status="No data available" /></div><div className="mt-6"><DetailGrid columns={4}><DetailField label="Status" value={<StatusBadge status="No data available" />} /><DetailField label="Priority" /><DetailField label="Filed date" /><DetailField label="Assigned officer" /><DetailField label="Category" /><DetailField label="Security classification" /></DetailGrid></div></header><Tabs defaultValue="overview"><TabNavigation tabs={tabs} /><TabsContent value="overview"><div className="grid grid-cols-2 gap-5"><SectionCard title="Case Summary" icon={FileSearch}><StatePanel title="No case summary available" /></SectionCard><SectionCard title="Key Facts" icon={BookOpenCheck}><StatePanel title="No verified facts available" /></SectionCard><SectionCard title="Linked Complaints" className="col-span-2" icon={Link2}><DataTableShell columns={["Reference", "Category", "Filed date", "Status"]} emptyTitle="No linked complaints found" /></SectionCard><SectionCard title="Status Timeline" icon={ListTree}><StatePanel title="No timeline activity recorded" /></SectionCard><SectionCard title="Risk Assessment" icon={ShieldAlert}><StatePanel fallback="backend-unavailable" title="No risk assessment available" /></SectionCard><SectionCard title="Persons Involved" className="col-span-2" icon={CircleUserRound}><StatePanel title="No persons found" /></SectionCard></div></TabsContent><TabsContent value="evidence"><UnavailableFeature title="No evidence available" /></TabsContent><TabsContent value="timeline"><InformationUnavailable title="No case timeline available" /></TabsContent><TabsContent value="people"><UnavailableFeature title="No persons found" /></TabsContent><TabsContent value="communications"><UnavailableFeature title="No communications available" /></TabsContent><TabsContent value="documents"><UnavailableFeature title="No documents available" /></TabsContent></Tabs></>;
}
