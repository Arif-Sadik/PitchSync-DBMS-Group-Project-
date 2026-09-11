import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import {
  getInvestigatorWorkload,
} from "@/lib/db/queries/integrity/06-reports/reports";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireIntegrityManager();

  if (!session) {
    return apiError(
      "Integrity Manager access is required.",
      403,
    );
  }

  try {
    const workload = await withOracleConnection(
      getInvestigatorWorkload,
    );

    return NextResponse.json({ data: workload });
  } catch (error) {
    logServerError("investigator workload report", error);
    return apiError(
      "Unable to load investigator workload.",
    );
  }
}
