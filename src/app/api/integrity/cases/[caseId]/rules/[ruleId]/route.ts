import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/server";
import { requireAssignedInvestigator } from "@/lib/auth/integrity-access";
import { withOracleTransaction } from "@/lib/db/oracle";
import { unlinkRuleFromCase } from "@/lib/db/queries/integrity/03-cases/case-rules";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ caseId: string; ruleId: string }> },
) {
  const session = await getServerSession();
  const { caseId, ruleId } = await params;

  if (!/^\d+$/.test(caseId) || !/^\d+$/.test(ruleId)) {
    return apiError("Invalid case or rule reference.", 400);
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

      await unlinkRuleFromCase(connection, Number(caseId), Number(ruleId));

      return { officer };
    });

    if (!officer) {
      return apiError("You are not authorized to modify this case.", 403);
    }

    return NextResponse.json({ data: { removed: true } });
  } catch (error) {
    logServerError("integrity unlink case rule", error);
    return apiError("Unable to unlink this rule from the case.");
  }
}