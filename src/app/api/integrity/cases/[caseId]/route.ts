import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import {
  requireIntegrityInvestigator,
  requireIntegrityManager,
} from "@/lib/auth/server";
import {
  hasActiveInvestigationAssignment,
} from "@/lib/db/queries/integrity/07-access/integrity-access";
import { withOracleConnection } from "@/lib/db/oracle";
import { findCaseById } from "@/lib/db/queries/integrity/03-cases/case-details";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  const { caseId } = await params;
  if (!/^\d+$/.test(caseId)) {
    return apiError("Invalid case reference.", 400);
  }

  const managerSession = await requireIntegrityManager();
  const isManager = Boolean(managerSession);
  let isAuthorized = isManager;

  let investigatorPersonId: number | null = null;

  if (!isAuthorized) {
    const investigatorSession =
      await requireIntegrityInvestigator();

    if (investigatorSession) {
      const personId = Number(investigatorSession.personId);
      const assigned = await withOracleConnection(
        (connection) =>
          hasActiveInvestigationAssignment(
            connection,
            personId,
            Number(caseId),
          ),
      );

      isAuthorized = assigned;
      investigatorPersonId = assigned ? personId : null;
    }
  }

  if (!isAuthorized) {
    return apiError(
      "You are not authorized to view this case.",
      403,
    );
  }

  try {
    const data = await withOracleConnection(
      async (connection) => {
        const record = await findCaseById(
          connection,
          Number(caseId),
        );

        if (!record) {
          return null;
        }

        if (investigatorPersonId === null) {
          return record;
        }

        return {
          caseId: record.caseId,
          status: record.status,
          dateOpened: record.dateOpened,
          referralStatus: record.referralStatus,
          referredToAuthority: record.referredToAuthority,
          complaints: record.complaints,
          rules: record.rules,
          evidence: record.evidence,
          involvedPlayers: record.involvedPlayers.filter(
            (assignment) =>
              assignment.investigatorIds.includes(
                String(investigatorPersonId),
              ),
          ),
        };
      },
    );

    if (!data) {
      return apiError("Integrity case not found.", 404);
    }

    return NextResponse.json({ data });
  } catch (error) {
    logServerError("integrity case detail", error);
    return apiError("Unable to load this integrity case.");
  }
}
