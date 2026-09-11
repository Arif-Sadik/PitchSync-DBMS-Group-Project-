import "server-only";

import type { PlayerSummary } from "@/data/contracts";
import { queryRows, type Connection } from "@/lib/db/oracle";

type PlayerOptionsRow = {
  PERSON_ID: number;
  FULL_NAME: string;
  PLAYER_ROLE: string;
  GENDER: "MALE" | "FEMALE";
};

export async function listPlayerOptions(
  connection: Connection,
): Promise<readonly PlayerSummary[]> {
  const rows = await queryRows<PlayerOptionsRow>(
    connection,
    `
      SELECT
        p.person_id,
        p.first_name || ' ' || p.last_name AS full_name,
        pl.player_role,
        pl.gender
      FROM player pl
      JOIN person p
        ON p.person_id = pl.person_id
       AND p.is_deleted = 0
      WHERE pl.is_deleted = 0
      ORDER BY p.first_name, p.last_name
    `,
  );

  return rows.map((row) => ({
    personId: String(row.PERSON_ID),
    fullName: row.FULL_NAME,
    playerRole: row.PLAYER_ROLE,
    gender: row.GENDER,
  }));
}
