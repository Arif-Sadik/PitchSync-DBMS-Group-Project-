import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityInvestigator } from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import { listFindingsNeedingRevision } from "@/lib/db/queries/integrity/01-dashboard/investigator-metrics";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireIntegrityInvestigator();

  if (!session) {
    return apiError(
      "Investigator access is required.",
      403,
    );
  }

  try {
    const findings = await withOracleConnection(
      (connection) =>
        listFindingsNeedingRevision(
          connection,
          Number(session.personId),
        ),
    );

    return NextResponse.json({ data: findings });
  } catch (error) {
    logServerError("needs revision findings", error);
    return apiError(
      "Unable to load findings needing revision.",
    );
  }
}