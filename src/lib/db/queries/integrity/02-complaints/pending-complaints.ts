import "server-only";

import { queryRows, type Connection } from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

type PendingComplaintRow = {
  COMPLAINT_ID: number;
  DATE_RECEIVED: string;
  SOURCE_TYPE: string;
  MISCONDUCT_TYPE: string | null;
  DESCRIPTION: string;
};

export type PendingComplaintItem = {
  complaintId: string;
  dateReceived: string;
  sourceType: string;
  misconductType: string | null;
  description: string;
};

export async function getPendingComplaints(
  connection: Connection,
): Promise<readonly PendingComplaintItem[]> {
  const sql = await loadSql(
    "integrity/02-complaints/Q03_complaints_without_opened_case.sql",
  );

  const rows = await queryRows<PendingComplaintRow>(
    connection,
    sql,
  );

  return rows.map((row) => ({
    complaintId: String(row.COMPLAINT_ID),
    dateReceived: row.DATE_RECEIVED,
    sourceType: row.SOURCE_TYPE,
    misconductType: row.MISCONDUCT_TYPE,
    description: row.DESCRIPTION,
  }));
}
