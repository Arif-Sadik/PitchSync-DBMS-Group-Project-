"use client";

import Link from "next/link";
import { BookOpen, BriefcaseBusiness, Clock3, FolderCheck, FolderOpen, ShieldCheck, ShieldAlert, Undo2, UserSearch } from "lucide-react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { MetricCard } from "@/components/data-display/metric-card";
import { Button } from "@/components/ui/button";
import { DataStateView } from "@/components/feedback/data-state-view";
import { SectionCard } from "@/components/data-display/section-card";
import { PageHeader } from "@/components/page/page-header";
import type { AssignedCaseItem, InvestigatorDashboardMetrics, NeedsRevisionFindingItem, PendingFindingReviewItem } from "@/data/contracts";
import { useApiData } from "@/features/shared/use-api-data";
import { useAuth } from "@/features/auth";
import { formatDate, formatDateTime } from "@/lib/format-date";
import { recommendationLabels } from "@/features/integrity/04-findings/finding-details";
import { ConfidentialityNotice } from "@/features/integrity/07-shared/confidentiality-notice";
import { CurrentUserCard } from "@/features/profile/current-user-card";
import { DashboardMetrics, DashboardTable, useDashboardOverview } from "@/features/dashboards/dashboard-data";

const metricDefinitions = [
  { label: "Complaints", helper: "Active records", icon: ShieldAlert },
  { label: "Cases", helper: "Active records", icon: BriefcaseBusiness },
  { label: "Assigned investigators", helper: "Distinct investigators", icon: UserSearch },
  { label: "Evidence items", helper: "Active records", icon: ShieldCheck },
] as const;

const investigatorMetricDefinitions = [
  { label: "Active cases", helper: "Cases assigned to me, not closed", icon: FolderOpen },
  { label: "Active assignments", helper: "Player-case involvements", icon: BriefcaseBusiness },
  { label: "Pending review", helper: "Findings awaiting manager review", icon: Clock3 },
  { label: "Revision requested", helper: "Findings to revise", icon: Undo2 },
] as const;

function ManagerDashboard() {
  const state = useDashboardOverview();
  const pendingFindings = useApiData<readonly PendingFindingReviewItem[]>("/api/integrity/dashboard/finding-reviews");
  const pendingCount =
    pendingFindings.status === "ready" && pendingFindings.data
      ? pendingFindings.data.length.toLocaleString()
      : pendingFindings.status === "loading"
        ? "…"
        : "—";
  return (
    <>
      <ConfidentialityNotice />
      <PageHeader eyebrow="Integrity & compliance" title="Integrity oversight" description="Review complaints, cases, investigators, rule violations, and case evidence." />
      <CurrentUserCard />
      <DashboardMetrics definitions={metricDefinitions} state={state} />
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3"><Button asChild><Link href="/integrity/complaints"><ShieldAlert />Complaints</Link></Button><Button asChild variant="outline"><Link href="/integrity/cases"><BriefcaseBusiness />Cases</Link></Button><Button asChild variant="outline"><Link href="/integrity/rulebook"><BookOpen />Rulebook</Link></Button></section>
      <SectionCard title="Pending finding reviews" description="Findings awaiting your review, submitted by assigned investigators." icon={FolderCheck} action={<span className="rounded-lg bg-[var(--primary-soft)] px-2.5 py-1 text-sm font-semibold text-[var(--primary)]">{pendingCount} awaiting review</span>}>
        <DataStateView state={pendingFindings} emptyTitle="No pending finding reviews">
          {(findings) => (
            <DataTableShell
              minWidth={760}
              columns={["Case ID", "Player", "Investigator", "Recommendation", "Submitted", "Action"]}
              rows={(findings ?? []).map((finding) => ({
                key: `${finding.caseId}-${finding.playerId}`,
                cells: [
                  finding.caseId,
                  <div key="player" className="flex flex-col"><span className="font-medium">{finding.playerName}</span><span className="text-xs text-[var(--text-muted)]">#{finding.playerId}</span></div>,
                  finding.investigatorName,
                  recommendationLabels[finding.recommendation],
                  formatDateTime(finding.submittedAt),
                  <Button key="review" asChild variant="outline" size="sm"><Link href={`/integrity/cases/${finding.caseId}`}>Review</Link></Button>,
                ],
              }))}
            />
          )}
        </DataStateView>
      </SectionCard>
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2"><SectionCard title="Case progress"><DashboardTable state={state} table="primaryRows" minWidth={620} columns={["Case ID", "Status", "Date opened", "Players", "Investigators"]} emptyTitle="No cases found" /></SectionCard><SectionCard title="Complaint sources"><DashboardTable state={state} table="secondaryRows" minWidth={620} columns={["Complaint ID", "Date received", "Source type", "Linked cases"]} emptyTitle="No complaints found" /></SectionCard></section>
    </>
  );
}

