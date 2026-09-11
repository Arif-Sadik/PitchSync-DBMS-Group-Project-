import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityInvestigator } from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import { getInvestigatorDashboardMetrics } from "@/lib/db/queries/integrity/01-dashboard/investigator-metrics";

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
    const metrics = await withOracleConnection(
      (connection) =>
        getInvestigatorDashboardMetrics(
          connection,
          Number(session.personId),
        ),
    );

    return NextResponse.json({ data: metrics });
  } catch (error) {
    logServerError("investigator dashboard metrics", error);
    return apiError(
      "Unable to load dashboard metrics.",
    );
  }
}