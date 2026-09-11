import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import {
  requireIntegrityInvestigator,
  requireIntegrityManager,
} from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import { findRuleById } from "@/lib/db/queries/integrity/05-rulebook/rulebook";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ruleId: string }> },
) {
  const { ruleId } = await params;
  if (!/^\d+$/.test(ruleId)) {
    return apiError("Invalid rule reference.", 400);
  }

  const manager = await requireIntegrityManager();
  const investigator = await requireIntegrityInvestigator();

  if (!manager && !investigator) {
    return apiError("Integrity access is required.", 403);
  }

  try {
    const data = await withOracleConnection((connection) =>
      findRuleById(connection, Number(ruleId)),
    );

    if (!data) {
      return apiError(
        "Rulebook record not found.",
        404,
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    logServerError("rulebook detail", error);
    return apiError(
      "Unable to load this rulebook record.",
    );
  }
}
