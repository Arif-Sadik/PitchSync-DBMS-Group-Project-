import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityInvestigator } from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import {
  getMyAssignedCases,
} from "@/lib/db/queries/integrity/03-cases/assigned-cases";

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
    const cases = await withOracleConnection(
      (connection) =>
        getMyAssignedCases(
          connection,
          Number(session.personId),
        ),
    );

    return NextResponse.json({ data: cases });
  } catch (error) {
    logServerError("my assigned cases", error);
    return apiError(
      "Unable to load assigned cases.",
    );
  }
}
