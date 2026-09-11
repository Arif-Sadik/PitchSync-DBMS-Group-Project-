import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleTransaction } from "@/lib/db/oracle";
import { removePlayerFromCase } from "@/lib/db/queries/integrity/03-cases/case-players";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ caseId: string; playerId: string }> },
) {
  const session = await requireIntegrityManager();

  if (!session) {
    return apiError("Integrity Manager access is required.", 403);
  }

  const { caseId, playerId } = await params;

  if (!/^\d+$/.test(caseId) || !/^\d+$/.test(playerId)) {
    return apiError("Invalid case or player reference.", 400);
  }

  try {
    await withOracleTransaction((connection) =>
      removePlayerFromCase(
        connection,
        Number(caseId),
        Number(playerId),
      ),
    );

    return NextResponse.json({ data: { removed: true } });
  } catch (error) {
    logServerError("integrity remove case player", error);
    return apiError("Unable to remove this player from the case.");
  }
}