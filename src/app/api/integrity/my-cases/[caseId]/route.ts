import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/server";
import { requireAssignedInvestigator } from "@/lib/auth/integrity-access";
import { withOracleConnection } from "@/lib/db/oracle";
import { getAssignedCaseForInvestigator } from "@/lib/db/queries/integrity/03-cases/investigator-cases";

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
      const investigator =
        await requireAssignedInvestigator(
          connection,
          session,
          Number(caseId),
        );

      if (!investigator) {
        return null;
      }

      return getAssignedCaseForInvestigator(
        connection,
        Number(investigator.personId),
        Number(caseId),
      );
    });

    if (!data) {
      return apiError(
        "You are not authorized to view this case.",
        403,
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    logServerError("investigator case detail", error);
    return apiError("Unable to load this integrity case.");
  }
}