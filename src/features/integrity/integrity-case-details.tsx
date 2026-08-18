"use client";

import { FileSearch, Link2 } from "lucide-react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { DetailField } from "@/components/data-display/detail-field";
import { DetailGrid } from "@/components/data-display/detail-grid";
import { SectionCard } from "@/components/data-display/section-card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { StatePanel } from "@/features/shared/state-panel";
import { TabNavigation } from "@/components/navigation/tab-navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "players", label: "Involved Players" },
  { value: "investigators", label: "Investigators" },
  { value: "rules", label: "Rules & Violations" },
  { value: "evidence", label: "Evidence" },
  { value: "audit", label: "Audit History" },
] as const;

export function IntegrityCaseDetails() {
  return (
    <>
      <header className="rounded-xl border bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">Integrity management</p>
            <h1 className="heading-font mt-2 text-3xl font-semibold">Integrity case record</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Case reference: <strong className="text-[var(--text)]">—</strong></p>
          </div>
          <StatusBadge status="No data available" />
        </div>
        <div className="mt-6">
          <DetailGrid columns={4}>
            <DetailField label="Case ID" />
            <DetailField label="Status" value={<StatusBadge status="No data available" />} />
            <DetailField label="Date Opened" />
            <DetailField label="Involvement Type" />
            <DetailField label="Referral Status" />
            <DetailField label="Referred Authority" />
          </DetailGrid>
        </div>
      </header>
      <Tabs defaultValue="overview">
        <TabNavigation tabs={tabs} />
        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-5">
            <SectionCard title="Case Origin" icon={FileSearch}>
              <StatePanel title="No case origin recorded" message="No originating complaint or suspicious activity is recorded." />
            </SectionCard>
            <SectionCard title="Linked Complaints" className="col-span-2" icon={Link2}>
              <DataTableShell columns={["Complaint ID", "Date Received", "Source Type", "Misconduct Type"]} emptyTitle="No linked complaints found" />
            </SectionCard>
          </div>
        </TabsContent>
        <TabsContent value="players">
          <DataTableShell columns={["Player ID", "Player Name", "Role", "Investigator", "Action"]} emptyTitle="No involved players found" />
        </TabsContent>
        <TabsContent value="investigators">
          <DataTableShell columns={["Player", "Investigator ID", "Investigator Name", "Action"]} emptyTitle="No investigation assignments found" />
        </TabsContent>
        <TabsContent value="rules">
          <DataTableShell columns={["Clause", "Category", "Action"]} emptyTitle="No rule violations linked" />
        </TabsContent>
        <TabsContent value="evidence">
          <DataTableShell columns={["Evidence No.", "Description", "Collected Date", "Action"]} emptyTitle="No evidence available" />
        </TabsContent>
        <TabsContent value="audit">
          <DataTableShell columns={["Date/Time", "Actor", "Operation", "Entity", "Old Value", "New Value"]} emptyTitle="No audit history available" />
        </TabsContent>
      </Tabs>
    </>
  );
}
