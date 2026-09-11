import "server-only";

import type {
  InvestigatorCaseDetail,
  InvestigationAssignment,
} from "@/data/contracts";
import type { Connection } from "@/lib/db/oracle";
import { findCaseById } from "@/lib/db/queries/integrity/03-cases/case-details";

export async function getAssignedCaseForInvestigator(
  connection: Connection,
  adminId: number,
  caseId: number,
): Promise<InvestigatorCaseDetail | null> {
  const record = await findCaseById(connection, caseId);

  if (!record) {
    return null;
  }

  const myAssignments: readonly InvestigationAssignment[] =
    record.involvedPlayers.filter((assignment) =>
      assignment.investigatorIds.includes(String(adminId)),
    );

  return {
    caseId: record.caseId,
    status: record.status,
    dateOpened: record.dateOpened,
    referralStatus: record.referralStatus,
    referredToAuthority: record.referredToAuthority,
    complaints: record.complaints,
    rules: record.rules,
    evidence: record.evidence,
    myAssignments,
  };
}