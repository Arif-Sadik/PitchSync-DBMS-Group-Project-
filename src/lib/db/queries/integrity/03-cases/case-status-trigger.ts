import "server-only";

import type { Connection } from "@/lib/db/oracle";

/**
 * Oracle DDL for the integrity case-status rule. Run once by an authorized
 * database deployment/admin connection; do not call from a request handler.
 */
export async function createCaseStatusValidationTrigger(
  connection: Connection,
): Promise<void> {
  await connection.execute(`
    CREATE OR REPLACE TRIGGER trg_case_record_status_valid
    BEFORE INSERT OR UPDATE OF status ON case_record
    FOR EACH ROW
    BEGIN
      IF :NEW.status NOT IN ('OPEN', 'UNDER_INVESTIGATION', 'REFERRED', 'CLOSED') THEN
        RAISE_APPLICATION_ERROR(-20020, 'Invalid integrity case status.');
      END IF;
    END;
  `);
}
