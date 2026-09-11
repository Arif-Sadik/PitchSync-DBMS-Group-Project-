"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderOpen, Link2, ShieldCheck, UserRound } from "lucide-react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { DetailField } from "@/components/data-display/detail-field";
import { DetailGrid } from "@/components/data-display/detail-grid";
import { EntityHeader } from "@/components/data-display/entity-header";
import { SectionCard } from "@/components/data-display/section-card";
import { DataStateView } from "@/components/feedback/data-state-view";
import { TabNavigation } from "@/components/navigation/tab-navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { InvestigatorCaseDetail } from "@/data/contracts";
import { useApiData } from "@/features/shared/use-api-data";
import { formatDate } from "@/lib/format-date";
import { formatCaseLabel } from "@/lib/format-label";
import { CaseEvidenceManager } from "@/features/integrity/03-cases/case-evidence-manager";
import { CaseRuleManager } from "@/features/integrity/03-cases/case-rule-manager";
import { ConfidentialityNotice } from "@/features/integrity/07-shared/confidentiality-notice";
import { InvestigatorFindings } from "@/features/integrity/04-findings/investigator-findings";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "assignment", label: "My Assignment" },
  { value: "complaints", label: "Complaint Sources" },
  { value: "rules", label: "Rules & Violations" },
  { value: "evidence", label: "Evidence" },
  { value: "finding", label: "Finding" },
] as const;

function renderCase(record: InvestigatorCaseDetail, reload: number, onChanged: () => void) {
  return (
    <>
      <ConfidentialityNotice />
      <EntityHeader eyebrow="Integrity cases" title={`Integrity case ${record.caseId}`} referenceLabel="Case reference" reference={record.caseId} loaded>
        <DetailGrid columns={4}><DetailField label="Case ID" value={record.caseId} /><DetailField label="Case Status" value={formatCaseLabel(record.status)} /><DetailField label="Date opened" value={formatDate(record.dateOpened)} /><DetailField label="External Referral" value={formatCaseLabel(record.referralStatus)} /></DetailGrid>
      </EntityHeader>
      <Tabs defaultValue="overview">
        <TabNavigation tabs={tabs} />
        <TabsContent value="overview">
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <SectionCard title="My assignments" icon={FolderOpen}><DetailGrid columns={2}><DetailField label="Assigned players" value={record.myAssignments.length} /><DetailField label="Linked evidence" value={record.evidence.length} /></DetailGrid></SectionCard>
            <SectionCard title="Case source" icon={Link2}><DetailGrid columns={2}><DetailField label="Linked complaints" value={record.complaints.length} /><DetailField label="Linked rules" value={record.rules.length} /></DetailGrid></SectionCard>
          </section>
          {record.referredToAuthority ? <SectionCard title="Referral authority" icon={ShieldCheck}><p className="text-sm">{record.referredToAuthority}</p></SectionCard> : null}
        </TabsContent>
        <TabsContent value="assignment"><SectionCard title="My assignment" description="Players assigned to you for investigation in this case." icon={UserRound}><DataTableShell columns={["Player", "Playing role", "Involvement type", "Actions"]} rows={record.myAssignments.map((assignment) => ({ key: assignment.player.personId, cells: [<div key="player" className="flex items-center gap-2"><span className="font-medium">{assignment.player.fullName}</span><span className="text-xs text-[var(--text-muted)]">#{assignment.player.personId}</span></div>, assignment.player.playerRole, assignment.involvementType, <Button key="view" asChild variant="outline" size="sm"><Link href={`/players/${assignment.player.personId}`}>View Player</Link></Button>] }))} emptyTitle="No players assigned to you" /></SectionCard></TabsContent>
        <TabsContent value="complaints"><SectionCard title="Complaint sources" icon={Link2}><DataTableShell columns={["Complaint ID", "Date received", "Source type", "Description"]} rows={record.complaints.map((complaint) => ({ key: complaint.complaintId, cells: [complaint.complaintId, formatDate(complaint.dateReceived), complaint.sourceType, complaint.description] }))} emptyTitle="No complaint sources linked" /></SectionCard></TabsContent>
        <TabsContent value="rules"><CaseRuleManager caseId={record.caseId} rules={record.rules} onChanged={onChanged} /></TabsContent>
        <TabsContent value="evidence"><CaseEvidenceManager caseId={record.caseId} evidence={record.evidence} onChanged={onChanged} /></TabsContent>
        <TabsContent value="finding"><InvestigatorFindings caseId={record.caseId} assignments={record.myAssignments} reload={reload} onChanged={onChanged} /></TabsContent>
      </Tabs>
    </>
  );
}

export function InvestigatorCaseDetails({ caseId }: { caseId: string }) {
  const [reload, setReload] = useState(0);
  const onChanged = () => setReload((count) => count + 1);
  const state = useApiData<InvestigatorCaseDetail>(`/api/integrity/my-cases/${encodeURIComponent(caseId)}?r=${reload}`);
  return <DataStateView state={state} emptyTitle="Integrity case not found">{(record) => record ? renderCase(record, reload, onChanged) : null}</DataStateView>;
}