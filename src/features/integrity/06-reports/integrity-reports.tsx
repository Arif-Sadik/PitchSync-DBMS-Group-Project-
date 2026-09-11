"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, FolderSearch, Scale, UsersRound } from "lucide-react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataStateView } from "@/components/feedback/data-state-view";
import { SectionCard } from "@/components/data-display/section-card";
import { PageHeader } from "@/components/page/page-header";
import type {
  CaseWithoutEvidenceItem,
  FrequentlyViolatedRuleItem,
  InvestigatorWorkloadItem,
  UnassignedInvolvementItem,
} from "@/data/contracts";
import { useApiData } from "@/features/shared/use-api-data";
import { formatDate } from "@/lib/format-date";
import { formatCaseLabel } from "@/lib/format-label";
import { ConfidentialityNotice } from "@/features/integrity/07-shared/confidentiality-notice";

function CasesWithoutEvidenceSection() {
  const state = useApiData<readonly CaseWithoutEvidenceItem[]>("/api/integrity/reports/cases-without-evidence");
  return (
    <SectionCard title="Cases without evidence" description="Active cases with no evidence recorded yet. Add evidence from the case details." icon={FileText}>
      <DataStateView state={state} emptyTitle="No cases without evidence">
        {(rows) => (
          <DataTableShell
            minWidth={700}
            columns={["Case ID", "Status", "Date opened", "Involvement", "External referral", "Action"]}
            emptyTitle="No cases without evidence"
            emptyDescription="No active cases are currently missing evidence."
            rows={(rows ?? []).map((record) => ({
              key: record.caseId,
              cells: [
                record.caseId,
                formatCaseLabel(record.status),
                formatDate(record.dateOpened),
                record.involvementType ? formatCaseLabel(record.involvementType) : "—",
                record.referralStatus ? formatCaseLabel(record.referralStatus) : "—",
                <Button key="view" asChild variant="outline" size="sm"><Link href={`/integrity/cases/${record.caseId}`}>View case</Link></Button>,
              ],
            }))}
          />
        )}
      </DataStateView>
    </SectionCard>
  );
}

function UnassignedInvolvementsSection() {
  const state = useApiData<readonly UnassignedInvolvementItem[]>("/api/integrity/reports/unassigned-involvements");
  return (
    <SectionCard title="Unassigned involvements" description="Active player-case involvements with no assigned investigator. Assign from the case investigation team." icon={FolderSearch}>
      <DataStateView state={state} emptyTitle="No unassigned involvements">
        {(rows) => (
          <DataTableShell
            minWidth={700}
            columns={["Case ID", "Status", "Date opened", "Player", "Player role", "Action"]}
            emptyTitle="No unassigned involvements"
            emptyDescription="Every active player-case involvement is assigned to an investigator."
            rows={(rows ?? []).map((record) => ({
              key: `${record.caseId}-${record.playerId}`,
              cells: [
                record.caseId,
                formatCaseLabel(record.status),
                formatDate(record.dateOpened),
                <div key="player" className="flex flex-col"><span className="font-medium">{record.player}</span><span className="text-xs text-[var(--text-muted)]">#{record.playerId}</span></div>,
                record.playerRole ?? "—",
                <Button key="view" asChild variant="outline" size="sm"><Link href={`/integrity/cases/${record.caseId}`}>View case</Link></Button>,
              ],
            }))}
          />
        )}
      </DataStateView>
    </SectionCard>
  );
}

function FrequentlyViolatedRulesSection() {
  const [minimum, setMinimum] = useState("2");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const params = new URLSearchParams();
  const parsedMinimum = Number(minimum);
  if (minimum.trim() && !Number.isNaN(parsedMinimum) && parsedMinimum > 0) params.set("minimum_cases", minimum.trim());
  if (fromDate) params.set("from_date", fromDate);
  if (toDate) params.set("to_date", toDate);
  const query = params.toString();

  const state = useApiData<readonly FrequentlyViolatedRuleItem[]>(`/api/integrity/reports/frequently-violated-rules${query ? `?${query}` : ""}`);

  return (
    <SectionCard title="Frequently violated rules" description="Rulebook clauses violated across the most cases, filtered by the configured threshold." icon={Scale}>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--text-muted)]" htmlFor="report-minimum-cases">Minimum cases</label>
          <Input id="report-minimum-cases" className="sm:w-36" type="number" min={1} value={minimum} onChange={(event) => setMinimum(event.target.value)} aria-label="Minimum cases" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--text-muted)]" htmlFor="report-from-date">From</label>
          <Input id="report-from-date" className="sm:w-40" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} aria-label="Opened from date" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--text-muted)]" htmlFor="report-to-date">To</label>
          <Input id="report-to-date" className="sm:w-40" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} aria-label="Opened to date" />
        </div>
      </div>
      <DataStateView state={state} emptyTitle="No frequently violated rules">
        {(rows) => (
          <DataTableShell
            minWidth={620}
            columns={["Rule", "Category", "Cases", "Action"]}
            emptyTitle="No frequently violated rules"
            emptyDescription="No rule is violated in enough active cases to meet the threshold."
            rows={(rows ?? []).map((record) => ({
              key: record.ruleId,
              cells: [
                record.clauseNumber,
                record.category,
                record.caseCount.toLocaleString(),
                <Button key="view" asChild variant="outline" size="sm"><Link href={`/integrity/rulebook/${record.ruleId}`}>View rule</Link></Button>,
              ],
            }))}
          />
        )}
      </DataStateView>
    </SectionCard>
  );
}

function InvestigatorWorkloadSection() {
  const state = useApiData<readonly InvestigatorWorkloadItem[]>("/api/integrity/reports/investigator-workload");
  return (
    <SectionCard title="Investigator workload" description="Active player-case assignments per investigator. Assignments are configured from each case's investigation team." icon={UsersRound}>
      <DataStateView state={state} emptyTitle="No investigators on record">
        {(rows) => (
          <DataTableShell
            minWidth={620}
            columns={["Investigator", "Designation", "Department", "Active assignments", "Active cases"]}
            emptyTitle="No investigators on record"
            emptyDescription="No investigators are currently registered."
            rows={(rows ?? []).map((record) => ({
              key: record.investigatorId,
              cells: [
                <div key="investigator" className="flex flex-col"><span className="font-medium">{record.investigator}</span><span className="text-xs text-[var(--text-muted)]">#{record.investigatorId}</span></div>,
                record.designation ?? "—",
                record.department ?? "—",
                record.activeAssignments.toLocaleString(),
                record.activeCases.toLocaleString(),
              ],
            }))}
          />
        )}
      </DataStateView>
    </SectionCard>
  );
}

export function IntegrityReports() {
  return (
    <>
      <ConfidentialityNotice />
      <PageHeader eyebrow="Integrity domain" title="Reports" description="Operational reports for the integrity unit, powered by the frozen report queries." />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><CasesWithoutEvidenceSection /><UnassignedInvolvementsSection /></div>
      <div className="mt-5 space-y-5"><FrequentlyViolatedRulesSection /><InvestigatorWorkloadSection /></div>
    </>
  );
}