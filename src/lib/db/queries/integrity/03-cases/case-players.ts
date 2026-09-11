import "server-only";

import type { Connection } from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

export async function addPlayerToCase(
  connection: Connection,
  caseId: number,
  playerId: number,
): Promise<void> {
  const sql = await loadSql(
    "integrity/03-cases/add_case_player.sql",
  );

  await connection.execute(sql, {
    playerId,
    caseId,
  });
}

export async function removePlayerFromCase(
  connection: Connection,
  caseId: number,
  playerId: number,
): Promise<void> {
  const sql = await loadSql(
    "integrity/03-cases/remove_case_player.sql",
  );

  await connection.execute(sql, {
    playerId,
    caseId,
  });
}