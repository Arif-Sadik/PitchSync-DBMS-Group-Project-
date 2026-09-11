import "server-only";

import type { IntegrityOfficerListItem } from "@/data/contracts";
import type { IntegrityScope } from "@/features/auth/types";
import {
  oracledb,
  queryRows,
  type Connection,
} from "@/lib/db/oracle";

type IntegrityOfficerRow = {
  ADMIN_ID: number;
  FULL_NAME: string;
  EMAIL: string;
  DEPARTMENT: string;
  ACCESS_SCOPE: IntegrityScope | null;
  ACCOUNT_STATUS: string | null;
  ACTIVE_ASSIGNMENT_COUNT: number;
};

export async function listIntegrityOfficers(
  connection: Connection,
): Promise<readonly IntegrityOfficerListItem[]> {
  const rows = await queryRows<IntegrityOfficerRow>(
    connection,
    `
      SELECT
        a.person_id AS admin_id,
        p.first_name || ' ' || p.last_name AS full_name,
        a.email,
        a.department,
        ioa.access_scope,
        ua.account_status,
        fn_active_assignment_count(a.person_id) AS active_assignment_count
      FROM admin a
      JOIN person p
        ON p.person_id = a.person_id
       AND p.is_deleted = 0
      LEFT JOIN user_account ua
        ON ua.person_id = a.person_id
       AND ua.is_deleted = 0
      LEFT JOIN integrity_officer_access ioa
        ON ioa.admin_id = a.person_id
       AND ioa.is_deleted = 0
      WHERE a.designation = 'Integrity & Compliance Officer'
        AND a.is_deleted = 0
      ORDER BY p.first_name, p.last_name
    `,
  );

  return rows.map((row) => ({
    adminId: String(row.ADMIN_ID),
    fullName: row.FULL_NAME,
    email: row.EMAIL,
    department: row.DEPARTMENT,
    accessScope: row.ACCESS_SCOPE,
    accountStatus: row.ACCOUNT_STATUS,
    activeAssignmentCount: Number(
      row.ACTIVE_ASSIGNMENT_COUNT ?? 0,
    ),
  }));
}

type IntegrityScopeRow = {
  ACCESS_SCOPE: string;
};

export async function getActiveIntegrityScope(
  connection: Connection,
  adminId: number,
): Promise<IntegrityScope | null> {
  const rows = await queryRows<IntegrityScopeRow>(
    connection,
    `
      SELECT ioa.access_scope
      FROM integrity_officer_access ioa
      JOIN admin a
        ON a.person_id = ioa.admin_id
       AND a.is_deleted = 0
      WHERE ioa.admin_id = :adminId
        AND ioa.is_deleted = 0
        AND a.designation = 'Integrity & Compliance Officer'
    `,
    { adminId },
  );

  const scope = rows[0]?.ACCESS_SCOPE;

  if (
    scope === "MANAGER" ||
    scope === "INVESTIGATOR"
  ) {
    return scope;
  }

  return null;
}

type AssignmentCountRow = {
  ASSIGNMENT_COUNT: number;
};

export async function hasActiveInvestigationAssignment(
  connection: Connection,
  adminId: number,
  caseId: number,
): Promise<boolean> {
  const rows = await queryRows<AssignmentCountRow>(
    connection,
    `
      SELECT COUNT(*) AS assignment_count
      FROM investigates i
      JOIN involves_in ii
        ON ii.person_id = i.person_id
       AND ii.case_id = i.case_id
       AND ii.is_deleted = 0
      JOIN case_record c
        ON c.case_id = i.case_id
       AND c.is_deleted = 0
      WHERE i.admin_id = :adminId
        AND i.case_id = :caseId
        AND i.is_deleted = 0
    `,
    {
      adminId,
      caseId,
    },
  );

  return Number(
    rows[0]?.ASSIGNMENT_COUNT ?? 0,
  ) > 0;
}

