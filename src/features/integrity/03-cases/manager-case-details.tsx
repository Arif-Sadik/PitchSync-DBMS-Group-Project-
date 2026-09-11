"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, FileSearch, Link2, ShieldCheck, UserSearch, UsersRound } from "lucide-react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { DetailField } from "@/components/data-display/detail-field";
import { DetailGrid } from "@/components/data-display/detail-grid";
import { EntityHeader } from "@/components/data-display/entity-header";
import { SectionCard } from "@/components/data-display/section-card";
import { DataStateView } from "@/components/feedback/data-state-view";
import { TabNavigation } from "@/components/navigation/tab-navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { IntegrityCaseRecord } from "@/data/contracts";
import { useAuth } from "@/features/auth";
import { useApiData } from "@/features/shared/use-api-data";
import { formatDate } from "@/lib/format-date";
import { formatCaseLabel } from "@/lib/format-label";
import { AddCasePlayer } from "@/features/integrity/03-cases/add-case-player";
import { CaseLifecycleActions } from "@/features/integrity/03-cases/case-lifecycle-actions";
import { ConfidentialityNotice } from "@/features/integrity/07-shared/confidentiality-notice";
import { InvestigationTeamManager } from "@/features/integrity/03-cases/investigation-team";
import { InvestigatorCaseDetails } from "@/features/integrity/03-cases/investigator-case-details";
import { ManagerFindings } from "@/features/integrity/04-findings/manager-findings";
import { RemoveCasePlayer } from "@/features/integrity/03-cases/remove-case-player";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "players", label: "Involved Players" },
  { value: "investigators", label: "Investigation Team" },
  { value: "complaints", label: "Complaint Sources" },
  { value: "rules", label: "Rules & Violations" },
  { value: "evidence", label: "Evidence" },
  { value: "findings", label: "Findings" },
] as const;

