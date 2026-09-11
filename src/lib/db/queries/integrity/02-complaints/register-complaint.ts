import "server-only";

import { oracledb, type Connection } from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

export type RegisterComplaintInput = {
  sourceType: string;
  dateReceived: string;
  description: string;
  misconductType: string | null;
};

export async function registerComplaint(
  connection: Connection,
  input: RegisterComplaintInput,
): Promise<number> {
  const sql = await loadSql(
    "integrity/02-complaints/register_complaint.sql",
  );

  const result = await connection.execute<{
    complaintId: number[];
  }>(sql, {
    sourceType: input.sourceType,
    dateReceived: input.dateReceived,
    description: input.description,
    misconductType: input.misconductType,
    complaintId: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
  });

  const complaintId = result.outBinds?.complaintId;
  const value = Array.isArray(complaintId) ? complaintId[0] : complaintId;

  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(
      "The complaint insert did not return a complaint reference.",
    );
  }

  return value;
}