import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError, logServerError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/server";
import { requireAssignedInvestigator } from "@/lib/auth/integrity-access";
import { withOracleTransaction } from "@/lib/db/oracle";
import { linkRuleToCase } from "@/lib/db/queries/integrity/03-cases/case-rules";

export const runtime = "nodejs";

const linkRuleSchema = z.object({
  ruleId: z.number().int().positive(),
});

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  const session = await getServerSession();
  const { caseId } = await params;

  if (!/^\d+$/.test(caseId)) {
    return apiError("Invalid case reference.", 400);
  }

  const parsed = linkRuleSchema.safeParse(
    await _request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiError("A valid rule must be selected.", 400);
  }

  try {
    const { officer } = await withOracleTransaction(async (connection) => {
      const officer = await requireAssignedInvestigator(
        connection,
        session,
        Number(caseId),
      );

      if (!officer) {
        return { officer: null };
      }

      await linkRuleToCase(connection, Number(caseId), parsed.data.ruleId);

      return { officer };
    });

    if (!officer) {
      return apiError("You are not authorized to modify this case.", 403);
    }

    return NextResponse.json({ data: { linked: true } });
  } catch (error) {
    logServerError("integrity link case rule", error);
    return apiError("Unable to link this rule to the case.");
  }
}