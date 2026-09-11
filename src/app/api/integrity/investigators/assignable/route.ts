import { NextResponse } from "next/server";

import {
  apiError,
  logServerError,
} from "@/lib/api/responses";
import {
  requireIntegrityManager,
} from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import {
  listAssignableInvestigators,
} from "@/lib/db/queries/integrity/07-access/assignable-investigators";

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
    const investigators = await withOracleConnection(
      listAssignableInvestigators,
    );

    return NextResponse.json({ data: investigators });
  } catch (error) {
    logServerError("assignable investigators", error);
    return apiError("Unable to load assignable investigators.");
  }
}
