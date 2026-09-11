import { NextResponse } from "next/server";

import {
  apiError,
  logServerError,
} from "@/lib/api/responses";
import {
  requireIntegrityManager,
} from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import {
  listPlayerOptions,
} from "@/lib/db/queries/integrity/03-cases/player-options";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireIntegrityManager();

  if (!session) {
    return apiError(
      "Integrity Manager access is required.",
      403,
    );
  }

  try {
    const players = await withOracleConnection(
      listPlayerOptions,
    );

    return NextResponse.json({ data: players });
  } catch (error) {
    logServerError("integrity player options", error);
    return apiError("Unable to load the player list.");
  }
}
