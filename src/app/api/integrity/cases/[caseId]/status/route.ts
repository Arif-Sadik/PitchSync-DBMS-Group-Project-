import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleTransaction } from "@/lib/db/oracle";
import {
  referCase,
  transitionCaseStatus,
} from "@/lib/db/queries/integrity/03-cases/case-lifecycle";

export const runtime = "nodejs";

const caseActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("refer"),
    authority: z.string().trim().min(1).max(200),
  }),
  z.object({
    action: z.literal("close"),
  }),
  z.object({
    action: z.literal("reopen"),
  }),
]);

export async function PATCH(
  request: Request,
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

  const parsed = caseActionSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiError(
      "Provide a supported case action and any required details.",
      400,
    );
  }

  try {
    await withOracleTransaction((connection) => {
      if (parsed.data.action === "refer") {
        return referCase(
          connection,
          Number(caseId),
          parsed.data.authority,
        );
      }

      return transitionCaseStatus(
        connection,
        Number(caseId),
        parsed.data.action,
      );
    });

    return NextResponse.json({ data: { updated: true } });
  } catch (error) {
    logServerError("integrity case lifecycle", error);
    return apiError("Unable to update the case status.");
  }
}