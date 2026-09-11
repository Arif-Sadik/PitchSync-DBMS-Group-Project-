import { NextResponse } from "next/server";
import { z } from "zod";

import {
  apiError,
  logServerError,
} from "@/lib/api/responses";
import {
  requireIntegrityManager,
} from "@/lib/auth/server";
import { oracleErrorNumber } from "@/lib/db/oracle-error";
import {
  withOracleTransaction,
} from "@/lib/db/oracle";
import {
  assignInvestigator,
} from "@/lib/db/queries/integrity/03-cases/case-writes";

export const runtime = "nodejs";

const assignSchema = z.object({
  investigatorId: z.number().int().positive(),
});

export async function PATCH(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      caseId: string;
      playerId: string;
    }>;
  },
) {
  const session = await requireIntegrityManager();

  if (!session) {
    return apiError(
      "Integrity Manager access is required.",
      403,
    );
  }

  const { caseId, playerId } = await params;

  if (!/^\d+$/.test(caseId) || !/^\d+$/.test(playerId)) {
    return apiError("Invalid case or player reference.", 400);
  }

  const parsed = assignSchema.safeParse(
    await _request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiError(
      "A valid investigator must be selected.",
      400,
    );
  }

  try {
    await withOracleTransaction((connection) =>
      assignInvestigator(connection, {
        caseId: Number(caseId),
        playerId: Number(playerId),
        investigatorId: parsed.data.investigatorId,
      }),
    );

    return NextResponse.json({ data: { assigned: true } });
  } catch (error) {
    const code = oracleErrorNumber(error);

    if (code === -20001) {
      return apiError(
        "The involvement is not available for investigator assignment.",
        400,
      );
    }

    if (code === -20002) {
      return apiError(
        "The selected officer is not an assignable investigator.",
        400,
      );
    }

    logServerError("integrity investigator assignment", error);
    return apiError("Unable to update the investigator assignment.");
  }
}
