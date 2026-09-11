import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleTransaction } from "@/lib/db/oracle";
import { addPlayerToCase } from "@/lib/db/queries/integrity/03-cases/case-players";

export const runtime = "nodejs";

const addPlayerSchema = z.object({
  playerId: z.number().int().positive(),
});

export async function POST(
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

  const parsed = addPlayerSchema.safeParse(
    await _request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiError("A valid player must be selected.", 400);
  }

  try {
    await withOracleTransaction((connection) =>
      addPlayerToCase(
        connection,
        Number(caseId),
        parsed.data.playerId,
      ),
    );

    return NextResponse.json({ data: { added: true } });
  } catch (error) {
    logServerError("integrity add case player", error);
    return apiError("Unable to add this player to the case.");
  }
}