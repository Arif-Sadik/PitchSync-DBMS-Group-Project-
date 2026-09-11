import "server-only";

import type { IntegrityCaseListItem } from "@/data/contracts";
import {
  queryRows,
  type BindParameters,
  type Connection,
} from "@/lib/db/oracle";
import { loadSql } from "@/lib/db/sql/load-sql";

export type CaseListFilters = {
  page: number;
  pageSize: number;
  q?: string;
  status?: string;
  opened?: string;
  sort?: "opened" | "id" | "status";
};

type CountRow = { TOTAL_ITEMS: number };

function buildRegistryBinds(
  filters: CaseListFilters,
): BindParameters {
  return {
    q: filters.q?.trim() || null,
    status: filters.status?.trim() || null,
    opened: filters.opened || null,
  };
}

export async function listCases(
  connection: Connection,
  filters: CaseListFilters,
) {
  const binds = buildRegistryBinds(filters);

  const countRows = await queryRows<CountRow>(
    connection,
    "SELECT COUNT(*) AS total_items FROM case_record c WHERE c.is_deleted = 0",
  );

  const sql = await loadSql(
    "integrity/03-cases/Q06_case_registry.sql",
  );

  const rows = await queryRows<{
    CASE_ID: number;
    STATUS: string;
    DATE_OPENED: string;
    REFERRAL_STATUS: string | null;
    INVOLVED_PLAYERS: number;
    ASSIGNED_INVESTIGATORS: number;
  }>(connection, sql, {
    ...binds,
    rowOffset: (filters.page - 1) * filters.pageSize,
    rowLimit: filters.pageSize,
  });

  const data: readonly IntegrityCaseListItem[] = rows.map(
    (row) => ({
      caseId: String(row.CASE_ID),
      status: row.STATUS,
      dateOpened: row.DATE_OPENED,
      referralStatus: row.REFERRAL_STATUS ?? "",
      involvedPlayerCount: Number(row.INVOLVED_PLAYERS),
      investigatorCount: Number(row.ASSIGNED_INVESTIGATORS),
      complaintCount: 0,
    }),
  );

  return {
    data,
    totalItems: Number(countRows[0]?.TOTAL_ITEMS ?? 0),
  };
}
