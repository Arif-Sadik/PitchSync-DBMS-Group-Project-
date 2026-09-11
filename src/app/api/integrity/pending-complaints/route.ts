import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import {
  getPendingComplaints,
} from "@/lib/db/queries/integrity/02-complaints/pending-complaints";

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
    const complaints = await withOracleConnection(
      getPendingComplaints,
    );

    return NextResponse.json({ data: complaints });
  } catch (error) {
    logServerError("pending complaints", error);
    return apiError(
      "Unable to load pending complaints.",
    );
  }
}
