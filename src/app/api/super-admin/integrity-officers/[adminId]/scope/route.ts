import { NextResponse } from "next/server";
import { z } from "zod";

import {
  apiError,
  logServerError,
} from "@/lib/api/responses";
import { requireServerSession } from "@/lib/auth/server";
import { withOracleTransaction } from "@/lib/db/oracle";
import {
  findAssignableInvestigator,
  getActiveIntegrityScope,
  getActiveInvestigationCount,
  reassignInvestigatorAssignments,
  setIntegrityOfficerScope,
} from "@/lib/db/queries/integrity/07-access/integrity-access";

export const runtime = "nodejs";

const bodySchema = z.object({
  scope: z.enum([
    "MANAGER",
    "INVESTIGATOR",
  ]),
  replacementInvestigatorId: z
    .number()
    .int()
    .positive()
    .optional(),
});

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ adminId: string }>;
  },
) {
  const session = await requireServerSession([
    "super-admin",
  ]);

  if (!session) {
    return apiError(
      "Super Administrator access is required.",
      403,
    );
  }

  const { adminId } = await context.params;

  const numericAdminId = Number(adminId);

  if (!Number.isInteger(numericAdminId)) {
    return apiError(
      "Invalid Integrity Officer.",
      400,
    );
  }

  const parsed = bodySchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiError(
      "Select a valid Integrity responsibility.",
      400,
    );
  }

  const nextScope = parsed.data.scope;

  try {
    const result = await withOracleTransaction(
      async (connection) => {
        const currentScope =
          await getActiveIntegrityScope(
            connection,
            numericAdminId,
          );

        if (currentScope === nextScope) {
          return { reassignedCount: 0 };
        }

        let reassignedCount = 0;

        if (
          currentScope === "INVESTIGATOR" &&
          nextScope === "MANAGER"
        ) {
          const activeCount =
            await getActiveInvestigationCount(
              connection,
              numericAdminId,
            );

          if (activeCount > 0) {
            const replacementId =
              parsed.data.replacementInvestigatorId;

            if (!replacementId) {
              throw new Error(
                "Select an investigator to take over the active investigation assignments before changing this officer to Manager.",
              );
            }

            if (
              replacementId === numericAdminId
            ) {
              throw new Error(
                "The replacement investigator must be a different officer.",
              );
            }

            const eligible =
              await findAssignableInvestigator(
                connection,
                replacementId,
              );

            if (!eligible) {
              throw new Error(
                "The selected investigator is not an assignable Investigator.",
              );
            }

            reassignedCount =
              await reassignInvestigatorAssignments(
                connection,
                numericAdminId,
                replacementId,
              );
          }
        }

        await setIntegrityOfficerScope(
          connection,
          numericAdminId,
          nextScope,

          // no hard-coded 200001
          Number(session.personId),
        );

        return { reassignedCount };
      },
    );

    return NextResponse.json({
      data: {
        adminId: numericAdminId,
        scope: nextScope,
        reassignedCount: result.reassignedCount,
      },
    });
  } catch (error) {
    logServerError(
      "update integrity officer scope",
      error,
    );

    return apiError(
      error instanceof Error
        ? error.message
        : "Unable to update responsibility.",
      400,
    );
  }
}