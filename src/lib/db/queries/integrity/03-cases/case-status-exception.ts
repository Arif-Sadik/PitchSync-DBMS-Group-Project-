import "server-only";

import { oracledb, type Connection } from "@/lib/db/oracle";

/** Returns a case status, or null when the requested case does not exist. */
export async function findCaseStatusSafely(
  connection: Connection,
  caseId: number,
): Promise<string | null> {
  const result = await connection.execute<{ status: string }>(
    `
      DECLARE
        v_status case_record.status%TYPE;
      BEGIN
        SELECT status
          INTO v_status
          FROM case_record
         WHERE case_id = :caseId
           AND is_deleted = 0;

        :status := v_status;
      EXCEPTION
        WHEN NO_DATA_FOUND THEN
          :status := NULL;
      END;
    `,
    {
      caseId,
      status: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 30,
      },
    },
  );

  const status = result.outBinds?.status;
  return typeof status === "string" ? status : null;
}
