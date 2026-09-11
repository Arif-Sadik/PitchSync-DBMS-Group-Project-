import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleTransaction } from "@/lib/db/oracle";
import { reviewInvestigationFinding } from "@/lib/db/queries/integrity/04-findings/findings";
import {
  referCase,
  transitionCaseStatus,
} from "@/lib/db/queries/integrity/03-cases/case-lifecycle";

export const runtime = "nodejs";

const reviewSchema = z.object({
  reviewStatus: z.enum([
    "ACCEPTED",
    "REVISION_REQUESTED",
    "REJECTED",
  ]),
  managerComment: z.string().trim().max(1000).optional(),
  caseAction: z.enum(["refer", "close"]).optional(),
  authority: z.string().trim().max(200).optional(),
});

export async function PATCH(
  request: Request,
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

  const parsed = reviewSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiError("Provide a supported review status.", 400);
  }

  const managerComment = parsed.data.managerComment ?? null;

  if (
    (parsed.data.reviewStatus === "REVISION_REQUESTED" ||
      parsed.data.reviewStatus === "REJECTED") &&
    !managerComment
  ) {
    return apiError(
      "A manager comment is required for this review status.",
      400,
    );
  }

  if (
    parsed.data.caseAction &&
    parsed.data.reviewStatus !== "ACCEPTED"
  ) {
    return apiError(
      "A case action can only accompany an accepted finding.",
      400,
    );
  }

  const authority = parsed.data.authority ?? null;

  if (parsed.data.caseAction === "refer" && !authority) {
    return apiError(
      "A referral authority is required.",
      400,
    );
  }

  try {
    const result = await withOracleTransaction(
      async (connection) => {
        const reviewed = await reviewInvestigationFinding(connection, {
          caseId: Number(caseId),
          playerId: Number(playerId),
          reviewerId: Number(session.personId),
          reviewStatus: parsed.data.reviewStatus,
          managerComment,
        });

        if (!reviewed) {
          return { reviewed: false, caseAction: null as string | null };
        }

        if (parsed.data.caseAction === "refer") {
          await referCase(
            connection,
            Number(caseId),
            authority!,
          );

          return { reviewed: true, caseAction: "refer" };
        }

        if (parsed.data.caseAction === "close") {
          await transitionCaseStatus(
            connection,
            Number(caseId),
            "close",
          );

          return { reviewed: true, caseAction: "close" };
        }

        return { reviewed: true, caseAction: null };
      },
    );

    if (!result.reviewed) {
      return apiError(
        "No active finding exists for this involvement.",
        404,
      );
    }

    return NextResponse.json({
      data: {
        reviewed: true,
        ...(result.caseAction ? { caseAction: result.caseAction } : {}),
      },
    });
  } catch (error) {
    logServerError("integrity review finding", error);
    return apiError("Unable to review this finding.");
  }
}