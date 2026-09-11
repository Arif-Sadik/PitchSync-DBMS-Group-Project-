import { NextResponse } from "next/server";
import { z } from "zod";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import {
  getFrequentlyViolatedRules,
} from "@/lib/db/queries/integrity/06-reports/reports";

export const runtime = "nodejs";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const querySchema = z.object({
  minimum_cases: z.coerce.number().int().min(1).optional(),
  from_date: dateSchema.optional(),
  to_date: dateSchema.optional(),
});

export async function GET(request: Request) {
  const session = await requireIntegrityManager();

  if (!session) {
    return apiError(
      "Integrity Manager access is required.",
      403,
    );
  }

  const parsed = querySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );

  if (!parsed.success) {
    return apiError("Invalid report filters.", 400);
  }

  try {
    const rules = await withOracleConnection(
      (connection) =>
        getFrequentlyViolatedRules(connection, {
          minimumCases: parsed.data.minimum_cases,
          fromDate: parsed.data.from_date,
          toDate: parsed.data.to_date,
        }),
    );

    return NextResponse.json({ data: rules });
  } catch (error) {
    logServerError(
      "frequently violated rules report",
      error,
    );
    return apiError(
      "Unable to load frequently violated rules.",
    );
  }
}
