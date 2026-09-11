import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import { listCaseFindings } from "@/lib/db/queries/integrity/04-findings/findings";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  const session = await requireIntegrityManager();

  if (!session) {
    return apiError("Integrity Manager access is required.", 403);
  }

  const { caseId } = await params;

  if (!/^\d+$/.test(caseId)) {
    return apiError("Invalid case reference.", 400);
  }

  try {
    const findings = await withOracleConnection((connection) =>
      listCaseFindings(connection, Number(caseId)),
    );

    return NextResponse.json({ data: findings });
  } catch (error) {
    logServerError("integrity manager case findings", error);
    return apiError("Unable to load the findings for this case.");
  }
}