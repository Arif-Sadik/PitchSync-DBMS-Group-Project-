import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError, logServerError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/server";
import { requireAssignedInvestigator } from "@/lib/auth/integrity-access";
import { withOracleTransaction } from "@/lib/db/oracle";
import {
  removeEvidence,
  updateEvidence,
} from "@/lib/db/queries/integrity/03-cases/case-evidence";

export const runtime = "nodejs";

const evidenceSchema = z.object({
  description: z.string().trim().min(1).max(2000),
  collectedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ caseId: string; evidenceNo: string }> },
) {
  const session = await getServerSession();
  const { caseId, evidenceNo } = await params;

  if (!/^\d+$/.test(caseId) || !/^\d+$/.test(evidenceNo)) {
    return apiError("Invalid case or evidence reference.", 400);
  }

  const parsed = evidenceSchema.safeParse(
    await _request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiError("Provide a description and a collected date.", 400);
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

      await updateEvidence(connection, Number(caseId), Number(evidenceNo), {
        description: parsed.data.description,
        collectedDate: parsed.data.collectedDate,
      });

      return { officer };
    });

    if (!officer) {
      return apiError("You are not authorized to modify this case.", 403);
    }

    return NextResponse.json({ data: { updated: true } });
  } catch (error) {
    logServerError("integrity update case evidence", error);
    return apiError("Unable to update this evidence item.");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ caseId: string; evidenceNo: string }> },
) {
  const session = await getServerSession();
  const { caseId, evidenceNo } = await params;

  if (!/^\d+$/.test(caseId) || !/^\d+$/.test(evidenceNo)) {
    return apiError("Invalid case or evidence reference.", 400);
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

      await removeEvidence(connection, Number(caseId), Number(evidenceNo));

      return { officer };
    });

    if (!officer) {
      return apiError("You are not authorized to modify this case.", 403);
    }

    return NextResponse.json({ data: { removed: true } });
  } catch (error) {
    logServerError("integrity remove case evidence", error);
    return apiError("Unable to remove this evidence item.");
  }
}