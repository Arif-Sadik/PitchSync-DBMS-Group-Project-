import "server-only";

import { queryRows, type Connection } from "@/lib/db/oracle";

type AdminProfileRow = {
  EMAIL: string;
  DESIGNATION: string | null;
  DEPARTMENT: string | null;
  JOINING_DATE: string | null;
  DOB: string | null;
  PRESENT_ADDRESS_LINE: string | null;
  PRESENT_UPAZILA: string | null;
  PRESENT_DISTRICT: string | null;
  PRESENT_DIVISION: string | null;
  PERMANENT_ADDRESS_LINE: string | null;
  PERMANENT_UPAZILA: string | null;
  PERMANENT_DISTRICT: string | null;
  PERMANENT_DIVISION: string | null;
};

type ValueRow = { VALUE: string };

function formatAddress(parts: readonly (string | null)[]): string | undefined {
  const address = parts.filter((part): part is string => Boolean(part?.trim())).join(", ");
  return address || undefined;
}

export async function getAdminProfile(
  connection: Connection,
  adminId: number,
): Promise<{
  email: string;
  designation: string | null;
  department: string | null;
  joiningDate: string | null;
  dateOfBirth: string | null;
  presentAddress?: string;
  permanentAddress?: string;
} | null> {
  const rows = await queryRows<AdminProfileRow>(
    connection,
    `
      SELECT
        a.email,
        a.designation,
        a.department,
        TO_CHAR(a.joining_date, 'YYYY-MM-DD') AS joining_date,
        TO_CHAR(p.dob, 'YYYY-MM-DD') AS dob,
        p.present_address.address_line AS present_address_line,
        p.present_address.upazila_or_thana AS present_upazila,
        p.present_address.district AS present_district,
        p.present_address.division AS present_division,
        p.permanent_address.address_line AS permanent_address_line,
        p.permanent_address.upazila_or_thana AS permanent_upazila,
        p.permanent_address.district AS permanent_district,
        p.permanent_address.division AS permanent_division
      FROM admin a
      JOIN person p ON p.person_id = a.person_id
        AND p.is_deleted = 0
      WHERE a.person_id = :adminId
        AND a.is_deleted = 0
    `,
    { adminId },
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    email: row.EMAIL,
    designation: row.DESIGNATION,
    department: row.DEPARTMENT,
    joiningDate: row.JOINING_DATE,
    dateOfBirth: row.DOB,
    presentAddress: formatAddress([
      row.PRESENT_ADDRESS_LINE,
      row.PRESENT_UPAZILA,
      row.PRESENT_DISTRICT,
      row.PRESENT_DIVISION,
    ]),
    permanentAddress: formatAddress([
      row.PERMANENT_ADDRESS_LINE,
      row.PERMANENT_UPAZILA,
      row.PERMANENT_DISTRICT,
      row.PERMANENT_DIVISION,
    ]),
  };
}

type AccountProfileRow = {
  ACCOUNT_STATUS: string | null;
  CREATED_DATE: string | null;
  LAST_LOGIN: string | null;
};

export async function getAccountProfile(
  connection: Connection,
  personId: number,
): Promise<{
  accountStatus: string | null;
  accountCreated: string | null;
  lastLogin: string | null;
} | null> {
  const rows = await queryRows<AccountProfileRow>(
    connection,
    `
      SELECT
        ua.account_status,
        TO_CHAR(ua.created_date, 'YYYY-MM-DD') AS created_date,
        TO_CHAR(ua.last_login, 'YYYY-MM-DD"T"HH24:MI:SS') AS last_login
      FROM user_account ua
      WHERE ua.person_id = :personId
        AND ua.is_deleted = 0
    `,
    { personId },
  );

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    accountStatus: row.ACCOUNT_STATUS,
    accountCreated: row.CREATED_DATE,
    lastLogin: row.LAST_LOGIN,
  };
}

export async function getMobileNumbers(
  connection: Connection,
  personId: number,
): Promise<readonly string[]> {
  const rows = await queryRows<ValueRow>(
    connection,
    `
      SELECT phone AS value
      FROM person_phone
      WHERE person_id = :personId
        AND is_deleted = 0
      ORDER BY phone
    `,
    { personId },
  );

  return rows.map((row) => row.VALUE);
}