function renderCase(record: IntegrityCaseRecord, reload: number, onChanged: () => void) {
  const investigators = record.investigators ?? [];
  return (
    <>
      <ConfidentialityNotice />
      <EntityHeader eyebrow="Integrity cases" title={`Integrity case ${record.caseId}`} referenceLabel="Case reference" reference={record.caseId} loaded>
        <DetailGrid columns={4}><DetailField label="Case ID" value={record.caseId} /><DetailField label="Case Status" value={formatCaseLabel(record.status)} /><DetailField label="Date opened" value={formatDate(record.dateOpened)} /><DetailField label="External Referral" value={formatCaseLabel(record.referralStatus)} /></DetailGrid>
      </EntityHeader>
      <CaseLifecycleActions caseId={record.caseId} status={record.status} referralStatus={record.referralStatus ?? "NOT_REFERRED"} onChanged={onChanged} />
      <Tabs defaultValue="overview">
        <TabNavigation tabs={tabs} />
        <TabsContent value="overview">
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <SectionCard title="Case source" icon={FileSearch}><DetailGrid columns={2}><DetailField label="Linked complaints" value={record.complaints.length} /><DetailField label="Source records" value={record.complaints.length} /></DetailGrid></SectionCard>
            <SectionCard title="Investigation coverage" icon={UserSearch}><DetailGrid columns={2}><DetailField label="Involved players" value={record.involvedPlayers.length} /><DetailField label="Assigned investigators" value={investigators.length} /></DetailGrid></SectionCard>
            <SectionCard title="Evidence & rules" icon={ShieldCheck}><DetailGrid columns={2}><DetailField label="Evidence items" value={record.evidence.length} /><DetailField label="Linked rules" value={record.rules.length} /></DetailGrid></SectionCard>
          </section>
          {record.referredToAuthority ? <SectionCard title="Referral authority" icon={ShieldCheck}><p className="text-sm">{record.referredToAuthority}</p></SectionCard> : null}
        </TabsContent>
        <TabsContent value="players"><SectionCard title="Involved players" description="The involvement type is presented on each player-case relationship." icon={UsersRound}><DataTableShell columns={["Player", "Playing role", "Involvement type", "Assigned investigator", "Actions"]} rows={record.involvedPlayers.map((assignment) => ({ key: assignment.player.personId, cells: [<div key="player" className="flex items-center gap-2"><span className="font-medium">{assignment.player.fullName}</span><span className="text-xs text-[var(--text-muted)]">#{assignment.player.personId}</span></div>, assignment.player.playerRole, assignment.involvementType, assignment.investigatorIds.map((id) => investigators.find((investigator) => investigator.administratorId === id)?.fullName ?? id).join(", ") || "Unassigned", <div key="actions" className="flex items-center justify-end gap-2"><Button asChild variant="outline" size="sm"><Link href={`/players/${assignment.player.personId}`}>View Player</Link></Button><RemoveCasePlayer caseId={record.caseId} playerId={assignment.player.personId} playerName={assignment.player.fullName} onChanged={onChanged} /></div>] }))} emptyTitle="No involved players found" /><AddCasePlayer caseId={record.caseId} isManager={true} onChanged={onChanged} /></SectionCard></TabsContent>
        <TabsContent value="investigators"><InvestigationTeamManager caseId={record.caseId} involvedPlayers={record.involvedPlayers} investigators={investigators} reload={reload} onChanged={onChanged} /></TabsContent>
        <TabsContent value="complaints"><SectionCard title="Complaint sources" icon={Link2}><DataTableShell columns={["Complaint ID", "Date received", "Source type", "Description", "Actions"]} rows={record.complaints.map((complaint) => ({ key: complaint.complaintId, cells: [complaint.complaintId, formatDate(complaint.dateReceived), complaint.sourceType, complaint.description, <Button key="view" asChild variant="outline" size="sm"><Link href={`/integrity/complaints/${complaint.complaintId}`}>View</Link></Button>] }))} emptyTitle="No complaint sources linked" /></SectionCard></TabsContent>
        <TabsContent value="rules"><SectionCard title="Rules linked as violations" icon={BookOpen}><DataTableShell columns={["Rule ID", "Clause number", "Category", "Actions"]} rows={record.rules.map((rule) => ({ key: rule.ruleId, cells: [rule.ruleId, rule.clauseNumber, rule.category, <Button key="view" asChild variant="outline" size="sm"><Link href={`/integrity/rulebook/${rule.ruleId}`}>View</Link></Button>] }))} emptyTitle="No rule violations linked" /></SectionCard></TabsContent>
        <TabsContent value="evidence"><SectionCard title="Case evidence" description="Evidence is identified within this case by its evidence number." icon={FileSearch}><DataTableShell columns={["Evidence number", "Description", "Collected date"]} rows={record.evidence.map((item) => ({ key: item.evidenceNumber, cells: [item.evidenceNumber, item.description, formatDate(item.collectedDate)] }))} emptyTitle="No evidence available" /></SectionCard></TabsContent>
        <TabsContent value="findings"><ManagerFindings caseId={record.caseId} reload={reload} onChanged={onChanged} /></TabsContent>
      </Tabs>
    </>
  );
}

export function IntegrityCaseDetails({ caseId }: { caseId: string }) {
  const { session } = useAuth();
  return session?.integrityScope === "INVESTIGATOR" ? <InvestigatorCaseDetails caseId={caseId} /> : <ManagerCaseDetails caseId={caseId} />;
}

function ManagerCaseDetails({ caseId }: { caseId: string }) {
  const [reload, setReload] = useState(0);
  const state = useApiData<IntegrityCaseRecord>(`/api/integrity/cases/${encodeURIComponent(caseId)}?r=${reload}`);
  const onChanged = () => setReload((count) => count + 1);
  return <DataStateView state={state} emptyTitle="Integrity case not found">{(record) => record ? renderCase(record, reload, onChanged) : null}</DataStateView>;
}
