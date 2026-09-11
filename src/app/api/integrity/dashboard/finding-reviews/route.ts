import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import { listPendingFindingReviews } from "@/lib/db/queries/integrity/04-findings/findings";

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
    const findings = await withOracleConnection(
      listPendingFindingReviews,
    );

    return NextResponse.json({ data: findings });
  } catch (error) {
    logServerError("pending finding reviews", error);
    return apiError(
      "Unable to load pending finding reviews.",
    );
  }
}