import "server-only";

import type {
  ComplaintListItem,
  ComplaintRecord,
} from "@/data/contracts";
import {
  queryRows,
  type BindParameters,
  type Connection,
} from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

export type ComplaintListFilters = {
  page: number;
  pageSize: number;
  q?: string;
  source?: string;
  from?: string;
  to?: string;
  sort?: "received" | "id" | "source";
};

type CountRow = { TOTAL_ITEMS: number };

type ComplaintDetailRow = {
  COMPLAINT_ID: number;
  SOURCE_TYPE: string;
  DATE_RECEIVED: string;
  DESCRIPTION: string;
  MISCONDUCT_TYPE: string | null;
  CASE_ID: number | null;
  CASE_STATUS: string | null;
  CASE_DATE_OPENED: string | null;
};

function buildComplaintBinds(
  filters: ComplaintListFilters,
): BindParameters {
  return {
    q: filters.q?.trim() || null,
    source: filters.source?.trim() || null,
    from_date: filters.from || null,
    to_date: filters.to || null,
  };
}

export async function listComplaints(
  connection: Connection,
  filters: ComplaintListFilters,
) {
  const binds = buildComplaintBinds(filters);

  const countRows = await queryRows<CountRow>(
    connection,
    "SELECT COUNT(*) AS total_items FROM complaint c WHERE c.is_deleted = 0",
  );

  const sql = await loadSql(
    "integrity/02-complaints/Q04_complaint_registry.sql",
  );

  const rows = await queryRows<{
    COMPLAINT_ID: number;
    DATE_RECEIVED: string;
    SOURCE_TYPE: string;
    DESCRIPTION: string;
    MISCONDUCT_TYPE: string | null;
    LINKED_CASES: number;
  }>(connection, sql, {
    ...binds,
    rowOffset: (filters.page - 1) * filters.pageSize,
    rowLimit: filters.pageSize,
  });

  const data: readonly ComplaintListItem[] = rows.map(
    (row) => ({
      complaintId: String(row.COMPLAINT_ID),
      sourceType: row.SOURCE_TYPE,
      dateReceived: row.DATE_RECEIVED,
      description: row.DESCRIPTION,
      misconductType: row.MISCONDUCT_TYPE ?? undefined,
      linkedCaseCount: Number(row.LINKED_CASES),
    }),
  );

  return {
    data,
    totalItems: Number(countRows[0]?.TOTAL_ITEMS ?? 0),
  };
}

export async function findComplaintById(
  connection: Connection,
  complaintId: number,
): Promise<ComplaintRecord | null> {
  const sql = await loadSql(
    "integrity/02-complaints/Q05_complaint_details.sql",
  );

  const rows = await queryRows<ComplaintDetailRow>(
    connection,
    sql,
    { complaint_id: complaintId },
  );

  const first = rows[0];
  if (!first) return null;

  const linkedCases = rows
    .filter((row) => row.CASE_ID !== null)
    .map((row) => ({
      caseId: String(row.CASE_ID),
      status: row.CASE_STATUS ?? "",
      dateOpened: row.CASE_DATE_OPENED ?? "",
      referralStatus: undefined,
    }));

  return {
    complaintId: String(first.COMPLAINT_ID),
    sourceType: first.SOURCE_TYPE,
    dateReceived: first.DATE_RECEIVED,
    description: first.DESCRIPTION,
    misconductType: first.MISCONDUCT_TYPE ?? undefined,
    caseIds: linkedCases.map((item) => item.caseId),
    linkedCases,
  };
}
