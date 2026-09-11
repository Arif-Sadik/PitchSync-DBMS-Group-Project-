import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/server";
import { requireAssignedInvestigator } from "@/lib/auth/integrity-access";
import { withOracleConnection } from "@/lib/db/oracle";
import { listInvestigatorFindings } from "@/lib/db/queries/integrity/04-findings/findings";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  const { caseId } = await params;

  if (!/^\d+$/.test(caseId)) {
    return apiError("Invalid case reference.", 400);
  }

  const session = await getServerSession();

  try {
    const data = await withOracleConnection(async (connection) => {
      const investigator = await requireAssignedInvestigator(
        connection,
        session,
        Number(caseId),
      );

      if (!investigator) {
        return null;
      }

      return listInvestigatorFindings(
        connection,
        Number(investigator.personId),
        Number(caseId),
      );
    });

    if (!data) {
      return apiError(
        "You are not authorized to view findings for this case.",
        403,
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    logServerError("investigator case findings", error);
    return apiError("Unable to load the findings for this case.");
  }
}