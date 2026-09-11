import "server-only";

import type { Connection } from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

export type CaseLifecycleAction = "refer" | "close" | "reopen";

export async function transitionCaseStatus(
  connection: Connection,
  caseId: number,
  action: Exclude<CaseLifecycleAction, "refer">,
): Promise<void> {
  const file =
    action === "close"
      ? "integrity/03-cases/close_case.sql"
      : "integrity/03-cases/reopen_case.sql";

  const sql = await loadSql(file);

  await connection.execute(sql, { caseId });
}

export async function referCase(
  connection: Connection,
  caseId: number,
  authority: string,
): Promise<void> {
  const sql = await loadSql(
    "integrity/03-cases/refer_case.sql",
  );

  await connection.execute(sql, {
    caseId,
    authority,
  });
}