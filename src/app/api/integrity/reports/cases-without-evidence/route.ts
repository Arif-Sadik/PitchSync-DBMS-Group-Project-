import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import {
  getCasesWithoutEvidence,
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
    const cases = await withOracleConnection(
      getCasesWithoutEvidence,
    );

    return NextResponse.json({ data: cases });
  } catch (error) {
    logServerError("cases without evidence report", error);
    return apiError(
      "Unable to load cases without evidence.",
    );
  }
}
