import "server-only";

import type {
  FindingConclusion,
  FindingRecommendation,
  FindingReviewStatus,
  InvestigationFinding,
  PendingFindingReviewItem,
} from "@/data/contracts";
import { queryRows, type Connection } from "@/lib/db/oracle";
import { findCaseById } from "@/lib/db/queries/integrity/03-cases/case-details";
import { loadSql } from "@/lib/db/sql/load-sql";

type FindingRow = {
  PLAYER_ID: number;
  PLAYER_NAME: string;
  SUBMITTED_BY_ADMIN_ID: number;
  INVESTIGATOR_NAME: string;
  CONCLUSION: string;
  FINDING_DESCRIPTION: string;
  RECOMMENDATION: string;
  SUBMITTED_AT: Date;
  REVIEW_STATUS: string;
  REVIEWED_BY_ADMIN_ID: number | null;
  REVIEWER_NAME: string | null;
  REVIEWED_AT: Date | null;
  MANAGER_COMMENT: string | null;
};

export type UpsertFindingInput = {
  caseId: number;
  playerId: number;
  adminId: number;
  conclusion: FindingConclusion;
  description: string;
  recommendation: FindingRecommendation;
};

export type ReviewFindingInput = {
  caseId: number;
  playerId: number;
  reviewerId: number;
  reviewStatus: Exclude<FindingReviewStatus, "PENDING">;
  managerComment: string | null;
};

function toFinding(row: FindingRow): InvestigationFinding {
  return {
    playerId: String(row.PLAYER_ID),
    playerName: row.PLAYER_NAME,
    submittedByAdminId: String(row.SUBMITTED_BY_ADMIN_ID),
    investigatorName: row.INVESTIGATOR_NAME,
    conclusion: row.CONCLUSION as FindingConclusion,
    description: row.FINDING_DESCRIPTION,
    recommendation: row.RECOMMENDATION as FindingRecommendation,
    submittedAt: row.SUBMITTED_AT as unknown as string,
    reviewStatus: row.REVIEW_STATUS as FindingReviewStatus,
    reviewedByAdminId:
      row.REVIEWED_BY_ADMIN_ID === null
        ? null
        : String(row.REVIEWED_BY_ADMIN_ID),
    reviewerName: row.REVIEWER_NAME,
    reviewedAt: row.REVIEWED_AT as unknown as string | null,
    managerComment: row.MANAGER_COMMENT,
  };
}

export async function listCaseFindings(
  connection: Connection,
  caseId: number,
): Promise<readonly InvestigationFinding[]> {
  const sql = await loadSql("integrity/04-findings/case_findings.sql");

  const rows = await queryRows<FindingRow>(
    connection,
    sql,
    { case_id: caseId },
  );

  return rows.map(toFinding);
}

export async function listInvestigatorFindings(
  connection: Connection,
  adminId: number,
  caseId: number,
): Promise<readonly InvestigationFinding[]> {
  const record = await findCaseById(connection, caseId);

  if (!record) {
    return [];
  }

  const myPlayerIds = new Set(
    record.involvedPlayers
      .filter((assignment) =>
        assignment.investigatorIds.includes(String(adminId)),
      )
      .map((assignment) => assignment.player.personId),
  );

  const findings = await listCaseFindings(connection, caseId);

  return findings.filter((finding) => myPlayerIds.has(finding.playerId));
}

type PendingFindingReviewRow = {
  CASE_ID: number;
  PLAYER_ID: number;
  PLAYER_NAME: string;
  SUBMITTED_BY_ADMIN_ID: number;
  INVESTIGATOR_NAME: string;
  RECOMMENDATION: string;
  SUBMITTED_AT: Date;
  REVIEW_STATUS: string;
};

export async function listPendingFindingReviews(
  connection: Connection,
): Promise<readonly PendingFindingReviewItem[]> {
  const sql = await loadSql(
    "integrity/01-dashboard/pending_finding_reviews.sql",
  );

  const rows = await queryRows<PendingFindingReviewRow>(
    connection,
    sql,
  );

  return rows.map((row) => ({
    caseId: String(row.CASE_ID),
    playerId: String(row.PLAYER_ID),
    playerName: row.PLAYER_NAME,
    submittedByAdminId: String(row.SUBMITTED_BY_ADMIN_ID),
    investigatorName: row.INVESTIGATOR_NAME,
    recommendation:
      row.RECOMMENDATION as FindingRecommendation,
    submittedAt: row.SUBMITTED_AT as unknown as string,
    reviewStatus: row.REVIEW_STATUS as FindingReviewStatus,
  }));
}

export async function upsertInvestigationFinding(
  connection: Connection,
  input: UpsertFindingInput,
): Promise<void> {
  const sql = await loadSql("integrity/04-findings/upsert_finding.sql");

  await connection.execute(sql, {
    playerId: input.playerId,
    caseId: input.caseId,
    adminId: input.adminId,
    conclusion: input.conclusion,
    description: input.description,
    recommendation: input.recommendation,
  });
}

export async function reviewInvestigationFinding(
  connection: Connection,
  input: ReviewFindingInput,
): Promise<boolean> {
  const sql = await loadSql("integrity/04-findings/review_finding.sql");

  const result = await connection.execute(sql, {
    playerId: input.playerId,
    caseId: input.caseId,
    reviewStatus: input.reviewStatus,
    reviewerId: input.reviewerId,
    managerComment: input.managerComment,
  });

  return Number(result.rowsAffected) > 0;
}