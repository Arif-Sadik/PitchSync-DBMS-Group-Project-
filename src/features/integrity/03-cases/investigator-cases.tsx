"use client";

import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { Button } from "@/components/ui/button";
import { DataStateView } from "@/components/feedback/data-state-view";
import { PageHeader } from "@/components/page/page-header";
import type { AssignedCaseItem } from "@/data/contracts";
import { useApiData } from "@/features/shared/use-api-data";
import { formatDate } from "@/lib/format-date";
import { ConfidentialityNotice } from "@/features/integrity/07-shared/confidentiality-notice";

export function InvestigatorCases() {
  const state = useApiData<readonly AssignedCaseItem[]>("/api/integrity/my-cases");
  return (
    <>
      <ConfidentialityNotice />
      <PageHeader eyebrow="Integrity domain" title="My Cases" description="Review the integrity cases assigned to you for investigation. Each row represents one of your player-case assignments." />
      <DataStateView state={state} emptyTitle="No assigned cases">
        {(cases) => (
          <DataTableShell
            minWidth={760}
            columns={["Case ID", "Status", "Assigned player", "Involvement type", "Date opened", "Actions"]}
            rows={(cases ?? []).map((caseRecord) => ({
              key: `${caseRecord.caseId}-${caseRecord.assignedPlayerId}`,
              cells: [
                caseRecord.caseId,
                caseRecord.status,
                <div key="player" className="flex flex-col"><span className="font-medium">{caseRecord.assignedPlayerName}</span><span className="text-xs text-[var(--text-muted)]">#{caseRecord.assignedPlayerId}</span></div>,
                caseRecord.involvementType ?? "—",
                formatDate(caseRecord.dateOpened),
                <Button key="view" asChild variant="outline" size="sm"><Link href={`/integrity/cases/${caseRecord.caseId}`}>View</Link></Button>,
              ],
            }))}
          />
        )}
      </DataStateView>
      <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]"><BriefcaseBusiness className="size-4" />Only assignments to you appear here. A case with several involved players assigned to you appears as several rows.</p>
    </>
  );
}
