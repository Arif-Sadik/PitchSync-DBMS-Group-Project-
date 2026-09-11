import "server-only";

import type { AssignedCaseItem } from "@/data/contracts";
import { queryRows, type Connection } from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

type AssignedCaseRow = {
  CASE_ID: number;
  STATUS: string;
  DATE_OPENED: string;
  INVOLVEMENT_TYPE: string | null;
  REFERRAL_STATUS: string | null;
  ASSIGNED_PLAYER_ID: number;
  ASSIGNED_PLAYER_NAME: string;
  PLAYER_ROLE: string | null;
};

export type { AssignedCaseItem } from "@/data/contracts";

export async function getMyAssignedCases(
  connection: Connection,
  adminId: number,
): Promise<readonly AssignedCaseItem[]> {
  const sql = await loadSql(
    "integrity/03-cases/my_assigned_involvements.sql",
  );

  const rows = await queryRows<AssignedCaseRow>(
    connection,
    sql,
    { admin_id: adminId },
  );

  return rows.map((row) => ({
    caseId: String(row.CASE_ID),
    status: row.STATUS,
    dateOpened: row.DATE_OPENED,
    involvementType: row.INVOLVEMENT_TYPE,
    referralStatus: row.REFERRAL_STATUS,
    assignedPlayerId: String(row.ASSIGNED_PLAYER_ID),
    assignedPlayerName: row.ASSIGNED_PLAYER_NAME,
    playerRole: row.PLAYER_ROLE,
  }));
}