export async function hasActiveInvestigationAssignmentForPlayer(
  connection: Connection,
  adminId: number,
  caseId: number,
  playerId: number,
): Promise<boolean> {
  const rows = await queryRows<AssignmentCountRow>(
    connection,
    `
      SELECT COUNT(*) AS assignment_count
      FROM investigates i
      JOIN involves_in ii
        ON ii.person_id = i.person_id
       AND ii.case_id = i.case_id
       AND ii.is_deleted = 0
      JOIN case_record c
        ON c.case_id = i.case_id
       AND c.is_deleted = 0
      WHERE i.admin_id = :adminId
        AND i.case_id = :caseId
        AND i.person_id = :playerId
        AND i.is_deleted = 0
    `,
    {
      adminId,
      caseId,
      playerId,
    },
  );

  return Number(
    rows[0]?.ASSIGNMENT_COUNT ?? 0,
  ) > 0;
}

export async function setIntegrityOfficerScope(
  connection: Connection,
  adminId: number,
  scope: IntegrityScope,
  assignedByAdminId: number,
) {
  const eligible = await queryRows<{ COUNT_VALUE: number }>(
    connection,
    `
      SELECT COUNT(*) AS count_value
      FROM admin
      WHERE person_id = :adminId
        AND designation = 'Integrity & Compliance Officer'
        AND is_deleted = 0
    `,
    { adminId },
  );

  if ((eligible[0]?.COUNT_VALUE ?? 0) !== 1) {
    throw new Error(
      "Selected admin is not an active Integrity & Compliance Officer.",
    );
  }

  await connection.execute(
    `
      MERGE INTO integrity_officer_access target
      USING (
        SELECT
          :adminId AS admin_id,
          :scope AS access_scope,
          :assignedByAdminId AS assigned_by_admin_id
        FROM dual
      ) source
      ON (target.admin_id = source.admin_id)

      WHEN MATCHED THEN
        UPDATE SET
          target.access_scope = source.access_scope,
          target.assigned_by_admin_id = source.assigned_by_admin_id,
          target.assigned_at = SYSTIMESTAMP,
          target.is_deleted = 0

      WHEN NOT MATCHED THEN
        INSERT (
          admin_id,
          access_scope,
          assigned_by_admin_id,
          assigned_at,
          is_deleted
        )
        VALUES (
          source.admin_id,
          source.access_scope,
          source.assigned_by_admin_id,
          SYSTIMESTAMP,
          0
        )
    `,
    {
      adminId,
      scope,
      assignedByAdminId,
    },
  );
}

type ActiveCountRow = {
  ACTIVE_COUNT: number;
};

export async function getActiveInvestigationCount(
  connection: Connection,
  adminId: number,
): Promise<number> {
  const rows = await queryRows<ActiveCountRow>(
    connection,
    `
      SELECT
        fn_active_assignment_count(:adminId) AS active_count
      FROM dual
    `,
    { adminId },
  );

  return Number(rows[0]?.ACTIVE_COUNT ?? 0);
}

type AssignableOfficerRow = {
  INVESTIGATOR_ID: number;
  INVESTIGATOR_NAME: string;
  ACTIVE_ASSIGNMENT_COUNT: number;
};

export async function findAssignableInvestigator(
  connection: Connection,
  investigatorId: number,
): Promise<{
  investigatorId: number;
  investigatorName: string;
  activeAssignmentCount: number;
} | null> {
  const rows = await queryRows<AssignableOfficerRow>(
    connection,
    `
      SELECT
        investigator_id,
        investigator_name,
        active_assignment_count
      FROM vw_assignable_investigators
      WHERE investigator_id = :investigatorId
    `,
    { investigatorId },
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    investigatorId: Number(row.INVESTIGATOR_ID),
    investigatorName: row.INVESTIGATOR_NAME,
    activeAssignmentCount: Number(
      row.ACTIVE_ASSIGNMENT_COUNT,
    ),
  };
}

export async function reassignInvestigatorAssignments(
  connection: Connection,
  oldInvestigatorId: number,
  newInvestigatorId: number,
): Promise<number> {
  const result = await connection.execute(
    `
      BEGIN
        pr_reassign_investigator(
          p_old_investigator_id => :oldInvestigatorId,
          p_new_investigator_id => :newInvestigatorId,
          p_reassigned_count    => :reassignedCount
        );
      END;
    `,
    {
      oldInvestigatorId,
      newInvestigatorId,
      reassignedCount: {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER,
      },
    },
  );

  const outBinds = result.outBinds as
    | Record<string, unknown>
    | undefined;

  const rawCount = outBinds?.reassignedCount ?? 0;

  return Number(rawCount) || 0;
}