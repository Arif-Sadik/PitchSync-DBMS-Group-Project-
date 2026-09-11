import "server-only";

import type {
  FindingRecommendation,
  FindingReviewStatus,
  InvestigatorDashboardMetrics,
  NeedsRevisionFindingItem,
} from "@/data/contracts";
import { queryRows, type Connection } from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

type DashboardMetricsRow = {
  ACTIVE_CASES: number;
  ACTIVE_ASSIGNMENTS: number;
  CLOSED_CASES: number;
};

type FindingReviewMetricsRow = {
  PENDING_REVIEW_COUNT: number;
  REVISION_REQUESTED_COUNT: number;
};

export async function getInvestigatorDashboardMetrics(
  connection: Connection,
  adminId: number,
): Promise<InvestigatorDashboardMetrics> {
  const sql = await loadSql(
    "integrity/01-dashboard/dashboard_metrics.sql",
  );

  const rows = await queryRows<DashboardMetricsRow>(
    connection,
    sql,
    { admin_id: adminId },
  );

  const findingSql = await loadSql(
    "integrity/01-dashboard/finding_review_metrics.sql",
  );

  const findingRows = await queryRows<FindingReviewMetricsRow>(
    connection,
    findingSql,
    { admin_id: adminId },
  );

  const row = rows[0];
  const findingRow = findingRows[0];

  return {
    activeCases: Number(row?.ACTIVE_CASES ?? 0),
    activeAssignments: Number(row?.ACTIVE_ASSIGNMENTS ?? 0),
    closedAssignedCases: Number(row?.CLOSED_CASES ?? 0),
    pendingReviewCount: Number(
      findingRow?.PENDING_REVIEW_COUNT ?? 0,
    ),
    revisionRequestedCount: Number(
      findingRow?.REVISION_REQUESTED_COUNT ?? 0,
    ),
  };
}

type NeedsRevisionFindingRow = {
  CASE_ID: number;
  PLAYER_ID: number;
  PLAYER_NAME: string;
  RECOMMENDATION: string;
  SUBMITTED_AT: Date;
  REVIEW_STATUS: string;
  MANAGER_COMMENT: string | null;
};

export async function listFindingsNeedingRevision(
  connection: Connection,
  adminId: number,
): Promise<readonly NeedsRevisionFindingItem[]> {
  const sql = await loadSql(
    "integrity/04-findings/needs_revision_findings.sql",
  );

  const rows = await queryRows<NeedsRevisionFindingRow>(
    connection,
    sql,
    { admin_id: adminId },
  );

  return rows.map((row) => ({
    caseId: String(row.CASE_ID),
    playerId: String(row.PLAYER_ID),
    playerName: row.PLAYER_NAME,
    recommendation:
      row.RECOMMENDATION as FindingRecommendation,
    submittedAt: row.SUBMITTED_AT as unknown as string,
    reviewStatus: row.REVIEW_STATUS as FindingReviewStatus,
    managerComment: row.MANAGER_COMMENT,
  }));
}