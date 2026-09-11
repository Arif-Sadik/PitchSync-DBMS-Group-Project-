import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError, logServerError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/server";
import { requireAssignedInvestigator } from "@/lib/auth/integrity-access";
import { withOracleTransaction } from "@/lib/db/oracle";
import { addEvidence } from "@/lib/db/queries/integrity/03-cases/case-evidence";

export const runtime = "nodejs";

const evidenceSchema = z.object({
  description: z.string().trim().min(1).max(2000),
  collectedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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

  const parsed = evidenceSchema.safeParse(
    await _request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiError("Provide a description and a collected date.", 400);
  }

  try {
    const { officer, evidenceNumber } = await withOracleTransaction(
      async (connection) => {
        const officer = await requireAssignedInvestigator(
          connection,
          session,
          Number(caseId),
        );

        if (!officer) {
          return { officer: null, evidenceNumber: null };
        }

        const evidenceNumber = await addEvidence(connection, Number(caseId), {
          description: parsed.data.description,
          collectedDate: parsed.data.collectedDate,
        });

        return { officer, evidenceNumber };
      },
    );

    if (!officer) {
      return apiError("You are not authorized to modify this case.", 403);
    }

    return NextResponse.json(
      { data: { evidenceNumber: String(evidenceNumber) } },
      { status: 201 },
    );
  } catch (error) {
    logServerError("integrity add case evidence", error);
    return apiError("Unable to add this evidence to the case.");
  }
}