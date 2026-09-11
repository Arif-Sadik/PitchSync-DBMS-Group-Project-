import "server-only";

import type { Connection } from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

export async function linkRuleToCase(
  connection: Connection,
  caseId: number,
  ruleId: number,
): Promise<void> {
  const sql = await loadSql(
    "integrity/03-cases/link_case_rule.sql",
  );

  await connection.execute(sql, {
    caseId,
    ruleId,
  });
}

export async function unlinkRuleFromCase(
  connection: Connection,
  caseId: number,
  ruleId: number,
): Promise<void> {
  const sql = await loadSql(
    "integrity/03-cases/unlink_case_rule.sql",
  );

  await connection.execute(sql, {
    caseId,
    ruleId,
  });
}