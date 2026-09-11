import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError, logServerError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/server";
import { requireAssignedInvestigatorForPlayer } from "@/lib/auth/integrity-access";
import { withOracleTransaction } from "@/lib/db/oracle";
import { upsertInvestigationFinding } from "@/lib/db/queries/integrity/04-findings/findings";

export const runtime = "nodejs";

const findingSchema = z.object({
  conclusion: z.enum([
    "SUBSTANTIATED",
    "NOT_SUBSTANTIATED",
    "INCONCLUSIVE",
  ]),
  description: z.string().trim().min(1).max(2000),
  recommendation: z.enum([
    "CLOSE_CASE",
    "EXTERNAL_REFERRAL",
    "FURTHER_INVESTIGATION",
    "NO_ACTION",
  ]),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ caseId: string; playerId: string }> },
) {
  const session = await getServerSession();
  const { caseId, playerId } = await params;

  if (!/^\d+$/.test(caseId) || !/^\d+$/.test(playerId)) {
    return apiError("Invalid case or player reference.", 400);
  }

  const parsed = findingSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiError(
      "Provide a conclusion, a description, and a recommendation.",
      400,
    );
  }

  try {
    const { officer } = await withOracleTransaction(
      async (connection) => {
        const officer = await requireAssignedInvestigatorForPlayer(
          connection,
          session,
          Number(caseId),
          Number(playerId),
        );

        if (!officer) {
          return { officer: null };
        }

        await upsertInvestigationFinding(connection, {
          caseId: Number(caseId),
          playerId: Number(playerId),
          adminId: Number(officer.personId),
          conclusion: parsed.data.conclusion,
          description: parsed.data.description,
          recommendation: parsed.data.recommendation,
        });

        return { officer };
      },
    );

    if (!officer) {
      return apiError(
        "You are not authorized to submit a finding for this involvement.",
        403,
      );
    }

    return NextResponse.json({ data: { submitted: true } });
  } catch (error) {
    logServerError("integrity submit finding", error);
    return apiError("Unable to submit this finding.");
  }
}