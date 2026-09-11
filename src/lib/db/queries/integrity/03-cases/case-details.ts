import "server-only";

import type {
  ComplaintRecord,
  IntegrityCaseRecord,
  IntegrityInvestigator,
  InvestigationAssignment,
  RulebookRecord,
} from "@/data/contracts";
import {
  queryRows,
  type Connection,
} from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

type CaseOverviewRow = {
  CASE_ID: number;
  STATUS: string;
  DATE_OPENED: string;
  INVOLVEMENT_TYPE: string | null;
  REFERRAL_STATUS: string | null;
  REFERRED_TO_AUTHORITY: string | null;
};

type InvolvementRow = {
  PLAYER_ID: number;
  PLAYER: string;
  PLAYER_ROLE: string;
  INVOLVEMENT_TYPE: string | null;
  INVESTIGATOR_ID: number | null;
  ASSIGNED_INVESTIGATOR: string | null;
};

type ComplaintSourceRow = {
  COMPLAINT_ID: number;
  DATE_RECEIVED: string;
  SOURCE_TYPE: string;
  DESCRIPTION: string;
  MISCONDUCT_TYPE: string | null;
};

type RuleRow = {
  RULE_ID: number;
  CLAUSE_NUMBER: string;
  CATEGORY: string;
};

type EvidenceRow = {
  EVIDENCE_NUMBER: number;
  DESCRIPTION: string;
  COLLECTED_DATE: string;
};

type InvestigationTeamRow = {
  INVESTIGATOR_ID: number;
  INVESTIGATOR: string;
  DESIGNATION: string | null;
  DEPARTMENT: string | null;
  ACCESS_SCOPE: string | null;
  ASSIGNED_PLAYERS: number;
};

export async function findCaseById(
  connection: Connection,
  caseId: number,
): Promise<IntegrityCaseRecord | null> {
  const [
    overviewSql,
    involvedPlayersSql,
    investigationTeamSql,
    complaintSourcesSql,
    rulesSql,
    evidenceSql,
  ] = await Promise.all([
    loadSql("integrity/03-cases/Q07_case_overview.sql"),
    loadSql("integrity/03-cases/Q08_case_involved_players.sql"),
    loadSql("integrity/03-cases/Q09_case_investigation_team.sql"),
    loadSql("integrity/03-cases/Q10_case_complaint_sources.sql"),
    loadSql("integrity/03-cases/Q11_case_rules.sql"),
    loadSql("integrity/03-cases/Q12_case_evidence.sql"),
  ]);

  const [
    overviewRows,
    involvementRows,
    investigationTeamRows,
    complaintRows,
    ruleRows,
    evidenceRows,
  ] = await Promise.all([
    queryRows<CaseOverviewRow>(
      connection,
      overviewSql,
      { case_id: caseId },
    ),
    queryRows<InvolvementRow>(
      connection,
      involvedPlayersSql,
      { case_id: caseId },
    ),
    queryRows<InvestigationTeamRow>(
      connection,
      investigationTeamSql,
      { case_id: caseId },
    ),
    queryRows<ComplaintSourceRow>(
      connection,
      complaintSourcesSql,
      { case_id: caseId },
    ),
    queryRows<RuleRow>(
      connection,
      rulesSql,
      { case_id: caseId },
    ),
    queryRows<EvidenceRow>(
      connection,
      evidenceSql,
      { case_id: caseId },
    ),
  ]);

  const base = overviewRows[0];
  if (!base) return null;

  const assignmentsByPlayer = new Map<
    string,
    InvestigationAssignment
  >();
  const investigatorsById = new Map<
    string,
    {
      administratorId: string;
      fullName: string;
      designation: string;
      department: string;
      assignedPlayerIds: string[];
    }
  >();

  for (const row of involvementRows) {
    const playerId = String(row.PLAYER_ID);
    const existing = assignmentsByPlayer.get(playerId) ?? {
      player: {
        personId: playerId,
        fullName: row.PLAYER,
        playerRole: row.PLAYER_ROLE,
        gender: "MALE" as const,
      },
      involvementType: row.INVOLVEMENT_TYPE ?? "Not recorded",
      investigatorIds: [] as string[],
    };

    if (row.INVESTIGATOR_ID !== null) {
      const investigatorId = String(row.INVESTIGATOR_ID);
      assignmentsByPlayer.set(playerId, {
        ...existing,
        investigatorIds: [
          ...new Set([
            ...existing.investigatorIds,
            investigatorId,
          ]),
        ],
      });

      const investigator =
        investigatorsById.get(investigatorId) ?? {
          administratorId: investigatorId,
          fullName:
            row.ASSIGNED_INVESTIGATOR ?? investigatorId,
          designation: "",
          department: "",
          assignedPlayerIds: [] as string[],
        };

      investigator.assignedPlayerIds = [
        ...new Set([
          ...investigator.assignedPlayerIds,
          playerId,
        ]),
      ];
      investigatorsById.set(investigatorId, investigator);
    } else {
      assignmentsByPlayer.set(playerId, existing);
    }
  }

  const complaints: readonly ComplaintRecord[] =
    complaintRows.map((row) => ({
      complaintId: String(row.COMPLAINT_ID),
      sourceType: row.SOURCE_TYPE,
      dateReceived: row.DATE_RECEIVED,
      description: row.DESCRIPTION,
      misconductType: row.MISCONDUCT_TYPE ?? undefined,
      caseIds: [String(base.CASE_ID)],
    }));

  const rules: readonly RulebookRecord[] = ruleRows.map(
    (row) => ({
      ruleId: String(row.RULE_ID),
      clauseNumber: row.CLAUSE_NUMBER,
      category: row.CATEGORY,
      caseIds: [String(base.CASE_ID)],
    }),
  );

  const investigators: readonly IntegrityInvestigator[] =
    investigationTeamRows.map((row) => {
      const id = String(row.INVESTIGATOR_ID);
      return {
        administratorId: id,
        fullName: row.INVESTIGATOR,
        designation: row.DESIGNATION ?? "",
        department: row.DEPARTMENT ?? "",
        assignedPlayerIds:
          investigatorsById.get(id)?.assignedPlayerIds ?? [],
      };
    });

  return {
    caseId: String(base.CASE_ID),
    status: base.STATUS,
    dateOpened: base.DATE_OPENED,
    referralStatus: base.REFERRAL_STATUS ?? "",
    referredToAuthority:
      base.REFERRED_TO_AUTHORITY ?? undefined,
    complaints,
    involvedPlayers: [...assignmentsByPlayer.values()],
    rules,
    evidence: evidenceRows.map((row) => ({
      evidenceNumber: String(row.EVIDENCE_NUMBER),
      description: row.DESCRIPTION,
      collectedDate: row.COLLECTED_DATE,
    })),
    investigators,
  };
}