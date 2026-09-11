import "server-only";

import { oracledb, type Connection } from "@/lib/db/oracle";

export type AssignInvestigatorInput = {
  caseId: number;
  playerId: number;
  investigatorId: number;
};

export async function assignInvestigator(
  connection: Connection,
  input: AssignInvestigatorInput,
): Promise<void> {
  await connection.execute(
    `
      BEGIN
        pr_assign_investigator(
          p_case_id         => :caseId,
          p_player_id       => :playerId,
          p_investigator_id => :investigatorId
        );
      END;
    `,
    {
      caseId: input.caseId,
      playerId: input.playerId,
      investigatorId: input.investigatorId,
    },
  );
}

export type OpenIntegrityCaseInput = {
  complaintId: number | null;
  playerId: number;
  involvementType: string;
  investigatorId: number | null;
};

export async function openIntegrityCase(
  connection: Connection,
  input: OpenIntegrityCaseInput,
): Promise<number> {
  const result = await connection.execute<{
    caseId: number[];
  }>(
    `
      BEGIN
        pr_open_integrity_case(
          p_complaint_id     => :complaintId,
          p_player_id        => :playerId,
          p_involvement_type => :involvementType,
          p_investigator_id  => :investigatorId,
          p_case_id          => :caseId
        );
      END;
    `,
    {
      complaintId: input.complaintId,
      playerId: input.playerId,
      involvementType: input.involvementType,
      investigatorId: input.investigatorId,
      caseId: {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER,
      },
    },
  );

  const caseId = result.outBinds?.caseId;
  const value = Array.isArray(caseId) ? caseId[0] : caseId;

  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(
      "The integrity case procedure did not return a case reference.",
    );
  }

  return value;
}
