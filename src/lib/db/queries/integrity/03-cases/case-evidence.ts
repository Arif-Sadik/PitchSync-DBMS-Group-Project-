import "server-only";

import { oracledb, type Connection } from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

export type EvidenceWriteInput = {
  description: string;
  collectedDate: string;
};

export async function addEvidence(
  connection: Connection,
  caseId: number,
  input: EvidenceWriteInput,
): Promise<number> {
  const sql = await loadSql(
    "integrity/03-cases/add_evidence.sql",
  );

  const result = await connection.execute<{
    evidenceNo: number[];
  }>(sql, {
    caseId,
    description: input.description,
    collectedDate: input.collectedDate,
    evidenceNo: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
  });

  const evidenceNo = result.outBinds?.evidenceNo;
  const value = Array.isArray(evidenceNo) ? evidenceNo[0] : evidenceNo;

  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(
      "The evidence insert did not return an evidence number.",
    );
  }

  return value;
}

export async function updateEvidence(
  connection: Connection,
  caseId: number,
  evidenceNo: number,
  input: EvidenceWriteInput,
): Promise<void> {
  const sql = await loadSql(
    "integrity/03-cases/update_evidence.sql",
  );

  await connection.execute(sql, {
    caseId,
    evidenceNo,
    description: input.description,
    collectedDate: input.collectedDate,
  });
}

export async function removeEvidence(
  connection: Connection,
  caseId: number,
  evidenceNo: number,
): Promise<void> {
  const sql = await loadSql(
    "integrity/03-cases/remove_evidence.sql",
  );

  await connection.execute(sql, {
    caseId,
    evidenceNo,
  });
}