function InvestigatorDashboard() {
  const metrics = useApiData<InvestigatorDashboardMetrics>("/api/integrity/investigator/dashboard");
  const cases = useApiData<readonly AssignedCaseItem[]>("/api/integrity/my-cases");
  const needsRevision = useApiData<readonly NeedsRevisionFindingItem[]>("/api/integrity/investigator/needs-revision");
  const metricValues = metrics.status === "ready" && metrics.data ? [metrics.data.activeCases, metrics.data.activeAssignments, metrics.data.pendingReviewCount, metrics.data.revisionRequestedCount] : null;
  return (
    <>
      <ConfidentialityNotice />
      <PageHeader eyebrow="Integrity & compliance" title="My investigations" description="Review the integrity cases and assignments currently assigned to you." />
      <CurrentUserCard />
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {investigatorMetricDefinitions.map((definition, index) => (
          <MetricCard key={definition.label} label={definition.label} icon={definition.icon} value={metrics.status === "loading" ? "…" : metricValues?.[index]?.toLocaleString() ?? "—"} helper={metrics.status === "ready" ? definition.helper : metrics.status === "loading" ? "Loading live data" : "Unable to load"} />
        ))}
      </section>
      {metrics.status === "ready" && metrics.data ? <p className="text-sm text-[var(--text-muted)]">Closed assigned cases: <span className="font-medium text-[var(--text)]">{metrics.data.closedAssignedCases.toLocaleString()}</span></p> : null}
      {metrics.status === "ready" && metrics.data && metrics.data.revisionRequestedCount > 0 ? (
        <SectionCard title="Needs revision" description="Findings the manager asked you to revise." icon={Undo2}>
          <DataStateView state={needsRevision} emptyTitle="No findings need revision">
            {(findings) => (
              <DataTableShell
                minWidth={720}
                columns={["Case ID", "Player", "Manager comment", "Action"]}
                rows={(findings ?? []).map((finding) => ({
                  key: `${finding.caseId}-${finding.playerId}`,
                  cells: [
                    finding.caseId,
                    <div key="player" className="flex flex-col"><span className="font-medium">{finding.playerName}</span><span className="text-xs text-[var(--text-muted)]">Revision requested</span></div>,
                    finding.managerComment ?? "—",
                    <Button key="view" asChild variant="outline" size="sm"><Link href={`/integrity/cases/${finding.caseId}`}>View case</Link></Button>,
                  ],
                }))}
              />
            )}
          </DataStateView>
        </SectionCard>
      ) : null}
      <SectionCard title="My active cases" description="Cases assigned to you with an open status." icon={BriefcaseBusiness}>
        <DataStateView state={cases} emptyTitle="No active assigned cases">
          {(rows) => (
            <DataTableShell
              minWidth={720}
              columns={["Case ID", "Status", "Date opened", "Assigned player", "Involvement type", "Actions"]}
              rows={(rows ?? []).filter((caseRecord) => caseRecord.status !== "CLOSED").map((caseRecord) => ({
                key: `${caseRecord.caseId}-${caseRecord.assignedPlayerId}`,
                cells: [
                  caseRecord.caseId,
                  caseRecord.status,
                  formatDate(caseRecord.dateOpened),
                  <div key="player" className="flex flex-col"><span className="font-medium">{caseRecord.assignedPlayerName}</span><span className="text-xs text-[var(--text-muted)]">#{caseRecord.assignedPlayerId}</span></div>,
                  caseRecord.involvementType ?? "—",
                  <Button key="view" asChild variant="outline" size="sm"><Link href={`/integrity/cases/${caseRecord.caseId}`}>View</Link></Button>,
                ],
              }))}
            />
          )}
        </DataStateView>
      </SectionCard>
    </>
  );
}

export function IntegrityDashboard() {
  const { session } = useAuth();
  const scope = session?.integrityScope;
  return scope === "INVESTIGATOR" ? <InvestigatorDashboard /> : <ManagerDashboard />;
}