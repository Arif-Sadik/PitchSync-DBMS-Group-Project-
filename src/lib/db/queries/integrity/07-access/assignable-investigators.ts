import "server-only";

import type { AssignableInvestigator } from "@/data/contracts";
import { queryRows, type Connection } from "@/lib/db/oracle";

type AssignableInvestigatorRow = {
  INVESTIGATOR_ID: number;
  INVESTIGATOR_NAME: string;
  DESIGNATION: string | null;
  DEPARTMENT: string | null;
  ACTIVE_ASSIGNMENT_COUNT: number;
};

export async function listAssignableInvestigators(
  connection: Connection,
): Promise<readonly AssignableInvestigator[]> {
  const rows = await queryRows<AssignableInvestigatorRow>(
    connection,
    `
      SELECT
        investigator_id,
        investigator_name,
        designation,
        department,
        active_assignment_count
      FROM vw_assignable_investigators
      ORDER BY investigator_name
    `,
  );

  return rows.map((row) => ({
    investigatorId: Number(row.INVESTIGATOR_ID),
    investigatorName: row.INVESTIGATOR_NAME,
    designation: row.DESIGNATION ?? "",
    department: row.DEPARTMENT ?? "",
    activeAssignmentCount: Number(
      row.ACTIVE_ASSIGNMENT_COUNT,
    ),
  }));
}
