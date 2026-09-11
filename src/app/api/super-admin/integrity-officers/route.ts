import { NextResponse } from "next/server";

import {
  apiError,
  logServerError,
} from "@/lib/api/responses";
import { requireServerSession } from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import {
  listAssignableInvestigators,
} from "@/lib/db/queries/integrity/07-access/assignable-investigators";
import { listIntegrityOfficers } from "@/lib/db/queries/integrity/07-access/integrity-access";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireServerSession([
    "super-admin",
  ]);

  if (!session) {
    return apiError(
      "Super Administrator access is required.",
      403,
    );
  }

  try {
    const result = await withOracleConnection(
      async (connection) => {
        const officers = await listIntegrityOfficers(
          connection,
        );
        const assignableInvestigators =
          await listAssignableInvestigators(
            connection,
          );

        return { officers, assignableInvestigators };
      },
    );

    return NextResponse.json({
      data: result.officers,
      assignableInvestigators:
        result.assignableInvestigators,
    });
  } catch (error) {
    logServerError(
      "load integrity officers",
      error,
    );

    return apiError(
      "Unable to load Integrity Officers.",
    );
  }
}