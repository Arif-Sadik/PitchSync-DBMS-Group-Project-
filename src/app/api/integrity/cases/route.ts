import { NextResponse } from "next/server";
import { z } from "zod";
import { paginationMetadata, paginationSchema } from "@/lib/api/pagination";
import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleConnection, withOracleTransaction } from "@/lib/db/oracle";
import { listCases } from "@/lib/db/queries/integrity/03-cases/case-registry";
import { openIntegrityCase } from "@/lib/db/queries/integrity/03-cases/case-writes";
import { oracleErrorNumber } from "@/lib/db/oracle-error";

export const runtime = "nodejs";
const listSchema = paginationSchema.extend({ q: z.string().trim().max(100).optional(), status: z.string().trim().max(30).optional(), opened: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), sort: z.enum(["opened", "id", "status"]).default("opened") });

const openCaseSchema = z.object({
  complaintId: z.number().int().positive().nullable(),
  playerId: z.number().int().positive(),
  involvementType: z.string().trim().min(1).max(100),
  investigatorId: z.number().int().positive().nullable(),
});

export async function GET(request: Request) {
  const session = await requireIntegrityManager();

  if (!session) {
    return apiError("Integrity Manager access is required.", 403);
  }

  const parsed = listSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return apiError("Invalid integrity case filters.", 400);

  try {
    const result = await withOracleConnection((connection) => listCases(connection, parsed.data));
    return NextResponse.json({ data: result.data, pagination: paginationMetadata(parsed.data.page, parsed.data.pageSize, result.totalItems) });
  } catch (error) {
    logServerError("integrity case registry", error);
    return apiError("Unable to load integrity cases.");
  }
}

export async function POST(request: Request) {
  const session = await requireIntegrityManager();

  if (!session) {
    return apiError("Integrity Manager access is required.", 403);
  }

  const parsed = openCaseSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiError(
      "Provide an involved player, involvement type, and optional complaint or investigator.",
      400,
    );
  }

  try {
    const caseId = await withOracleTransaction((connection) =>
      openIntegrityCase(connection, {
        complaintId: parsed.data.complaintId,
        playerId: parsed.data.playerId,
        involvementType: parsed.data.involvementType,
        investigatorId: parsed.data.investigatorId,
      }),
    );

    return NextResponse.json(
      { data: { caseId: String(caseId) } },
      { status: 201 },
    );
  } catch (error) {
    const code = oracleErrorNumber(error);

    if (code === -20010) {
      return apiError(
        "The selected complaint is not available for case creation.",
        400,
      );
    }

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

    logServerError("integrity case creation", error);
    return apiError("Unable to open the integrity case.");
  }
}
