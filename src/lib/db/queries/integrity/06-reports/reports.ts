import "server-only";

import type {
  CaseWithoutEvidenceItem,
  FrequentlyViolatedRuleItem,
  InvestigatorWorkloadItem,
  UnassignedInvolvementItem,
} from "@/data/contracts";
import { queryRows, type Connection } from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

type CaseWithoutEvidenceRow = {
  CASE_ID: number;
  STATUS: string;
  DATE_OPENED: string;
  INVOLVEMENT_TYPE: string | null;
  REFERRAL_STATUS: string | null;
};

export async function getCasesWithoutEvidence(
  connection: Connection,
): Promise<readonly CaseWithoutEvidenceItem[]> {
  const sql = await loadSql(
    "integrity/06-reports/Q15_report_cases_without_evidence.sql",
  );

  const rows = await queryRows<CaseWithoutEvidenceRow>(
    connection,
    sql,
  );

  return rows.map((row) => ({
    caseId: String(row.CASE_ID),
    status: row.STATUS,
    dateOpened: row.DATE_OPENED,
    involvementType: row.INVOLVEMENT_TYPE,
    referralStatus: row.REFERRAL_STATUS,
  }));
}

type UnassignedInvolvementRow = {
  CASE_ID: number;
  STATUS: string;
  DATE_OPENED: string;
  PLAYER_ID: number;
  PLAYER: string;
  PLAYER_ROLE: string | null;
};

export async function getUnassignedInvolvements(
  connection: Connection,
): Promise<readonly UnassignedInvolvementItem[]> {
  const sql = await loadSql(
    "integrity/06-reports/Q16_report_unassigned_involvements.sql",
  );

  const rows = await queryRows<UnassignedInvolvementRow>(
    connection,
    sql,
  );

  return rows.map((row) => ({
    caseId: String(row.CASE_ID),
    status: row.STATUS,
    dateOpened: row.DATE_OPENED,
    playerId: String(row.PLAYER_ID),
    player: row.PLAYER,
    playerRole: row.PLAYER_ROLE,
  }));
}

type FrequentlyViolatedRuleRow = {
  RULE_ID: number;
  CLAUSE_NUMBER: string;
  CATEGORY: string;
  CASE_COUNT: number;
};

export async function getFrequentlyViolatedRules(
  connection: Connection,
  filters: {
    minimumCases?: number;
    fromDate?: string;
    toDate?: string;
  } = {},
): Promise<readonly FrequentlyViolatedRuleItem[]> {
  const sql = await loadSql(
    "integrity/06-reports/Q17_report_frequently_violated_rules.sql",
  );

  const rows = await queryRows<FrequentlyViolatedRuleRow>(
    connection,
    sql,
    {
      minimum_cases: filters.minimumCases ?? null,
      from_date: filters.fromDate ?? null,
      to_date: filters.toDate ?? null,
    },
  );

  return rows.map((row) => ({
    ruleId: String(row.RULE_ID),
    clauseNumber: row.CLAUSE_NUMBER,
    category: row.CATEGORY,
    caseCount: Number(row.CASE_COUNT),
  }));
}

type InvestigatorWorkloadRow = {
  INVESTIGATOR_ID: number;
  INVESTIGATOR: string;
  DESIGNATION: string | null;
  DEPARTMENT: string | null;
  ACTIVE_ASSIGNMENTS: number;
  ACTIVE_CASES: number;
};

export async function getInvestigatorWorkload(
  connection: Connection,
): Promise<readonly InvestigatorWorkloadItem[]> {
  const sql = await loadSql(
    "integrity/06-reports/Q18_report_investigator_workload.sql",
  );

  const rows = await queryRows<InvestigatorWorkloadRow>(
    connection,
    sql,
  );

  return rows.map((row) => ({
    investigatorId: String(row.INVESTIGATOR_ID),
    investigator: row.INVESTIGATOR,
    designation: row.DESIGNATION,
    department: row.DEPARTMENT,
    activeAssignments: Number(row.ACTIVE_ASSIGNMENTS),
    activeCases: Number(row.ACTIVE_CASES),
  }));
}